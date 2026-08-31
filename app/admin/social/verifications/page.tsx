import {
  BadgeCheck,
  Clock3,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  approveVerification,
  rejectVerification,
} from "./actions";

export default async function AdminVerificationPage() {
  await requireManager();

  const admin =
    createAdminClient();

  const {
    data: applications,
  } =
    await admin
      .from(
        "social_verification_applications",
      )
      .select("*")
      .eq(
        "status",
        "pending",
      )
      .order(
        "submitted_at",
        {
          ascending:
            true,
        },
      );

  const ids =
    (
      applications ??
      []
    ).map(
      (item) =>
        item.user_id,
    );

  const {
    data: profiles,
  } =
    ids.length
      ? await admin
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url",
          )
          .in(
            "user_id",
            ids,
          )
      : {
          data: [],
        };

  const profileMap =
    new Map(
      (
        profiles ?? []
      ).map(
        (profile) => [
          profile.user_id,
          profile,
        ],
      ),
    );

  const prepared =
    await Promise.all(
      (
        applications ??
        []
      ).map(
        async (
          application,
        ) => {
          const {
            data,
          } =
            await admin.storage
              .from(
                "social-verification",
              )
              .createSignedUrl(
                application.evidence_path,
                600,
              );

          return {
            ...application,
            signedUrl:
              data?.signedUrl ??
              null,
          };
        },
      ),
    );

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              <ShieldCheck
                size={15}
              />

              Identity Review
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d]">
              Blue Tick Applications
            </h1>
          </div>

          <Link
            href="/admin/social/users"
            className="rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white"
          >
            Manage Users
          </Link>
        </div>

        <div className="mt-8 space-y-5">
          {prepared.length ===
          0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-14 text-center">
              <Clock3
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black">
                No pending applications.
              </p>
            </div>
          ) : (
            prepared.map(
              (
                application,
              ) => {
                const profile =
                  profileMap.get(
                    application.user_id,
                  );

                return (
                  <article
                    key={
                      application.id
                    }
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {profile?.avatar_url ? (
                            <img
                              src={
                                profile.avatar_url
                              }
                              alt=""
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                              <BadgeCheck
                                size={20}
                                className="text-blue-700"
                              />
                            </div>
                          )}

                          <div>
                            <p className="font-black">
                              {
                                profile?.display_name ??
                                "Student"
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              @
                              {
                                profile?.username ??
                                "unknown"
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Claimed Roll Number
                          </p>

                          <p className="mt-1 font-black">
                            {
                              application.claimed_roll_number
                            }
                          </p>

                          {application.message && (
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {
                                application.message
                              }
                            </p>
                          )}
                        </div>

                        {application.signedUrl && (
                          <a
                            href={
                              application.signedUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700"
                          >
                            View Private Identity Selfie

                            <ExternalLink
                              size={14}
                            />
                          </a>
                        )}
                      </div>

                      <div className="w-full rounded-2xl border border-slate-200 p-5 lg:w-80">
                        <form
                          action={
                            approveVerification
                          }
                          className="space-y-3"
                        >
                          <input
                            type="hidden"
                            name="application_id"
                            value={
                              application.id
                            }
                          />

                          <input
                            name="verified_roll_number"
                            required
                            defaultValue={
                              application.claimed_roll_number
                            }
                            placeholder="Confirmed roll number"
                            className="w-full rounded-xl border border-slate-200 p-3 text-sm"
                          />

                          <textarea
                            name="review_note"
                            rows={2}
                            placeholder="Admin note..."
                            className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm"
                          />

                          <button className="w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">
                            Approve Blue Tick
                          </button>
                        </form>

                        <form
                          action={
                            rejectVerification
                          }
                          className="mt-3 grid grid-cols-2 gap-2"
                        >
                          <input
                            type="hidden"
                            name="application_id"
                            value={
                              application.id
                            }
                          />

                          <button
                            name="decision"
                            value="needs_resubmission"
                            className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-black text-amber-700"
                          >
                            New Photo
                          </button>

                          <button
                            name="decision"
                            value="rejected"
                            className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-black text-red-600"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                );
              },
            )
          )}
        </div>
      </div>
    </main>
  );
}
