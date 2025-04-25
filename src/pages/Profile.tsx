import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconCalendar, IconEdit } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "../api/profiles";
import { useFollow } from "../hooks/useFollow";
import React, { useEffect, useRef, useState } from "react";
import Feed from "../components/Feed";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { userId } = useParams();
  const { follow } = useFollow();
  const { authenticatedUser } = useAuth();

  const coverImageRef = useRef<HTMLInputElement | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const profileImageRef = useRef<HTMLInputElement | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const isMyProfile = userId === "me" || authenticatedUser?.id == userId;

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfileById(userId!),
    enabled: !!userId,
  });

  const { mutate } = useMutation({
    mutationKey: ["profile", userId],
    mutationFn: updateProfile,
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));

      if (!userId) return;

      const formData = new FormData();
      formData.append("cover_image", file);
      mutate({ userId, formData });
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));

      if (!userId) return;

      const formData = new FormData();
      formData.append("profile_image", file);
      mutate({ userId, formData });
    }
  };

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
        <Card
          withBorder
          radius="md"
          pos="relative"
          p={0}
          style={{ overflow: "hidden" }}
        >
          <img
            src={
              isMyProfile
                ? coverImagePreview || profile.cover_image
                : profile.cover_image
            }
            alt="cover"
            style={{
              width: "100%",
              height: 200,
              objectFit: "cover",
            }}
          />
          {isMyProfile && (
            <ActionIcon
              variant="transparent"
              pos="absolute"
              top={10}
              right={10}
              onClick={() => coverImageRef.current?.click()}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={coverImageRef}
            onChange={handleCoverImageChange}
          />
        </Card>

        {/* Avatar & Info */}

        <Box pos="relative">
          <Avatar
            size={80}
            radius="xl"
            my="md"
            src={
              isMyProfile
                ? profileImagePreview || profile.profile_image
                : profile.profile_image
            }
          />
          {isMyProfile && (
            <ActionIcon
              variant="transparent"
              pos="absolute"
              top={10}
              left={60}
              onClick={() => profileImageRef.current?.click()}
            >
              <IconEdit size={16} />
            </ActionIcon>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={profileImageRef}
            onChange={handleProfileImageChange}
          />
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
