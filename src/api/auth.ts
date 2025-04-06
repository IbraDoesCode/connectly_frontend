import { LoginData, SignupData } from "../types/Auth";
import apiClient from "./apiClient";

export const getAuthenticatedUserApi = async () => {
  const res = await apiClient.get("/profiles/me/");
  return res.data;
};

export const loginApi = async (loginData: LoginData) => {
  const res = await apiClient.post("/token/", loginData);

  console.log("Auth login response:", res);
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const signupApi = async (signupData: SignupData) => {
  const res = await apiClient.post("/users/register/", signupData);

  console.log("Auth signup response:", res);
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const logoutApi = async () => {
  const res = await apiClient.post("/logout/", {
    refresh: localStorage.getItem("refresh"),
  });

  console.log("Auth logout response:", res);
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  return res.data;
};
