import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCalendar } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "../api/profiles";
import { useFollow } from "../hooks/useFollow";
import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { useAuth } from "../hooks/useAuth";
import { modals } from "@mantine/modals";
import EditProfileModal from "../components/modals/EditProfileModal";

const Profile = () => {
  const { userId } = useParams();
  const { follow } = useFollow();
  const { authenticatedUser } = useAuth();

  const [isFollowing, setIsFollowing] = useState(false);
  const isMyProfile = userId === "me" || authenticatedUser?.id == userId;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileById(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (profile?.is_following !== undefined) {
      setIsFollowing(profile.is_following);
    }
  }, [profile?.is_following, profile, isLoading]);

  if (isLoading || !profile) return <div>Loading profile...</div>;

  const dateJoined = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        {/* Header */}
        <Group gap="md" mb="md">
          <Link to="/home">
            <IconArrowLeft size={18} />
          </Link>
          <Stack gap={0}>
            <Title order={3}>{profile?.username}</Title>
            <Text size="sm" c="dimmed">
              {profile?.posts_count} posts
            </Text>
          </Stack>
        </Group>

        {/* Cover Image */}
        <Container w="100%" pos="relative" p={0} style={{ overflow: "hidden" }}>
          <Image
            src={profile.cover_image}
            w="100%"
            h={200}
            fit="cover"
            fallbackSrc="https://placehold.co/600x400?text=Cover"
          />
        </Container>

        {/* Avatar & Info */}
        <Box pos="relative">
          <Avatar size={80} radius="xl" my="md" src={profile.profile_image} />
        </Box>

        <Group justify="space-between" px={4}>
          <Stack gap={0}>
            <Text size="xl" fw={700}>
              {profile?.full_name}
            </Text>
            <Text size="sm" c="dimmed">
              {profile?.username}
            </Text>
          </Stack>

          {isMyProfile ? (
            <Button
              size="sm"
              variant="outline"
              radius="xl"
              onClick={() =>
                modals.open({
                  title: "Edit Profile",
                  children: <EditProfileModal profile={profile} />,
                })
              }
            >
              Edit
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              radius="xl"
              onClick={() => {
                follow(profile.id);
                setIsFollowing((prev) => !prev);
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </Group>

        {/* Bio */}
        <Text mt="md"> {profile?.bio} </Text>

        {/* Date Joined */}
        <Group gap={4} mt="md">
          <IconCalendar size={14} />
          <Text size="sm" c="dimmed">
            Joined {dateJoined}
          </Text>
        </Group>

        {/* Followers and Following */}
        <Group gap="md" mt="md">
          <Text size="sm">{profile.following} Following</Text>
          <Text size="sm">{profile.followers} Followers</Text>
        </Group>
      </Card>

      {/* User posts */}
      <Feed feedType="posts" userId={profile.id} />
    </>
  );
};

export default Profile;
