import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

const AccountAvatar = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback>
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
      </AvatarFallback>
    </Avatar>
  );
};

export default AccountAvatar;
