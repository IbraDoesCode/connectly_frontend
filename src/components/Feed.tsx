import { Center, Loader, Stack, Text } from "@mantine/core";
import Post from "./Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FeedType } from "../types/Types";
import { useEffect } from "react";
import { useIntersection } from "@mantine/hooks";
import { IFeed } from "../types/Post";
import { fetchFeedApi } from "../api/post";

interface FeedProps {
  feedType: FeedType;
}

const Feed = ({ feedType }: FeedProps) => {
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<IFeed>({
    queryKey: ["feed", feedType],
    queryFn: ({ pageParam = 1 }) => fetchFeedApi(feedType, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get("page");
      return nextPage ? parseInt(nextPage) : undefined;
    },
  });

  const { ref: sentinelRef, entry } = useIntersection({
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Flatten all pages into a single array of posts
  const allPosts = data?.pages.flatMap((page) => page.results) || [];

  if (error) {
    return (
      <Text c="red" ta="center">
        Error loading feed: {error.message}
      </Text>
    );
  }

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <Center className="absolute inset-0 z-10">
          <Loader size="xl" type="dots" />
        </Center>
      )}

      <Stack mt="md">
        {allPosts.length > 0 ? (
          <>
            {allPosts.map((post) => (
              <Post key={post.id} post={post} />
            ))}

            {/* Scroll detection element */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {isFetchingNextPage && (
              <Center py="xl">
                <Loader size="sm" />
              </Center>
            )}

            {!hasNextPage && allPosts.length > 0 && (
              <Text c="dimmed" ta="center" py="md">
                No more posts to show 🥲
              </Text>
            )}
          </>
        ) : (
          !isLoading && (
            <Text c="dimmed" ta="center">
              No posts available
            </Text>
          )
        )}
      </Stack>
    </div>
  );
};

export default Feed;
