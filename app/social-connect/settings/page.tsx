import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import ProfileEditor from "@/components/social/profile-editor";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";


export default async function SocialSettingsPage() {
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
    data: profile,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select(
        "username, display_name, bio, avatar_url, account_type",
      )
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


  const accountType =
    isAdmin
      ? "admin"
      : profile.account_type ===
          "visitor"
        ? "visitor"
        : "student";


  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-5 py-12">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Social Connect
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#071a3d]">
            Edit Profile
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Update your profile
            photo, display name,
            username and bio.
          </p>
        </div>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <ProfileEditor
            userId={
              user.id
            }
            isAdmin={
              isAdmin
            }
            mode="edit"
            initialProfile={{
              username:
                profile.username,

              display_name:
                profile.display_name,

              bio:
                profile.bio,

              avatar_url:
                profile.avatar_url,

              account_type:
                accountType,
            }}
          />
        </div>

        <Link
          href={`/social-connect/u/${profile.username}`}
          className="mt-6 block text-center text-sm font-black text-blue-700"
        >
          ← Back to Profile
        </Link>
      </div>
    </main>
  );
}
