"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
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

import Link from "next/link";

import { useState } from "react";


export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    repeatPassword,
    setRepeatPassword,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);


  const handleSignUp =
    async (
      e:
        React.FormEvent,
    ) => {
      e.preventDefault();

      const supabase =
        createClient();

      setIsLoading(
        true,
      );

      setError(
        null,
      );

      if (
        password !==
        repeatPassword
      ) {
        setError(
          "Passwords do not match",
        );

        setIsLoading(
          false,
        );

        return;
      }

      try {
        const {
          error:
            signupError,
        } =
          await supabase.auth.signUp({
            email,
            password,

            options: {
              emailRedirectTo:
                `${window.location.origin}/auth/confirm?next=/`,
            },
          });

        if (
          signupError
        ) {
          throw signupError;
        }

        window.location.href =
          "/auth/sign-up-success";

      } catch (
        caught
      ) {
        setError(
          caught instanceof Error
            ? caught.message
            : "An error occurred",
        );

      } finally {
        setIsLoading(
          false,
        );
      }
    };


  return (
    <div
      className={cn(
        "flex flex-col gap-6 text-slate-950",
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950">
            Create JMIT Next Account
          </CardTitle>

          <CardDescription className="leading-6 text-slate-600">
            Students are encouraged to use their official college-provided email address when available. Visitors and other users may use their personal email address.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
            <strong>
              Student?
            </strong>{" "}
            Prefer your official college email. You will add your Student details separately inside Social Connect.
          </div>

          <form
            onSubmit={
              handleSignUp
            }
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-slate-800"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(
                    e,
                  ) =>
                    setEmail(
                      e.target.value,
                    )
                  }
                  className="bg-white text-slate-950 placeholder:text-slate-400"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-slate-800"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  required
                  value={
                    password
                  }
                  onChange={(
                    e,
                  ) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  className="bg-white text-slate-950"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="repeat-password"
                  className="text-slate-800"
                >
                  Repeat Password
                </Label>

                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={
                    repeatPassword
                  }
                  onChange={(
                    e,
                  ) =>
                    setRepeatPassword(
                      e.target.value,
                    )
                  }
                  className="bg-white text-slate-950"
                />
              </div>

              {error && (
                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading
                }
              >
                {isLoading
                  ? "Creating account..."
                  : "Sign Up"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-slate-700">
              Already have an account?{" "}

              <Link
                href="/auth/login"
                className="font-bold text-blue-700 underline underline-offset-4"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
