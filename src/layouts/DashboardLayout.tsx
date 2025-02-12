import Header from "@/components/Header";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
