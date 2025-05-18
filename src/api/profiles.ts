import {
  FollowListResponse,
  FollowStatusResponse,
  Profile,
} from "../types/APITypes";
import client from "./client";

export const getSuggestedProfiles = async () => {
  const res = await client.get<Profile[]>("/profiles/suggestions/");

  return res.data;
};

export const getProfileById = async (userId: string) => {
  const res = await client.get<Profile>(`/profiles/${userId}/`);

  return res.data;
};

export const updateProfile = async ({
  userId,
  formData,
}: {
  userId: string;
  formData: FormData;
}) => {
  const res = await client.patch<Profile>(`/profiles/${userId}/`, formData, {
    headers: {
      "Content-type": "multipart/form-data",
    },
  });

  return res.data;
};

export const followUser = async (userId: number) => {
  const res = await client.post<FollowStatusResponse>(
    `profiles/${userId}/follow/`
  );

  return res.data;
};

export const getFollowList = async ({
  userId,
  type,
}: {
  userId: number;
  type: "followers" | "following";
}) => {
  const res = await client.get<FollowListResponse>(
    `profiles/${userId}/follow/`,
    {
      params: { type: type },
    }
  );

  return res.data;
};
