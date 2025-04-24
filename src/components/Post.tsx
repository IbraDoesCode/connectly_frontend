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
import confirmationModal from "./modals/confirmationModal";

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();

  const isAuthor = post.author.id === authenticatedUser?.id;

  const firstMediaItem = post.media?.[0];
  const firstMediaUrl = firstMediaItem?.url;
  const mediaType = firstMediaItem?.media_type;

  const isImage = mediaType === "image";
  const isVideo = mediaType === "video";

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
    confirmationModal(
      "Delete your post",
      "Are you sure you want to delete this post? This action is irreversible.",
      () => mutate(postId)
    );
  };

  return (
    <Card radius="md" withBorder p="md">
      <Group align="start" gap="xs">
        {/* Avatar */}
        <Link to={`/home/profile/${post.author.id}`}>
          <Avatar radius="xl" src={post.author.profile_image} />
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
              src={firstMediaUrl}
              alt="Post media"
              fit="contain"
              radius="md"
              w="auto"
              mt="xs"
            />
          )}

          {isVideo && (
            <video controls className="rounded-md mt-2 w-full">
              <source src={firstMediaUrl} type="video/mp4" />
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
  );
};

export default Post;
