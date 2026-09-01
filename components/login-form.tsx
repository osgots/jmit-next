"use client";

import CampusEmailNotice from "@/components/campus-email-notice";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  cn,
} from "@/lib/utils";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";


export function LoginForm({
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

  const router =
    useRouter();


  async function handleLogin(
    event:
      React.FormEvent,
  ) {
    event.preventDefault();

    const supabase =
      createClient();

    setIsLoading(
      true,
    );

    setError(
      null,
    );


    try {
      const {
        error:
          loginError,
      } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });


      if (
        loginError
      ) {
        throw loginError;
      }


      const {
        data:
          assurance,
        error:
          assuranceError,
      } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();


      if (
        assuranceError
      ) {
        throw assuranceError;
      }


      if (
        assurance?.nextLevel ===
          "aal2" &&
        assurance.currentLevel !==
          "aal2"
      ) {
        router.replace(
          "/auth/mfa?next=/",
        );
      } else {
        router.replace(
          "/",
        );
      }


      router.refresh();

    } catch (
      caught
    ) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to sign in.",
      );

    } finally {
      setIsLoading(
        false,
      );
    }
  }


  return (
    <div
      className={cn(
        "flex flex-col gap-6 text-slate-950 dark:text-white",
        className,
      )}
      {...props}
    >
      <Card className="dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-950 dark:text-white">
            Login to JMIT Next
          </CardTitle>

          <CardDescription className="text-slate-600 dark:text-slate-400">
            Enter your email and password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={
              handleLogin
            }
          >

            <CampusEmailNotice />

            <div className="flex flex-col gap-6">

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  required
                  value={
                    email
                  }
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="your@email.com"
                  className="bg-white text-slate-950 placeholder:text-slate-400 dark:bg-slate-950 dark:text-white"
                />
              </div>


              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  required
                  value={
                    password
                  }
                  onChange={(
                    event,
                  ) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white"
                />
              </div>


              {error && (
                <p className="text-sm font-semibold text-red-600">
                  {
                    error
                  }
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
                  ? "Logging in..."
                  : "Login"}
              </Button>
            </div>


            <div className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300">
              Don&apos;t have an account?{" "}

              <Link
                href="/auth/sign-up"
                className="font-bold text-blue-700 underline underline-offset-4 dark:text-blue-400"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
