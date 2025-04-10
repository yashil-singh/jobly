import { z } from "zod";
import { PASSWORD_REGEX } from "../constants";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .min(1, { message: "Email address is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password is required."),
});

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(3, { message: "Full name is required." })
    .max(20, { message: "Name must be less than 20 characters." }),
  email: z
    .string({ required_error: "Email address is required." })
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(PASSWORD_REGEX, {
      message:
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
});
