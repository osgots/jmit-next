"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import PresenceHeartbeat from "@/components/social/presence-heartbeat";
import SocialNav from "@/components/social/social-nav";

import {
  createClient,
} from "@/lib/supabase/client";


type SocialIdentity = {
  userId: string;
  username: string;
  canPost: boolean;
};


export default function SocialShellNav() {
  const pathname =
    usePathname();

  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    identity,
    setIdentity,
  ] =
    useState<SocialIdentity | null>(
      null,
    );


  useEffect(() => {
    let alive =
      true;


    async function load() {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();


      if (
        !user ||
        !alive
      ) {
        return;
      }


      const {
        data:
          social,
      } =
        await supabase
          .from(
            "social_profiles",
          )
          .select(
            "username, account_type, profile_completed",
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();


      if (
        !social ||
        !alive
      ) {
        return;
      }


      const {
        data:
          appProfile,
      } =
        await supabase
          .from(
            "profiles",
          )
          .select(
            "role",
          )
          .eq(
            "id",
            user.id,
          )
          .maybeSingle();


      const admin =
        appProfile?.role ===
        "admin";


      const canPost =
        admin ||
        (
          social.account_type ===
            "student" &&
          social.profile_completed ===
            true
        );


      if (alive) {
        setIdentity({
          userId:
            user.id,

          username:
            social.username,

          canPost,
        });
      }
    }


    load();


    return () => {
      alive =
        false;
    };
  }, [
    supabase,
  ]);


  if (!identity) {
    return null;
  }


  const hideNavigation =
    pathname ===
      "/social-connect/new" ||

    pathname ===
      "/social-connect/onboarding" ||

    pathname ===
      "/social-connect/verification" ||

    pathname.startsWith(
      "/social-connect/settings",
    ) ||

    pathname.includes(
      "/edit",
    ) ||

    (
      pathname.startsWith(
        "/social-connect/chats/",
      ) &&
      pathname !==
        "/social-connect/chats"
    ) ||

    pathname.startsWith(
      "/social-connect/post/",
    );


  return (
    <>
      <PresenceHeartbeat />

      {!hideNavigation && (
        <SocialNav
          userId={
            identity.userId
          }
          username={
            identity.username
          }
          canPost={
            identity.canPost
          }
        />
      )}
    </>
  );
}
