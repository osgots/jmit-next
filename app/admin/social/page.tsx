import {
  BadgeCheck,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import BlueTick from "@/components/social/blue-tick";

import {
  setVerification,
} from "./actions";

export default async function AdminSocialPage() {
  const {
    supabase,
  } =
    await requireManager();

  const {
    data: socialProfiles,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  const userIds =
    (socialProfiles ?? [])
      .map(
        (profile) =>
          profile.user_id,
      );

  const verifications =
    userIds.length
      ? (
          await supabase
            .from(
              "social_verifications",
            )
            .select("*")
            .in(
              "user_id",
              userIds,
            )
        ).data ?? []
      : [];

  const verificationMap =
    new Map(
      verifications.map(
        (item) => [
          item.user_id,
          item,
        ],
      ),
    );

  return (
    <main className="min-h-screen bg-slate-50 p-5 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              <ShieldCheck
                size={15}
              />

              Admin
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#071a3d]">
              Social Verification
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Only admins/editors can
              create or remove Social
              Connect blue ticks.
            </p>
          </div>

          <Link
            href="/admin"
            className="font-black text-blue-700"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          {(socialProfiles ?? []).map(
            (profile) => {
              const verification =
                verificationMap.get(
                  profile.user_id,
                );

              return (
                <div
                  key={
                    profile.user_id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {profile.avatar_url ? (
                      <img
                        src={
                          profile.avatar_url
                        }
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                        <UserRoundCheck
                          size={20}
                          className="text-blue-700"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-black text-slate-800">
                          {
                            profile.display_name
                          }
                        </p>

                        {verification && (
                          <BlueTick
                            type={
                              verification.badge_type
                            }
                          />
                        )}
                      </div>

                      <p className="text-xs text-slate-400">
                        @
                        {
                          profile.username
                        }
                      </p>
                    </div>

                    <form
                      action={
                        setVerification
                      }
                      className="flex flex-wrap gap-2"
                    >
                      <input
                        type="hidden"
                        name="user_id"
                        value={
                          profile.user_id
                        }
                      />

                      <button
                        name="badge_type"
                        value="verified"
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
                      >
                        ✓ Verify
                      </button>

                      <button
                        name="badge_type"
                        value="official"
                        className="rounded-lg bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-700"
                      >
                        Official
                      </button>

                      <button
                        name="badge_type"
                        value="admin"
                        className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-700"
                      >
                        <BadgeCheck
                          size={13}
                        />
                        Admin
                      </button>

                      <button
                        name="badge_type"
                        value="remove"
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-600"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </main>
  );
}
