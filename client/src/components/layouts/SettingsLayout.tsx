import { Pen } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { buttonVariants } from "../ui/Button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const SettingsLayout = () => {
  const location = useLocation();
  const isSettingsHome = location.pathname === "/settings";

  return (
    <div className="flex h-full w-full gap-6 px-4">
      <section
        className={cn(
          "w-full md:max-w-[250px] lg:max-w-[300px]",
          !isSettingsHome && "hidden md:block",
        )}
      >
        <h1 className="text-xl font-bold">Settings</h1>

        <div className="mt-4">
          <Link to="/settings/edit-profile">
            <div
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "h-12 w-full justify-start",
              })}
            >
              <Pen className="size-5" />

              <span>Edit Profile</span>
            </div>
          </Link>
        </div>
      </section>

      <Separator orientation="vertical" className="hidden md:block" />

      <section
        className={cn(
          "min-h-[80vh] w-full",
          isSettingsHome && "hidden md:block",
        )}
      >
        <Outlet />
      </section>
    </div>
  );
};

export default SettingsLayout;
