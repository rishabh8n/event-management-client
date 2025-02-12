import bg1 from "../assets/bg1.jpg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useUserStore from "@/store/userStore";

const formSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  password: z.string().min(6),
});
const RegisterPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const { register, error, isLoading, clearError, clearLoading } =
    useUserStore();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await register(
        data.email,
        data.password,
        data.firstName + " " + data.lastName
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      clearError();
      clearLoading();
    };
  }, []);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="hidden md:block basis-5/12 h-screen p-4 relative">
        <img
          src={bg1}
          alt=""
          className="h-full w-full object-cover rounded-lg"
        />
        <div className="absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%]">
          <h1 className="text-5xl font-semibold text-white text-center">
            Welcome
          </h1>
          <p className="text-white mt-3 text-lg text-center">
            Register to continue
          </p>
        </div>
      </div>
      <div className="md:basis-7/12 flex flex-col justify-center items-center p-4 md:p-0">
        <h1 className="text-3xl md:text-4xl font-semibold w-full md:w-100">
          Create an Account
        </h1>
        <p className="mt-4 mb-8 text-primary/60 text-sm w-full md:w-100">
          Already have an account?{" "}
          <Link to="/users/login" className="text-accent">
            Login
          </Link>
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full md:w-100"
          >
            <div className="flex gap-5 w-full">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className="basis-1/2 py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                        placeholder="First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        className=" basis-1/2 py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                        placeholder="Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="w-full py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={passwordVisible ? "text" : "password"}
                        className="py-6 px-4 outline-none border-secondary bg-secondary focus:border-accent rounded-sm placeholder:text-primary/50"
                        placeholder="Enter your password"
                      />
                      <Button
                        variant={"ghost"}
                        className="absolute top-[50%] translate-y-[-50%] right-1 hover:bg-transparent cursor-pointer"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPasswordVisible((prev) => !prev);
                        }}
                      >
                        {passwordVisible ? (
                          <EyeOffIcon className="size-5" />
                        ) : (
                          <EyeIcon className="size-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 w-full p-6 bg-accent text-primary rounded-sm hover:bg-accent/80 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Register"}
            </Button>
            <p className="text-red-500 text-center">{error}</p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
