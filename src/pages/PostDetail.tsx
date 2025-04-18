import { Link, useParams } from "react-router-dom";
import {
  fetchPostById,
  fetchCommentsByPostId,
  createComment,
  deleteComment,
  likeComment,
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
  Avatar,
  Button,
  Card,
  Center,
  Divider,
  Flex,
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
import { useAuth } from "../hooks/useAuth";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import PostHeader from "../components/PostHeader";
import LikeButton from "../components/LikeButton";

const PostDetail = () => {
  const { postId } = useParams();
  const { authenticatedUser } = useAuth();
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

  const { mutate: deleteCommentFn } = useMutation({
    mutationKey: ["comment"],
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      notifications.show({
        title: "Success",
        message: "Comment deleted!",
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

  const { mutate: like, isPending: isLiking } = useMutation({
    mutationFn: likeComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });

      notifications.show({
        title: "Success",
        message: data.liked ? "Comment liked!" : "Comment unliked!",
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

  const handleDelete = (commentId: number) => {
    modals.openConfirmModal({
      title: "Delete your comment",
      children: (
        <Text>
          Are you sure you want to delete this comment? This action is
          irreversible.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteCommentFn({ postId: post!.id, commentId }),
    });
  };

  const handleLike = (commentId: number) => {
    like({ postId: post!.id, commentId });
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
        {comments.map((comment) => (
          <Card radius="md" withBorder p="md" key={comment.id}>
            <Group align="start" gap="xs">
              {/* Avatar */}
              <Link to={`/home/profile/${comment.author.id}`}>
                <Avatar radius="xl" />
              </Link>

              <Flex direction="column" className="flex-1">
                <PostHeader
                  author={comment.author}
                  isAuthor={authenticatedUser.id === comment.author.id}
                  onDelete={() => handleDelete(comment.id)}
                  createdAt={comment.created_at}
                />

                {/* Comment Content */}
                <Text mt="sm">{comment.content}</Text>

                <Divider my="sm" />

                <LikeButton
                  likeCount={comment.like_count}
                  onClick={() => handleLike(comment.id)}
                  isLiked={comment.is_liked}
                  disabled={isLiking}
                />
              </Flex>
            </Group>
          </Card>
        ))}

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
