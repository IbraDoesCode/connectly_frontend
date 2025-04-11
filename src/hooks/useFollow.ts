import { notifications } from "@mantine/notifications";
import { FollowAPIResponse, followUserApi } from "./../api/profiles";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUserApi,
    onSuccess: (data: FollowAPIResponse) => {
      queryClient.invalidateQueries({ queryKey: ["suggested-profiles"] });

      notifications.show({
        title: "Success",
        message: data.is_following ? "User Followed!" : "User Unfollowed!",
        position: "bottom-right",
        color: "green",
      });
    },
  });

  return {
    follow: followMutation.mutate,
    isFollowing: followMutation.isPending,
  };
};
