import logo from "@/assets/images/logo.png";
import { cn } from "@/lib/utils";

const Loading = ({
  className,
  logoClassName,
}: {
  className?: string;
  logoClassName?: string;
}) => {
  return (
    <div className={cn("flex h-[40vh] items-center justify-center", className)}>
      <img
        src={logo}
        className={cn("h-[100px] animate-pulse", logoClassName)}
      />
    </div>
  );
};

export default Loading;
