import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileSchema } from "@/lib/schemas/userSchemas";
import { setUser } from "@/lib/slices/auth/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { handleResponseError } from "@/lib/utils";
import { editProfile } from "@/services/users/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    defaultValues: {
      name: user?.name,
      bio: user?.bio,
    },
    resolver: zodResolver(EditProfileSchema),
  });

  const handleEditProfile = async (
    values: z.infer<typeof EditProfileSchema>,
  ) => {
    try {
      const response = await editProfile(values);

      dispatch(setUser(response.user));

      form.reset({ name: values.name, bio: values.bio });

      toast.success(response.message);
    } catch (error) {
      handleResponseError(error);
    }
  };
  return (
    <div>
      <Button className="size-10 md:hidden" variant="ghost" size="icon" asChild>
        <Link to="/settings">
          <ArrowLeft className="size-5" />
        </Link>
      </Button>

      <h1 className="mt-4 text-xl font-bold">Edit Profile</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEditProfile)}
          className="mt-4 space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Email Address</FormLabel>
            <span>
              <Input value={user?.email} disabled />
              <FormDescription className="mt-1">
                Email address can't be changed.
              </FormDescription>
            </span>
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your bio"
                    className="max-h-[200px h-[100px]"
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
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Edit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
