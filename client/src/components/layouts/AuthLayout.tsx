import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return !user ? (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default AuthLayout;
