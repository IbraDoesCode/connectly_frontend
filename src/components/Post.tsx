import {
  ActionIcon,
  Avatar,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconMessageCircle } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Post as PostType } from "../types/APITypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, likePost } from "../api/post";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { notifications } from "@mantine/notifications";
import PostHeader from "./PostHeader";
import LikeButton from "./LikeButton";

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();

  const isAuthor = post.author.id === authenticatedUser?.id;

  const firstMedia =
    post.media && post.media.length > 0 ? post.media[0].url : null;
  const isImage = firstMedia && /\.(jpg|jpeg|png|gif)$/i.test(firstMedia);
  const isVideo = firstMedia && /\.(mp4|mov|webm)$/i.test(firstMedia);

  const queryClient = useQueryClient();
  const { mutate: like, isPending: isLiking } = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      setIsLiked((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
    },
  });

  const { mutate } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      notifications.show({
        title: "Success",
        message: "The post has been deleted successfully.",
        color: "green",
      });
    },
  });

  const handleDelete = (postId: number) => {
    modals.openConfirmModal({
      title: "Delete your post",
      children: (
        <Text>
          Are you sure you want to delete this post? This action is
          irreversible.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => mutate(postId),
    });
  };

  return (
    <>
      <Card radius="md" withBorder p="md">
        <Group align="start" gap="xs">
          {/* Avatar */}
          <Link to={`/home/profile/${post.author.id}`}>
            <Avatar radius="xl" />
          </Link>

          <Flex direction="column" className="flex-1">
            <PostHeader
              author={post.author}
              isAuthor={isAuthor}
              onDelete={() => handleDelete(post.id)}
              createdAt={post.created_at}
              privacyType={post.privacy_type}
            />

            {/* Post Content */}
            <Text mt="sm">{post.content}</Text>

            {isImage && (
              <Image
                src={firstMedia}
                alt="Post media"
                fit="contain"
                radius="md"
                w="auto"
                mt="xs"
              />
            )}

            {isVideo && (
              <video controls className="rounded-md mt-2 w-full">
                <source src={firstMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <Divider my="sm" />

            {/* Like & Comment */}
            <Group gap="sm">
              <LikeButton
                likeCount={post.like_count}
                onClick={() => like(post.id)}
                isLiked={isLiked}
                disabled={isLiking}
              />

              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {post.comment_count}
                </Text>
                <ActionIcon
                  variant="transparent"
                  size="xs"
                  onClick={() => navigate(`/home/post/${post.id}`)}
                >
                  <IconMessageCircle size={16} color="gray" />
                </ActionIcon>
              </Group>
            </Group>
          </Flex>
        </Group>
      </Card>
    </>
  );
};

export default Post;
