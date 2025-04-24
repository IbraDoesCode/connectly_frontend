import { Card, Group, Avatar, Flex, Divider, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import PostHeader from "./PostHeader";
import { Comment as IComment } from "../types/APITypes";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, likeComment } from "../api/post";
import { useAuth } from "../hooks/useAuth";
import confirmationModal from "./modals/confirmationModal";

interface CommentProps {
  comment: IComment;
  postId: string;
}

const Comment = ({ comment, postId }: CommentProps) => {
  const queryClient = useQueryClient();
  const { authenticatedUser } = useAuth();

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

  const { mutate: deleteCommentFn } = useMutation({
    mutationKey: ["comment"],
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
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

  const handleLike = (commentId: number) => {
    like({ postId: Number(postId), commentId });
  };

  const handleDelete = (commentId: number) => {
    confirmationModal(
      "Delete your comment",
      "Are you sure you want to delete this comment? This action is irreversible.",
      () => deleteCommentFn({ postId: Number(postId), commentId })
    );
  };

  return (
    <Card key={comment.id} style={{ background: "transparent" }}>
      <Group align="start" gap="xs">
        {/* Avatar */}
        <Link to={`/home/profile/${comment.author.id}`}>
          <Avatar radius="xl" src={comment.author.profile_image} />
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
  );
};

export default Comment;
