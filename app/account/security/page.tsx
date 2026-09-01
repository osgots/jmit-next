import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import AccountSecurity from "@/components/account-security";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";


export default async function AccountSecurityPage() {
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


  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-5 py-10 sm:py-12">

        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-black text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft
            size={16}
          />

          Back to Account
        </Link>


        <div className="mt-7">
          <div className="flex items-center gap-3">
            <ShieldCheck
              className="text-blue-600"
              size={28}
            />

            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Account Security
            </h1>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Manage your login email, password and two-factor authentication.
          </p>
        </div>


        <div className="mt-8">
          <AccountSecurity
            currentEmail={
              user.email ??
              ""
            }
          />
        </div>
      </div>
    </main>
  );
}
