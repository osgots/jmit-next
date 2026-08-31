import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireSocialUser() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
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
  } = await requireSocialUser();

  const { data: profile } =
    await supabase
      .from("social_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

  if (!profile) {
    redirect(
      "/social-connect/onboarding",
    );
  }

  return {
    supabase,
    user,
    profile,
  };
}
