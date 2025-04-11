import { Avatar, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconCalendar, IconEdit } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/profiles";
import { useFollow } from "../hooks/useFollow";
import { useEffect, useState } from "react";

const Profile = () => {
  const { userId } = useParams();
  const { follow } = useFollow();

  const [isFollowing, setIsFollowing] = useState(false);
  const isMyProfile = userId === "me";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileApi(userId!),
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
              100 posts
            </Text>
          </Stack>
        </Group>

        {/* Cover Image */}
        <div className="relative">
          <Card
            withBorder
            radius="md"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <img
              alt="Cover"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
              }}
            />
            {isMyProfile && (
              <Button
                size="xs"
                radius="xl"
                variant="light"
                style={{ position: "absolute", top: 10, right: 10 }}
              >
                <IconEdit size={16} />
              </Button>
            )}
          </Card>
        </div>

        {/* Avatar & Info */}
        <Avatar size={80} radius="xl" my="md" />
        <Group justify="space-between" px={4}>
          <Stack gap={0}>
            <Text size="xl" fw={700}>
              {profile?.full_name}
            </Text>
            <Text size="sm" c="dimmed">
              {profile?.username}
            </Text>
          </Stack>

          {/* Follow Button */}
          {!isMyProfile && (
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

        {/* Link and date joined */}
        <Group gap="xs" mt="md">
          {/* <Group gap={4}>
            <IconLink size={14} />
            <Text component="a" href="" target="_blank" size="sm" c="blue">
              www.google.com
            </Text>
          </Group> */}
          <Group gap={4}>
            <IconCalendar size={14} />
            <Text size="sm" c="dimmed">
              Joined {dateJoined}
            </Text>
          </Group>
        </Group>

        {/* Followers and Following */}
        <Group gap="md" mt="md">
          <Text size="sm">
            <b>0</b> Following
          </Text>
          <Text size="sm">
            <b>0</b> Followers
          </Text>
        </Group>
      </Card>
    </>
  );
};

export default Profile;
