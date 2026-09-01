"use client";

import type {
  User,
} from "@supabase/supabase-js";

import {
  LogIn,
  LogOut,
  UserPlus,
  UserRound,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type SiteProfile = {
  display_name: string;
  avatar_url: string | null;
};


export default function HeaderAccount() {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    profile,
    setProfile,
  ] =
    useState<SiteProfile | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  useEffect(() => {
    let alive =
      true;


    async function load() {
      const {
        data: {
          user:
            currentUser,
        },
      } =
        await supabase.auth.getUser();


      if (!alive) {
        return;
      }


      setUser(
        currentUser,
      );


      if (
        currentUser
      ) {
        const {
          data,
        } =
          await supabase
            .from(
              "site_profiles",
            )
            .select(
              "display_name, avatar_url",
            )
            .eq(
              "user_id",
              currentUser.id,
            )
            .maybeSingle();


        if (alive) {
          setProfile(
            data,
          );
        }
      } else {
        setProfile(
          null,
        );
      }


      if (alive) {
        setLoading(
          false,
        );
      }
    }


    load();


    const {
      data:
        authListener,
    } =
      supabase.auth.onAuthStateChange(
        () => {
          load();
        },
      );


    return () => {
      alive =
        false;

      authListener.subscription.unsubscribe();
    };
  }, [
    supabase,
  ]);


  async function logout() {
    await supabase.auth.signOut();

    window.location.href =
      "/";
  }


  if (loading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
    );
  }


  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <LogIn
            size={15}
          />

          Login
        </Link>

        <Link
          href="/auth/sign-up"
          className="hidden items-center gap-2 rounded-xl bg-[#071f50] px-3 py-2.5 text-xs font-black text-white sm:inline-flex dark:bg-blue-600"
        >
          <UserPlus
            size={15}
          />

          Sign Up
        </Link>
      </div>
    );
  }


  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        title="My Account"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-slate-800 transition hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        {profile?.avatar_url ? (
          <img
            src={
              profile.avatar_url
            }
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <UserRound
              size={15}
            />
          </div>
        )}

        <span className="hidden max-w-[110px] truncate text-xs font-black xl:block">
          {profile?.display_name ??
            user.email?.split(
              "@",
            )[0] ??
            "Account"}
        </span>
      </Link>

      <button
        type="button"
        onClick={
          logout
        }
        title="Logout"
        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-red-50 hover:text-red-600 sm:flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <LogOut
          size={16}
        />
      </button>
    </div>
  );
}
