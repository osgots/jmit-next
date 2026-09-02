import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import ProfileCoverEditor from "@/components/social/profile-cover-editor";
import ProfileEditor from "@/components/social/profile-editor";
import RollVisibilityToggle from "@/components/social/roll-visibility-toggle";
import SiteHeader from "@/components/site-header";

import {
  createClient,
} from "@/lib/supabase/server";


export default async function SocialSettingsPage() {
  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    redirect(
      "/auth/login",
    );
  }


  const {
    data:
      profile,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select(
        "username, display_name, bio, avatar_url, account_type, roll_number, department, semester, profile_completed, show_verified_roll_number, cover_url, cover_path, cover_type",
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


  const incompleteStudent =
    !isAdmin &&
    accountType ===
      "student" &&
    !profile.profile_completed;


  const {
    data:
      verification,
  } =
    !isAdmin
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "verified_roll_number",
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle()
      : {
          data:
            null,
        };


  /*
   * Existing rule:
   * Visitors cannot upload Social Connect media.
   */
  const canCustomizeCover =
    isAdmin ||
    (
      accountType ===
        "student" &&
      profile.profile_completed
    );


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">

      <SiteHeader />


      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-12">

        {incompleteStudent && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">

            <p className="font-black">
              Student profile update required
            </p>

            <p className="mt-2 text-sm leading-6">
              Add your Roll Number, Department and Semester to continue using all Student Social Connect features.
            </p>

          </div>
        )}


        <div>

          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Social Connect
          </p>


          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#071a3d] dark:text-white">
            Edit Profile
          </h1>

        </div>


        {canCustomizeCover && (
          <div className="mt-8">

            <ProfileCoverEditor
              userId={
                user.id
              }
              initialUrl={
                profile.cover_url
              }
              initialPath={
                profile.cover_path
              }
              initialType={
                profile.cover_type
              }
              isAdmin={
                isAdmin
              }
            />

          </div>
        )}


        <div className="mt-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">

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

              roll_number:
                profile.roll_number,

              department:
                profile.department,

              semester:
                profile.semester,

              profile_completed:
                profile.profile_completed,
            }}
          />

        </div>


        {verification?.verified_roll_number && (
          <div className="mt-6">

            <RollVisibilityToggle
              initialVisible={
                Boolean(
                  profile.show_verified_roll_number,
                )
              }
              rollNumber={
                verification.verified_roll_number
              }
            />

          </div>
        )}


        <Link
          replace
          href={`/social-connect/u/${profile.username}`}
          className="mt-6 block text-center text-sm font-black text-blue-700 dark:text-blue-400"
        >
          ← Back to Profile
        </Link>

      </div>
    </main>
  );
}
