import {
  redirect,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";


export async function requireSocialUser() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/auth/login",
    );
  }

  return {
    supabase,
    user,
  };
}


export async function requireSocialProfile() {
  const {
    supabase,
    user,
  } =
    await requireSocialUser();

  const {
    data: profile,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select("*")
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (!profile) {
    redirect(
      "/social-connect/onboarding",
    );
  }

  const {
    data: control,
  } =
    await supabase
      .from(
        "social_account_controls",
      )
      .select("status")
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (
    control &&
    control.status !==
      "active"
  ) {
    redirect(
      "/social-connect?error=account-restricted",
    );
  }

  const {
    data:
      appProfile,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id,
      )
      .maybeSingle();

  const isAdmin =
    appProfile?.role ===
    "admin";

  if (
    !isAdmin &&
    profile.account_type ===
      "student" &&
    !profile.profile_completed
  ) {
    redirect(
      "/social-connect/settings?complete=1",
    );
  }

  return {
    supabase,
    user,
    profile,
    isAdmin,
  };
}


export async function requireSocialPoster() {
  const {
    supabase,
    user,
    profile,
    isAdmin,
  } =
    await requireSocialProfile();

  if (
    !isAdmin &&
    profile.account_type !==
      "student"
  ) {
    redirect(
      "/social-connect?error=posting-not-allowed",
    );
  }

  return {
    supabase,
    user,
    profile,
    isAdmin,
  };
}
