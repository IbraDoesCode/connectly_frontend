import { FollowStatusResponse, Profile } from "../types/APITypes";
import client from "./client";

export const getSuggestedProfilesApi = async () => {
  const res = await client.get<Profile[]>("/profiles/suggestions/");

  return res.data;
};

export const fetchProfileById = async (userId: string) => {
  const res = await client.get<Profile>(`/profiles/${userId}/`);

  return res.data;
};

export const followUser = async (userId: number) => {
  const res = await client.post<FollowStatusResponse>(
    `profiles/${userId}/follow/`
  );

  return res.data;
};
