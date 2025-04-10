import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "../ui/separator";
import { Check, Github, Globe, Linkedin, Pen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, handleResponseError } from "@/lib/utils";
import { URL_REGEX } from "@/lib/constants";
import { toast } from "sonner";
import { addSocialLink, removeSocialLink } from "@/services/users/api";
import {
  detachSocialLink,
  updateSocialLink,
} from "@/lib/slices/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [isAdding, setIsAdding] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  const [label, setLabel] = useState<string>();
  const [link, setLink] = useState<string>();
  const [addLinkError, setAddLinkError] = useState<string | null>();

  const onAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!label) {
      setAddLinkError("Please select a label.");
      return;
    }

    if (!link) {
      setAddLinkError("Please enter a link.");
      return;
    }

    const isValidUrl = URL_REGEX.test(link);

    if (!isValidUrl) {
      setAddLinkError("Please enter a valid URL.");
      return;
    }

    try {
      const response = await addSocialLink({ label, link });
      toast.success(response.message);

      dispatch(updateSocialLink(response.socialLinks));

      resetAddLinkForm();
    } catch (error) {
      console.log("🚀 ~ Profile.tsx:75 ~ error:", error);

      handleResponseError(error);
    }
  };

  const onRemoveLink = async (label: string) => {
    try {
      if (!label) return;

      const response = await removeSocialLink(label);

      toast.success(response.message);
      dispatch(detachSocialLink(label));
    } catch (error) {
      handleResponseError(error);
    }
  };

  const resetAddLinkForm = () => {
    setIsAdding(false);
    setAddLinkError(null);
    setLabel("");
    setLink("");
  };

  useEffect(() => {
    if (isSocialModalOpen) resetAddLinkForm();
  }, [isSocialModalOpen]);

  return (
    <div className="px-4">
      <div className="bg-accent relative h-40 rounded-xl">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          className="bg-accent absolute -bottom-5 left-5 size-20 rounded-full border object-cover"
        />
      </div>

      <div className="mt-8 space-y-4 px-4">
        <section>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <span className="text-sm font-medium">{user?.email}</span>
        </section>

        <p className="text-muted-foreground mt-2">{user?.bio}</p>

        <Separator />

        <section className="w-full space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <h1 className="text-lg font-bold">Social Links</h1>

              <Dialog
                open={isSocialModalOpen}
                onOpenChange={setIsSocialModalOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pen />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Social Links</DialogTitle>
                    <DialogDescription>
                      Manage your social links here.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2">
                    {user?.socialLinks.map((link) => (
                      <div
                        className={cn(
                          "flex items-center gap-4",
                          !isAdding && "mb-4",
                        )}
                        key={link.link}
                      >
                        <Label className="min-w-[50px] capitalize md:min-w-[80px]">
                          {link.label}
                        </Label>

                        <Input
                          placeholder="Enter link"
                          value={link.link}
                          className="disabled:opacity-100"
                          disabled
                        />

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onRemoveLink(link.label)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}

                    {isAdding && (
                      <div className="mb-4">
                        <form
                          onSubmit={onAddLink}
                          className="flex items-center gap-2"
                        >
                          <Select
                            value={label}
                            onValueChange={(value) => setLabel(value)}
                          >
                            <SelectTrigger className="w-full max-w-[100px]">
                              <SelectValue placeholder="Label" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="github">Github</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder="Enter link here"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                          />

                          <Button type="submit" size="icon">
                            <Check />
                          </Button>
                        </form>
                        {addLinkError && (
                          <span className="text-destructive text-center">
                            {addLinkError}
                          </span>
                        )}
                      </div>
                    )}

                    {(user?.socialLinks?.length ?? 0) < 3 && (
                      <div className="flex gap-2">
                        {isAdding ? (
                          <Button className="flex-1" onClick={resetAddLinkForm}>
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            className="flex-1"
                            onClick={() => setIsAdding(true)}
                            disabled={
                              isAdding || (user?.socialLinks?.length ?? 0) >= 3
                            }
                          >
                            Add Link
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {user?.socialLinks.map((link) => (
              <div
                className="flex items-center gap-2 break-all"
                key={link.label}
              >
                <span className="bg-accent flex rounded-lg p-2">
                  {link.label === "github" && (
                    <Github className="text-accent-foreground" />
                  )}
                  {link.label === "linkedin" && (
                    <Linkedin className="text-accent-foreground" />
                  )}
                  {link.label === "website" && (
                    <Globe className="text-accent-foreground" />
                  )}
                </span>

                <Link
                  to={link.link}
                  className="dark:text-primary-foreground text-primary text-sm font-medium capitalize underline"
                  target="_blank"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <Separator />
      </div>
    </div>
  );
};

export default Profile;
