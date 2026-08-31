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
    users,
    pending,
    verified,
    restricted,
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

  const stats = [
    {
      label:
        "Social Users",
      value:
        users.count ?? 0,
    },
    {
      label:
        "Pending Reviews",
      value:
        pending.count ?? 0,
    },
    {
      label:
        "Blue Verified",
      value:
        verified.count ?? 0,
    },
    {
      label:
        "Restricted",
      value:
        restricted.count ??
        0,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071a3d] via-[#17205f] to-violet-800 p-8 text-white shadow-xl md:p-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
            <ShieldCheck
              size={16}
            />

            JMIT Next Admin
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Social Control
            Center
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-violet-100">
            Manage Social
            Connect users,
            verification,
            suspicious accounts
            and community safety
            from one place.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-black backdrop-blur">
            <BadgeCheck
              size={16}
            />

            Primary administrator
            protected
          </div>
        </div>

        <div className="-mt-5 grid gap-4 px-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(
            (stat) => (
              <div
                key={
                  stat.label
                }
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg"
              >
                <p className="text-3xl font-black text-[#071a3d]">
                  {
                    stat.value
                  }
                </p>

                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {
                    stat.label
                  }
                </p>
              </div>
            ),
          )}
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <Link
            href="/admin/social/users"
            className="group rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Users
                size={22}
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#071a3d]">
              Manage All Users
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Search every user,
              identify suspicious
              accounts, suspend,
              restore, revoke blue
              verification or
              permanently delete an
              unauthorized account.
            </p>

            <div className="mt-6 text-sm font-black text-blue-700">
              Open User Manager →
            </div>
          </Link>

          <Link
            href="/admin/social/verifications"
            className="group rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <BadgeCheck
                size={22}
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#071a3d]">
              Blue Tick
              Applications
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Review the private
              selfie + identity-card
              evidence submitted by
              students, confirm their
              roll number and approve,
              reject or request
              another photo.
            </p>

            <div className="mt-6 text-sm font-black text-blue-700">
              Review Applications →
            </div>
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
          >
            ← Main Admin
          </Link>

          <Link
            href="/social-connect"
            className="rounded-xl bg-[#071f50] px-5 py-3 text-sm font-black text-white"
          >
            View Social Connect
          </Link>
        </div>
      </div>
    </main>
  );
}
