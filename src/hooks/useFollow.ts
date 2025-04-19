import { notifications } from "@mantine/notifications";
import { followUser } from "./../api/profiles";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollow = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["suggested-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });

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
