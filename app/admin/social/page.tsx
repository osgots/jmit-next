import {
  BadgeCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export default async function SocialAdminPage() {
  await requireManager();

  const admin =
    createAdminClient();

  const [
    usersResult,
    pendingResult,
    blueResult,
    controlsResult,
  ] =
    await Promise.all([
      admin
        .from(
          "social_profiles",
        )
        .select("*", {
          count: "exact",
          head: true,
        }),

      admin
        .from(
          "social_verification_applications",
        )
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "status",
          "pending",
        ),

      admin
        .from(
          "social_blue_verifications",
        )
        .select("*", {
          count: "exact",
          head: true,
        }),

      admin
        .from(
          "social_account_controls",
        )
        .select("*", {
          count: "exact",
          head: true,
        })
        .in(
          "status",
          [
            "suspended",
            "banned",
          ],
        ),
    ]);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-violet-700">
          <ShieldCheck
            size={16}
          />
          Social Connect Administration
        </div>

        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d]">
          Social Control Center
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Users",
              usersResult.count ??
                0,
            ],
            [
              "Pending",
              pendingResult.count ??
                0,
            ],
            [
              "Blue Verified",
              blueResult.count ??
                0,
            ],
            [
              "Restricted",
              controlsResult.count ??
                0,
            ],
          ].map(
            ([
              label,
              value,
            ]) => (
              <div
                key={
                  label
                }
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-3xl font-black text-[#071a3d]">
                  {value}
                </p>

                <p className="mt-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  {label}
                </p>
              </div>
            ),
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/social/users"
            className="group rounded-[28px] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <Users
              size={26}
              className="text-blue-700"
            />

            <h2 className="mt-5 text-xl font-black">
              Manage All Users
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Search users, suspend
              suspicious accounts,
              restore accounts, revoke
              verification or permanently
              delete unauthorized users.
            </p>
          </Link>

          <Link
            href="/admin/social/verifications"
            className="group rounded-[28px] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <BadgeCheck
              size={26}
              className="text-blue-700"
            />

            <h2 className="mt-5 text-xl font-black">
              Blue Tick Applications
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Privately review student
              identity selfies and approve,
              reject or request new
              verification evidence.
            </p>
          </Link>
        </div>

        <Link
          href="/admin"
          className="mt-8 inline-flex font-black text-blue-700"
        >
          ← Main Admin Dashboard
        </Link>
      </div>
    </main>
  );
}
