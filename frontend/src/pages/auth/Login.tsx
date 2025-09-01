/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useAuthStore } from "@/store/useAuthStore";

//* Extending JwtPayload
interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: "Admin" | "Customer" | "Delivery Agent";
  email: string;
}

//* Validation schema
const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters." }),
});

export function Login() {
  //* states
  const [showPassword, setShowPassword] = useState(false);

  //* Zustand actions
  const login = useAuthStore((state) => state.login)

  //* Navigation
  const navigate = useNavigate();
  const location = useLocation();
  const whereTo = location?.state || "/login";

  //* Default values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //* submit
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      // console.log(response);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      //* Store in Zustand (syncs user + tokens)
      login({
        user: result?.user,
        accessToken: result?.accessToken,
        refreshToken: result?.refreshToken,
      });

      //* Persist in localStorage Store tokens securely
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);

      //* Decoding accessToken
      // const token = result.accessToken;
      // const decode = jwtDecode<CustomJwtPayload>(token);
      // const Role = decode.role;
      

      toast.success("Login successful", {
        description: result.message,
      });

      //* redirect to dashboard or protected page based on role
      if (result.user.role === "Admin") navigate("/dashboard/admin");
      else if (result.user.role === "Customer") navigate("/dashboard/customer");
      else if (result.user.role === "Delivery Agent") navigate("/dashboard/agent");
      else navigate(whereTo, { replace: true }); // fallback

    } 
    catch (error: any) {

      toast.error("Login failed", {
        description: error.message,
      });
      console.log(whereTo)
      navigate(whereTo, { replace: true });
    }
    
  }

  //* Quick login
  const handleQuickLogin = async (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    await form.handleSubmit(onSubmit)(); //? Auto-login
  };

  //* Back to Home
  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 border-2 rounded-2xl shadow-md">
        {/* Company Title */}
        <h1
          className="text-2xl font-bold text-sky-800 mb-8 text-center hover:cursor-pointer"
          onClick={goHome}
        >
          CourierTrack
        </h1>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Log In
            </Button>

            {/* Quick login buttons */}
            <div className="flex flex-col gap-2">
              <h3 className="text-center font-semibold text-base font-serif">
                Quick Login Options
              </h3>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-blue-300 transition-colors duration-300 ease-in-out"
                onClick={() => handleQuickLogin("tony@mail.com", "1234")}
              >
                Login as Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-blue-300 transition-colors duration-300 ease-in-out"
                onClick={() => handleQuickLogin("nina@mail.com", "1234")}
              >
                Login as Delivery Agent
              </Button>
              <Button
                type="button"
                variant="outline"
                className="hover:bg-blue-300 transition-colors duration-300 ease-in-out"
                onClick={() => handleQuickLogin("mina@mail.com", "1234")}
              >
                Login as Customer
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/registration" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
