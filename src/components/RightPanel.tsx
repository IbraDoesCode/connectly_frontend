import { Avatar, Button, Card } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const RightPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block my-4 mx-2 sticky top-2">
      <Card className="rounded-md">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => navigate(`/profile`)}
            >
              <Avatar size="md" />
              <div className="flex flex-col">
                <span className="font-semibold tracking-tight truncate w-28">
                  John Doe
                </span>
                <span className="text-sm text-slate-500">@johndoe</span>
              </div>
            </div>
            <div>
              <Button radius="xl" variant="outline">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RightPanel;
