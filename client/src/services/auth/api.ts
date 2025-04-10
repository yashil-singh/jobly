import { SignupPayload, User } from "@/lib/slices/auth/types";
import { GET, POST } from "../api";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/authSchemas";

export const login = async (
  data: z.infer<typeof loginSchema>,
): Promise<{ message: string; user: User }> => {
  const response = await POST("/auth/login", data);
  return response;
};

export const signup = async (
  data: SignupPayload,
): Promise<{ message: string; user: User }> => {
  const response = await POST("/auth/signup", data);
  return response;
};

export const logout = async (): Promise<{ message: "string" }> => {
  const response = await POST("/auth/logout");
  return response;
};

export const fetchUser = async (): Promise<{ user: User }> => {
  const response = await GET("/auth/me");
  return response;
};
