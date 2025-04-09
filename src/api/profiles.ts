import { IProfile } from "../types/Profile";
import apiClient from "./apiClient";

export const getSuggestedProfilesApi = async () => {
  const res = await apiClient.get<IProfile[]>("/profiles/suggestions/");
  return res.data;
};

export const getProfileApi = async (userId: string) => {
  const res = await apiClient.get<IProfile>(`/profiles/${userId}/`);

  return res.data;
};
