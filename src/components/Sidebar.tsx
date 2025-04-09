import { NavLink, Stack } from "@mantine/core";
import {
  IconHome,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col justify-between border-r border-gray-700 w-20 md:w-full">
        <Stack gap={4} mt="md">
          <NavLink
            onClick={() => navigate("/home")}
            label={<span className="hidden md:block">Home</span>}
            leftSection={<IconHome className="w-6 h-6 mx-auto md:mx-0" />}
            className="flex flex-col items-center md:flex-row md:items-center"
          />
          <NavLink
            onClick={() => navigate(`/home/profile/me/`)}
            label={<span className="hidden md:block">Profile</span>}
            leftSection={<IconUser className="w-6 h-6 mx-auto md:mx-0" />}
            className="flex flex-col items-center md:flex-row md:items-center"
          />
          <NavLink
            label={<span className="hidden md:block">Settings</span>}
            leftSection={<IconSettings className="w-6 h-6 mx-auto md:mx-0" />}
            className="flex flex-col items-center md:flex-row md:items-center"
          />
        </Stack>

        <NavLink
          onClick={() => logout()}
          label={<span className="hidden md:block">Logout</span>}
          leftSection={<IconLogout className="w-6 h-6 mx-auto md:mx-0" />}
          className="flex flex-col items-center md:flex-row md:items-center"
          mb="md"
        />
      </div>
    </div>
  );
};

export default Sidebar;
