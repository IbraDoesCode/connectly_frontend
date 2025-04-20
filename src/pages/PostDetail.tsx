import { Link, useParams } from "react-router-dom";
import {
  fetchPostById,
  fetchCommentsByPostId,
  createComment,
} from "../api/post";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Comments } from "../types/common";
import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCaretDownFilled } from "@tabler/icons-react";
import Post from "../components/Post";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

import Comment from "../components/Comment";

const PostDetail = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId!),
  });

  const {
    data,
    isLoading: commentsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Comments>({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => {
      return fetchCommentsByPostId(postId!, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get("page");
      return nextPage ? parseInt(nextPage) : undefined;
    },
    enabled: !!postId,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["comment"],
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

      setComment("");

      notifications.show({
        title: "Success",
        message: "Comment posted!",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleSubmit = () => {
    if (!postId) return;

    const formData = new FormData();
    formData.append("content", comment);
    formData.append("comment_type", "text");

    mutate({ postId: post!.id, formData });
  };

  const comments = data?.pages.flatMap((page) => page.results) || [];

  const fetchNext = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      {/* Loading state */}
      {postLoading && commentsLoading && (
        <Center h="100vh">
          <Loader size="lg" type="dots" />
        </Center>
      )}

      <Stack gap="md">
        {/* Header */}
        <Group>
          <Link to="/home">
            <IconArrowLeft />
          </Link>
          <Title size="xl">Feed</Title>
        </Group>

        {/* Fetched post */}
        {post && <Post post={post} />}

        {/* Comment Input */}
        <Stack gap="md">
          <Textarea
            placeholder="Leave a comment"
            autosize
            size="md"
            minRows={2}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <Group justify="end">
            <Button
              radius="xl"
              variant="outline"
              disabled={!comment}
              loading={isPending}
              onClick={handleSubmit}
            >
              Post
            </Button>
          </Group>
        </Stack>

        {comments.length > 0 && <Divider mb="md" />}

        {/* Fetched comments */}
        <Stack gap="xs">
          {comments.map((comment) => (
            <Comment comment={comment} postId={postId!} key={comment.id} />
          ))}
        </Stack>

        {comments.length > 0 && hasNextPage && !isFetchingNextPage && (
          <ActionIcon
            w="100%"
            variant="outline"
            disabled={!hasNextPage}
            loading={isFetchingNextPage}
            onClick={fetchNext}
          >
            <IconCaretDownFilled />
          </ActionIcon>
        )}

        {/* No comments yet */}
        {!commentsLoading && comments.length === 0 && !isPending && (
          <Text c="dimmed" ta="center">
            No comments yet 🥲
          </Text>
        )}

        {/* No more comments to load */}
        {!hasNextPage && !isFetchingNextPage && comments.length > 0 && (
          <Text ta="center" c="dimmed">
            You're all caught up!
          </Text>
        )}
      </Stack>
    </>
  );
};

export default PostDetail;
