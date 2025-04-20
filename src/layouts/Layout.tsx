import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RightPanel from "../components/RightPanel";

const Layout = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen p-4">
        <Outlet />
      </div>
      <RightPanel />
    </div>
  );
};

export default Layout;
