import {
  ActionIcon,
  Avatar,
  Card,
  Divider,
  Group,
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

const Post = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const liked = false;

  return (
    <>
      <Card className="border border-gray-700 rounded-md p-4">
        <Group align="start" gap="sm">
          {/* Avatar */}
          <Link to="/profile">
            <Avatar radius="xl" />
          </Link>

          <div className="flex flex-col flex-1">
            {/* Post Header */}
            <Group gap="xs">
              <Link to="/profile" className="font-bold">
                John Doe
              </Link>
              <Text size="sm" c="dimmed">
                <Link to="/profile">@johndoe</Link> · 2h ago
              </Text>
              <IconDotsVertical className="ml-auto cursor-pointer" size={16} />
            </Group>

            {/* Post Content */}
            <Text mt="sm">
              This is a sample post text. It will be replaced by actual dynamic
              content later.
            </Text>

            {/* <img
              src=""
              className="rounded-md border border-gray-700 mt-2 max-h-80 object-contain"
            /> */}

            {/* Post Actions */}
            <Divider my="sm" />
            <Group gap="md">
              <ActionIcon variant="transparent" size="xs" color="red">
                {liked ? (
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
