import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import SiteProfileEditor from "@/components/site-profile-editor";
import { createClient } from "@/lib/supabase/server";


export default async function AccountPage() {
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
        "site_profiles",
      )
      .select(
        "display_name, avatar_url, bio",
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  const fallbackName =
    user.email?.split(
      "@",
    )[0] ??
    "JMIT Next Member";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          JMIT Next Account
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d]">
          My Account
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          This is your main JMIT Next website profile. Your Social Connect identity is managed separately.
        </p>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <SiteProfileEditor
            userId={
              user.id
            }
            email={
              user.email ??
              ""
            }
            initialProfile={{
              display_name:
                profile?.display_name ??
                fallbackName,

              avatar_url:
                profile?.avatar_url ??
                null,

              bio:
                profile?.bio ??
                null,
            }}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account/security"
            className="rounded-xl bg-[#071f50] px-5 py-3 text-center text-sm font-black text-white dark:bg-blue-600"
          >
            Account Security
          </Link>

          <Link
            href="/social-connect"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
          >
            Open Social Connect
          </Link>
        </div>

        <div className="hidden">
          <Link
            href="/social-connect"
            className="text-sm font-black text-blue-700"
          >
            Open Social Connect →
          </Link>
        </div>
      </div>
    </main>
  );
}
