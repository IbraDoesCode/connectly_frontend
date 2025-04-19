import { LoginData, SignupData } from "../types/AuthTypes";
import client from "./client";

export const getAuthUser = async () => {
  const res = await client.get("/profiles/me/");
  return res.data;
};

export const login = async (loginData: LoginData) => {
  const res = await client.post("/token/", loginData);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const signup = async (signupData: SignupData) => {
  const res = await client.post("/users/register/", signupData);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const logout = async () => {
  const res = await client.post("/logout/", {
    refresh: localStorage.getItem("refresh"),
  });

  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  return res.data;
};
