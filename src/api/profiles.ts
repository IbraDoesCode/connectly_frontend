import { IProfile } from "../types/Profile";
import apiClient from "./apiClient";

export interface FollowAPIResponse {
  is_following: boolean;
}

export const getSuggestedProfilesApi = async () => {
  const res = await apiClient.get<IProfile[]>("/profiles/suggestions/");

  return res.data;
};

export const getProfileApi = async (userId: string) => {
  const res = await apiClient.get<IProfile>(`/profiles/${userId}/`);

  return res.data;
};

export const followUserApi = async (userId: string) => {
  const res = await apiClient.post<FollowAPIResponse>(
    `profiles/${userId}/follow/`
  );

  return res.data;
};
