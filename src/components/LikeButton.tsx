import { ActionIcon, Group, Text } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

interface LikeButtonProps {
  likeCount: number;
  onClick: () => void;
  isLiked: boolean;
  disabled?: boolean;
}

const LikeButton = ({
  likeCount,
  onClick,
  isLiked,
  disabled: disbaled,
}: LikeButtonProps) => {
  return (
    <Group gap="xs">
      <Text size="sm" c="dimmed">
        {likeCount}
      </Text>
      <ActionIcon
        variant="transparent"
        size="xs"
        onClick={onClick}
        disabled={disbaled}
      >
        <IconHeart
          size={16}
          color={isLiked ? "red" : "gray"}
          fill={isLiked ? "red" : "none"}
        />
      </ActionIcon>
    </Group>
  );
};

export default LikeButton;
