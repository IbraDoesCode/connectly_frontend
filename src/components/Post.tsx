import {
  ActionIcon,
  Avatar,
  Card,
  Divider,
  Group,
  Image,
  Modal,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMessageCircle,
  IconHeart,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { IPost } from "../types/Post";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePostApi } from "../api/post";
import { useState } from "react";

interface PostProps {
  post: IPost;
}

const Post = ({ post }: PostProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);

  const isAuthor = false; // TODO: Implement later

  const firstMedia =
    post.media && post.media.length > 0 ? post.media[0].url : null;
  const isImage = firstMedia && /\.(jpg|jpeg|png|gif)$/i.test(firstMedia);
  const isVideo = firstMedia && /\.(mp4|mov|webm)$/i.test(firstMedia);

  const queryClient = useQueryClient();
  const { mutate: like, isPending } = useMutation({
    mutationFn: likePostApi,
    onSuccess: () => {
      setIsLiked((prev) => !prev);
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });

  return (
    <>
      <Card className="border border-gray-700 rounded-md p-4">
        <Group align="start" gap="xs">
          {/* Avatar */}
          <Link to={`/profile/${post.author.username}`}>
            <Avatar src={post.author.avatar_url} radius="xl" />
          </Link>

          <div className="flex flex-col flex-1">
            <Group align="start" gap="xs">
              <Text size="sm" c="dimmed">
                {post.author.username}
              </Text>
              <Text size="sm" c="dimmed">
                {format(post.created_at)}
              </Text>
              {isAuthor && (
                <IconDotsVertical
                  className="ml-auto cursor-pointer"
                  size={16}
                />
              )}
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

            {/* Post Actions */}
            <Divider my="sm" />
            <Group gap="md">
              <ActionIcon
                variant="transparent"
                size="xs"
                loading={isPending}
                onClick={() => like(post.id)}
              >
                {isLiked ? (
                  <IconHeart size={18} color="red" fill="red" />
                ) : (
                  <IconHeart size={18} color="gray" />
                )}
              </ActionIcon>
              <ActionIcon variant="transparent" size="xs" onClick={open}>
                <IconMessageCircle size={16} color="gray" />
              </ActionIcon>
            </Group>
          </div>
        </Group>
      </Card>

      {/* Comment Modal */}
      <Modal opened={opened} onClose={close} title="Comments">
        <Text>No comments yet 🤔 Be the first one 😉</Text>
      </Modal>
    </>
  );
};

export default Post;
