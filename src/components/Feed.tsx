import { Stack } from "@mantine/core";
import Post from "./Post";

const Feed = ({ feedType }) => {
  return (
    <Stack mt="md">
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </Stack>
  );
};

export default Feed;
