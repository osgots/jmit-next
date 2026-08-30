import {
  ArrowLeft,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { adminLogin } from "./actions";

const errors: Record<string, string> = {
  missing: "Enter both your email and password.",
  invalid: "The email or password is incorrect.",
  unauthorized:
    "This account does not have permission to access the admin portal.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profile &&
      ["admin", "editor"].includes(profile.role)
    ) {
      redirect("/admin");
    }
  }

  const errorMessage =
    params.error && errors[params.error]
      ? errors[params.error]
      : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#041329]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,128,255,0.28),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(0,229,255,0.10),transparent_30%),linear-gradient(135deg,#041126,#082458_60%,#041329)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to JMIT Next
          </Link>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.075] shadow-2xl shadow-black/30 backdrop-blur-2xl">
            <div className="border-b border-white/10 p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg">
                  <GraduationCap size={25} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-white">
                      JMIT ADMIN
                    </h1>

                    <span className="rounded-md bg-cyan-300/10 px-2 py-1 text-[9px] font-black tracking-widest text-cyan-300">
                      SECURE
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Content Management Portal
                  </p>
                </div>
              </div>
            </div>

            <div className="p-7">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Administrator Access
                </p>

                <h2 className="mt-2 text-2xl font-black text-white">
                  Sign in to continue.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Access is restricted to authorized JMIT Next
                  administrators and editors.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
                  {errorMessage}
                </div>
              )}

              <form
                action={adminLogin}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/10"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-[#071a3d] transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <LockKeyhole size={17} />
                  Sign In
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <p className="text-xs leading-6 text-slate-400">
                  Authentication is handled by Supabase Auth while
                  authorization is verified against protected application
                  roles and database Row Level Security policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
