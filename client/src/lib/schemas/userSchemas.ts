import { z } from "zod";

export const EditProfileSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(3, { message: "Full name is required." })
    .max(20, { message: "Name must be less than 20 characters." }),
  bio: z.string().optional(),
});
