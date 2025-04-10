import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import Logo from "../ui/Logo";
import { Link } from "react-router-dom";
import { login } from "@/services/auth/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/slices/auth/authSlice";
import { z } from "zod";
import { loginSchema } from "@/lib/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(values);

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
        onSubmit={form.handleSubmit(handleLogin)}
        className="flex w-full max-w-[350px] flex-col items-start space-y-4 rounded-xl p-4 sm:border"
      >
        <Logo className="mx-auto" />

        <h1 className="mx-auto text-center text-lg font-bold">
          Login to your account.
        </h1>

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

        <Button
          className="w-full"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Login"
          )}
        </Button>

        <span className="text-muted-foreground mx-auto text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary dark:text-secondary font-medium underline"
          >
            Signup
          </Link>
        </span>
      </form>
    </Form>
  );
};

export default Login;
