import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="h-screen w-full">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
