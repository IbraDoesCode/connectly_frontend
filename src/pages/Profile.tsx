import { Avatar, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconLink,
  IconEdit,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import FeedTypeSelector from "../components/FeedTypeSelector";
import { useState } from "react";
import Feed from "../components/Feed";

const Profile = () => {
  const [feedType, setFeedType] = useState("posts");
  const isMyProfile = false;

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" mb="md" withBorder>
        {/* Header */}
        <Group gap="md" mb="md">
          <Link to="/">
            <IconArrowLeft size={18} />
          </Link>
          <Stack gap={0}>
            <Title order={3}>Username</Title>
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
              src=""
              alt="Cover"
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: "8px",
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
        <Avatar src="/avatar-placeholder.png" size={80} radius="xl" my="md" />
        <Group justify="space-between" px={4}>
          <Stack gap={0}>
            <Text size="xl" fw={700}>
              Full name
            </Text>
            <Text size="sm" c="dimmed">
              @username
            </Text>
          </Stack>

          {/* Follow Button */}
          <Button size="sm" variant="outline" radius="xl">
            Follow
          </Button>
        </Group>

        {/* Bio */}
        <Text mt="md"> This is a user bio. </Text>

        {/* Link and date joined */}
        <Group gap="xs" mt="md">
          <Group gap={4}>
            <IconLink size={14} />
            <Text component="a" href="" target="_blank" size="sm" c="blue">
              www.google.com
            </Text>
          </Group>
          <Group gap={4}>
            <IconCalendar size={14} />
            <Text size="sm" color="dimmed">
              Joined January 2023
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

      <FeedTypeSelector
        feedType={feedType}
        setFeedType={setFeedType}
        data={[
          { label: "Posts", value: "posts" },
          { label: "Likes", value: "likes" },
        ]}
      />
      <Feed feedType={feedType} />
    </>
  );
};

export default Profile;
