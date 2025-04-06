import apiClient from "./apiClient";
import { FeedType } from "../types/Types";
import { IFeed } from "../types/Post";

export const fetchFeedApi = async (
  feedType: FeedType,
  pageParam: number | unknown
) => {
  const res = await apiClient.get<IFeed>("/profiles/feed/", {
    params: {
      feed_type: feedType,
      page: pageParam,
    },
  });

  return res.data;
};

export const likePostApi = async (postId: number) => {
  const res = await apiClient.post(`/posts/${postId}/like`);

  return res.data;
};
