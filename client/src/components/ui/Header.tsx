import { Bell, Search, Settings } from "lucide-react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import AccountAvatar from "./AccountAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/auth/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { clearUser } from "@/lib/slices/auth/authSlice";
import { toggleTheme } from "@/lib/slices/theme/themeSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      toast.success(response.message);
      dispatch(clearUser());
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  };

  return (
    <header className="bg-primary sticky top-0 z-10 w-full p-4">
      <div className="fluid flex items-center justify-between">
        <section className="flex flex-1 items-center gap-12">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="text-primary-foreground hidden w-full space-x-8 p-4 md:flex">
            <NavLink to="/">
              {({ isActive }) => (
                <>
                  <span
                    className={twMerge(
                      "hidden font-medium hover:underline md:block",
                      isActive && "underline",
                    )}
                  >
                    Home
                  </span>
                </>
              )}
            </NavLink>
            <NavLink to="/search">
              {({ isActive }) => (
                <>
                  <span
                    className={twMerge(
                      "hidden font-medium hover:underline md:block",
                      isActive && "underline",
                    )}
                  >
                    Search
                  </span>
                </>
              )}
            </NavLink>
          </nav>
        </section>

        <section className="flex items-center gap-1">
          <Link to="/search" className="md:hidden">
            <Button
              variant="ghost-dark"
              size="icon"
              className="text-primary-foreground hover:bg-accent-dark active:bg-accent-dark/80 border-accent-dark border"
            >
              <Search className="size-5 text-white" />
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant="ghost-dark"
              size="icon"
              className="text-primary-foreground hover:bg-accent-dark active:bg-accent-dark/80 border-accent-dark border"
            >
              <Settings className="size-5 text-white" />
            </Button>
          </Link>
          <Link to="/notifications">
            <Button
              variant="ghost-dark"
              size="icon"
              className="text-primary-foreground hover:bg-accent-dark active:bg-accent-dark/80 border-accent-dark border"
            >
              <Bell className="size-5 text-white" />
            </Button>
          </Link>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer outline-none!">
                <AccountAvatar src="" className="size-10" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-lg font-medium">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link to="/saved-jobs">
                  <DropdownMenuItem className="cursor-pointer">
                    Saved Jobs
                  </DropdownMenuItem>
                </Link>
                <Link to="/applied-jobs">
                  <DropdownMenuItem className="cursor-pointer">
                    Applied Jobs
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleToggleTheme}
                >
                  Switch Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive hover:text-destructive! cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-bold">
                  Are you absolutely sure?
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm">
                  You will be logged out of your account.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      </div>
    </header>
  );
};

export default Header;
