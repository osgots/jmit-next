"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function adminLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/admin/login?error=missing");
  }

  const supabase = await createClient();

  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (
    !profile ||
    !["admin", "editor"].includes(profile.role)
  ) {
    await supabase.auth.signOut();

    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin");
}
