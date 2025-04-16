import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signup, login, logout, getAuthenticatedUserApi } from "../api/auth";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      notifications.show({
        title: "Authentication",
        message: "Login success!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      navigate("/home");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      notifications.show({
        title: "Authentication",
        message: error.response?.data?.detail,
        color: "red",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      notifications.show({
        title: "Authentication",
        message: "Sign up successful!",
        position: "top-right",
        color: "green",
      });

      navigate("/home");
    },
    onError: (
      error: AxiosError<{
        username?: string[];
        email?: string[];
      }>
    ) => {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data.username) {
        errorMessage = error.response?.data.username[0];
      } else if (error.response?.data.email) {
        errorMessage = error.response?.data.email[0];
      }

      notifications.show({
        title: "Signup Failed",
        message: errorMessage,
        position: "top-right",
        color: "red",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      notifications.show({
        title: "Authentication",
        message: "Logout success!",
        color: "green",
      });
      queryClient.clear();
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: "Authentication",
        message: error.message,
        color: "red",
      });
    },
  });

  const { data: authenticatedUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: getAuthenticatedUserApi,
    enabled: !!localStorage.getItem("access"),
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    logout: logoutMutation.mutate,

    authenticatedUser,
  };
};
