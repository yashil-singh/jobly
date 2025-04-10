import { Navigate, Outlet } from "react-router-dom";
import Header from "../ui/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const RootLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? (
    <>
      <Header />

      <div className="fluid min-h-[calc(100vh-88px)] pt-6 pb-12">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default RootLayout;
