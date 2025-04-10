import { Avatar, Button, Card } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getSuggestedProfilesApi } from "../api/profiles";
import { IProfile } from "../types/Profile";
import { useFollow } from "../hooks/useFollow";

const RightPanel = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["suggested-profiles"],
    queryFn: getSuggestedProfilesApi,
  });

  const { follow, isFollowing } = useFollow();

  return (
    <div className="hidden lg:block my-4 mx-2 sticky top-2">
      <Card className="rounded-md">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {data?.map((profile: IProfile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between gap-4"
            >
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => navigate(`/home/profile/${profile.id}/`)}
              >
                <Avatar size="md" />
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {profile.full_name}
                  </span>
                  <span className="text-sm text-slate-500">
                    {profile.username}
                  </span>
                </div>
              </div>
              <Button
                radius="xl"
                variant="outline"
                loading={isFollowing}
                onClick={() => follow(profile.id)}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RightPanel;
