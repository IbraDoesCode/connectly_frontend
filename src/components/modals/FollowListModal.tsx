import { Avatar, Box, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getFollowList } from "../../api/profiles";

const FollowListModal = ({
  userId,
  type,
}: {
  userId: number;
  type: "followers" | "following";
}) => {
  const {
    data,
    isFetching: isLoading,
    isError,
  } = useQuery({
    queryKey: [type, userId],
    queryFn: () => getFollowList({ userId, type }),
  });

  return (
    <Stack>
      {isLoading && (
        <Center>
          <Loader size="md" ta="center" />
        </Center>
      )}

      {isError && <Text ta="center">Error loading requets</Text>}

      {data &&
        !isLoading &&
        data?.map((user) => (
          <Group key={user.id} align="start" gap="xs">
            <Group align="center" gap="xs">
              <Avatar radius="xl" src={user?.profile_image} />
              <Box>
                <Text size="sm">{user.full_name}</Text>
                <Text size="sm" c="dimmed">
                  @{user.username}
                </Text>
              </Box>
            </Group>
          </Group>
        ))}
    </Stack>
  );
};

export default FollowListModal;
