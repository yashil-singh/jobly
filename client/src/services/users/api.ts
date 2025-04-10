import { User } from "@/lib/slices/auth/types";
import { DELETE, PATCH, POST } from "../api";
import { SocialLink } from "./types";

export const addSocialLink = async (
  link: SocialLink,
): Promise<{ message: string; socialLinks: SocialLink[] }> => {
  return await POST("/users/social-links", link);
};

export const removeSocialLink = async (
  label: string,
): Promise<{ message: string }> => {
  return await DELETE(`/users/social-links/${label}`);
};

export const editProfile = async (data: {
  name: string;
  bio?: string;
}): Promise<{ message: string; user: User }> => {
  return await PATCH("/users/profile", data);
};
