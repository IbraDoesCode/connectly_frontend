import {
  ActionIcon,
  Avatar,
  Card,
  Divider,
  Group,
  Image,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconMessageCircle,
  IconHeart,
  IconDotsVertical,
  IconWorld,
  IconUsers,
  IconLock,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Post as PostType } from "../types/APITypes";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, likePost } from "../api/post";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { notifications } from "@mantine/notifications";

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
  const { mutate: like, isPending } = useMutation({
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

  const renderPrivacyIcon = (type: string) => {
    switch (type) {
      case "public":
        return <IconWorld size={13} color="gray" />;
      case "followers":
        return <IconUsers size={13} color="gray" />;
      case "private":
        return <IconLock size={13} color="gray" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card radius="md" withBorder p="md">
        <Group align="start" gap="xs">
          {/* Avatar */}
          <Link to={`/home/profile/${post.author.id}`}>
            <Avatar radius="xl" />
          </Link>

          <div className="flex flex-col flex-1">
            <Group align="start" gap="xs">
              <Text size="sm">{post.author.full_name}</Text>
              <Text size="sm" c="dimmed">
                @{post.author.username}
              </Text>
              {isAuthor && (
                <Menu position="bottom-end">
                  <MenuTarget>
                    <ActionIcon variant="transparent" className="ml-auto">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </MenuTarget>

                  <MenuDropdown>
                    <MenuItem onClick={() => console.log("Edit", post.id)}>
                      Edit Post
                    </MenuItem>
                    <MenuItem color="red" onClick={() => handleDelete(post.id)}>
                      Delete Post
                    </MenuItem>
                  </MenuDropdown>
                </Menu>
              )}
            </Group>
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                {format(post.created_at)}
              </Text>
              {renderPrivacyIcon(post.privacy_type)}
            </Group>

            {/* Post Content */}
            <Text mt="sm">{post.content}</Text>

            {isImage && (
              <Image
                src={firstMedia}
                alt="Post media"
                className="rounded-md border border-gray-700 mt-2 max-h-80 object-contain"
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
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {post.like_count}
                </Text>
                <ActionIcon
                  variant="transparent"
                  size="xs"
                  loading={isPending}
                  onClick={() => like(post.id)}
                >
                  {isLiked ? (
                    <IconHeart size={16} color="red" fill="red" />
                  ) : (
                    <IconHeart size={16} color="gray" />
                  )}
                </ActionIcon>
              </Group>

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
          </div>
        </Group>
      </Card>
    </>
  );
};

export default Post;
