import { LoginData, SignupData } from "../types/AuthTypes";
import client from "./client";

export const getAuthenticatedUserApi = async () => {
  const res = await client.get("/profiles/me/");
  return res.data;
};

export const loginApi = async (loginData: LoginData) => {
  const res = await client.post("/token/", loginData);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const signupApi = async (signupData: SignupData) => {
  const res = await client.post("/users/register/", signupData);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const logoutApi = async () => {
  const res = await client.post("/logout/", {
    refresh: localStorage.getItem("refresh"),
  });

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  return res.data;
};
