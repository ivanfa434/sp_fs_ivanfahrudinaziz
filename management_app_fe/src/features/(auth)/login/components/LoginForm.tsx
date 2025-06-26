"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import Link from "next/link";
import useLogin from "@/hooks/api/auth/useLogin";
import { LoginSchema } from "../schemas";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { mutateAsync: login, isPending } = useLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div
        className={cn(
          "flex flex-col gap-6 w-full max-w-sm sm:max-w-md",
          className
        )}
        {...props}
      >
        <Card className="border-0 shadow-lg sm:border sm:shadow-md">
          <CardHeader className="space-y-1 text-center sm:text-left">
            <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 sm:h-11"
                  />
                  {formik.touched.email && !!formik.errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your Password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 sm:h-11"
                  />
                  {formik.touched.password && !!formik.errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Loading..." : "Login"}
                </Button>
              </div>
              <div className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
