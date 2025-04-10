import { ArrowLeft } from "lucide-react";
import searching from "@/assets/images/searching.svg";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-8 p-12 md:flex-row md:gap-14">
      <div className="bg-background dark:bg-foreground rounded-xl p-4">
        <img src={searching} className="text-foreground size-[450px]" />
      </div>

      <div className="flex flex-col items-center gap-6 md:items-start">
        <h1 className="text-4xl font-black md:text-6xl">Oops!</h1>

        <span className="text-muted-foreground max-w-[300px] text-center text-lg font-bold md:text-left md:text-2xl">
          We couldn't find the page you were looking for
        </span>

        <Link to="/" className="w-fit">
          <Button variant="ghost">
            <ArrowLeft className="size-4" /> Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
