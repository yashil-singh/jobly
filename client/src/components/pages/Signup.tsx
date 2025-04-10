import { setUser } from "@/lib/slices/auth/authSlice";
import { SignupPayload } from "@/lib/slices/auth/types";
import { AppDispatch } from "@/lib/store";
import { signup } from "@/services/auth/api";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Logo from "../ui/Logo";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/schemas/authSchemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Signup = () => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = async (payload: SignupPayload) => {
    try {
      const response = await signup(payload);
      dispatch(setUser(response.user));
      toast.success(response.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Oops! Something went wrong.");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignup)}
        className="flex w-full max-w-[350px] flex-col items-start space-y-4 rounded-xl p-4 sm:border"
      >
        <Logo className="mx-auto" />

        <h1 className="mx-auto text-center text-lg font-bold">
          Create a new account.
        </h1>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Signup"
          )}
        </Button>

        <span className="text-muted-foreground mx-auto text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary dark:text-secondary font-medium underline"
          >
            Login
          </Link>
        </span>
      </form>
    </Form>
  );
};

export default Signup;
