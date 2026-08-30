import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireManager() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !["admin", "editor"].includes(profile.role)
  ) {
    redirect("/");
  }

  return {
    supabase,
    user,
    profile,
  };
}
