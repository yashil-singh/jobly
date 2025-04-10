import { twMerge } from "tailwind-merge";
import logo from "../../assets/images/logo.png";

const Logo = ({ className }: { className?: string }) => {
  return <img src={logo} className={twMerge("h-10", className)} />;
};

export default Logo;
