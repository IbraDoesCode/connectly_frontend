import axios from "axios";
import { LoginData, SignupData } from "../types/AuthTypes";
import client from "./client";
import { GoogleLoginResponse } from "../types/APITypes";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (loginData: LoginData) => {
  const res = await client.post("/token/", loginData);

  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);

  return res.data;
};

export const signup = async (signupData: SignupData) => {
  const res = await client.post("/users/signup/", signupData);

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

export const verifyGoogleToken = async (token: string) => {
  const res = await axios.post<GoogleLoginResponse>(
    `${BASE_API_URL}/google/signin/`,
    {
      access_token: token,
    }
  );

  if (res.data.access && res.data.refresh) {
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
  }

  return res.data;
};

export const completeSignUp = async ({
  token,
  username,
}: {
  token: string;
  username: string;
}) => {
  const res = await axios.post<GoogleLoginResponse>(
    `${BASE_API_URL}/google/complete-signup/`,
    {
      access_token: token,
      username,
    }
  );

  if (res.data.access && res.data.refresh) {
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
  }

  return res.data;
};
