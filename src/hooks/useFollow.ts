import { notifications } from "@mantine/notifications";
import { followUserApi } from "./../api/profiles";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUserApi,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["suggested-profiles"] });
      notifications.show({
        message: "User Followed!",
        position: "top-right",
        color: "green",
      });
    },
  });

  return {
    follow: followMutation.mutate,
    isFollowing: followMutation.isPending,
  };
};
