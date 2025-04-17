import { LikeStatusResponse, Post } from "../types/APITypes";
import { Comments } from "../types/common";
import client from "./client";
import { FeedType } from "../types/common";
import { Feed } from "../types/common";

export const fetchFeed = async (
  feedType: FeedType,
  pageParam: number | unknown
) => {
  const res = await client.get<Feed>("/profiles/feed/", {
    params: {
      feed_type: feedType,
      page: pageParam,
    },
  });

  return res.data;
};

export const createPost = async (formData: FormData) => {
  const res = await client.post("/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const fetchPostById = async (postId: string) => {
  const res = await client.get<Post>(`/posts/${postId}/`);

  return res.data;
};

export const likePost = async (postId: number) => {
  const res = await client.post(`/posts/${postId}/like`);

  return res.data;
};

export const deletePost = async (postId: number) => {
  const res = await client.delete(`/posts/${postId}/`);

  return res.data;
};

export const fetchPostsByUserId = async (
  userId: number,
  pageParam: number | unknown
) => {
  const res = await client.get(`/profiles/${userId}/posts/`, {
    params: { page: pageParam },
  });

  return res.data;
};

export const fetchCommentsByPostId = async (
  postId: string,
  pageParam: number | unknown
) => {
  const res = await client.get<Comments>(`/posts/${postId}/comments`, {
    params: {
      page: pageParam,
    },
  });

  return res.data;
};

export const createComment = async ({
  postId,
  formData,
}: {
  postId: number;
  formData: FormData;
}) => {
  const res = await client.post(`/posts/${postId}/comments`, formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}) => {
  const res = await client.delete(`/posts/${postId}/comments/${commentId}/`);

  return res.data;
};

export const likeComment = async ({
  postId,
  commentId,
}: {
  postId: number;
  commentId: number;
}) => {
  const res = await client.post<LikeStatusResponse>(
    `/posts/${postId}/comments/${commentId}/like`
  );

  return res.data;
};
