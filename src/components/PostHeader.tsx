import {
  ActionIcon,
  Group,
  Text,
  Menu,
  MenuDropdown,
  MenuItem,
  MenuTarget,
} from "@mantine/core";
import { Author } from "../types/APITypes";
import {
  IconDotsVertical,
  IconLock,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { format } from "timeago.js";

interface PostHeaderProps {
  author: Author;
  isAuthor: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  createdAt: string;
  privacyType?: "public" | "followers" | "private";
}

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

const PostHeader = ({
  author,
  isAuthor,
  onDelete,
  onEdit,
  createdAt,
  privacyType,
}: PostHeaderProps) => {
  return (
    <>
      <Group align="start" gap="xs">
        <Text size="sm">{author.full_name}</Text>
        <Text size="sm" c="dimmed">
          @{author.username}
        </Text>
        {isAuthor && (
          <Menu position="bottom-end">
            <MenuTarget>
              <ActionIcon variant="transparent" className="ml-auto">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </MenuTarget>

            <MenuDropdown>
              <MenuItem color="red" onClick={onDelete}>
                Delete
              </MenuItem>
              {onEdit && (
                <MenuItem color="red" onClick={onEdit}>
                  Edit
                </MenuItem>
              )}
            </MenuDropdown>
          </Menu>
        )}
      </Group>
      <Group gap="xs">
        <Text size="xs" c="dimmed">
          {format(createdAt)}
        </Text>
        {privacyType && renderPrivacyIcon(privacyType)}
      </Group>
    </>
  );
};

export default PostHeader;
