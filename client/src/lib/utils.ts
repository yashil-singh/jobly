import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleResponseError(error: unknown) {
  if (error instanceof AxiosError) {
    toast.error(error.response?.data.message);
  } else {
    toast.error("Oops! Something went wrong.");
  }
}
