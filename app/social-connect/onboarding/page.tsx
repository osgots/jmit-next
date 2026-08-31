import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import ProfileEditor from "@/components/social/profile-editor";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export default async function SocialOnboardingPage() {
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

  const {
    data: existing,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select("username")
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (existing) {
    redirect(
      `/social-connect/u/${existing.username}`,
    );
  }

  const {
    data: appProfile,
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

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-xl px-5 py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          Social Connect
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d]">
          Create your profile.
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Student accounts receive a
          yellow account badge. Blue
          verification is available
          separately after administrator
          identity review.
        </p>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <ProfileEditor
            userId={
              user.id
            }
            isAdmin={
              isAdmin
            }
          />
        </div>

        <Link
          href="/social-connect"
          className="mt-5 block text-center text-sm font-black text-blue-700"
        >
          Back to Social Connect
        </Link>
      </div>
    </main>
  );
}
