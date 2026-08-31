import {
  BadgeCheck,
  Ban,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import Link from "next/link";

import DeleteSocialUserButton from "@/components/admin/delete-social-user-button";
import SocialBadge from "@/components/social/social-badge";
import { requireManager } from "@/lib/auth/require-manager";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  revokeBlueTick,
  setAccountStatus,
} from "./actions";

export default async function AdminSocialUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    filter?: string;
  }>;
}) {
  await requireManager();

  const params =
    await searchParams;

  const q =
    params.q
      ?.trim()
      .toLowerCase() ??
    "";

  const filter =
    params.filter ??
    "all";

  const admin =
    createAdminClient();

  const {
    data: authData,
  } =
    await admin.auth.admin
      .listUsers({
        page: 1,
        perPage: 1000,
      });

  const users =
    authData?.users ??
    [];

  const ids =
    users.map(
      (user) =>
        user.id,
    );

  const [
    socialResult,
    roleResult,
    controlResult,
    blueResult,
    pendingResult,
  ] =
    await Promise.all([
      ids.length
        ? admin
            .from(
              "social_profiles",
            )
            .select("*")
            .in(
              "user_id",
              ids,
            )
        : Promise.resolve({
            data: [],
          }),

      ids.length
        ? admin
            .from(
              "profiles",
            )
            .select(
              "id, role, full_name",
            )
            .in(
              "id",
              ids,
            )
        : Promise.resolve({
            data: [],
          }),

      ids.length
        ? admin
            .from(
              "social_account_controls",
            )
            .select(
              "user_id, status, reason",
            )
            .in(
              "user_id",
              ids,
            )
        : Promise.resolve({
            data: [],
          }),

      ids.length
        ? admin
            .from(
              "social_blue_verifications",
            )
            .select(
              "user_id, verified_roll_number",
            )
            .in(
              "user_id",
              ids,
            )
        : Promise.resolve({
            data: [],
          }),

      ids.length
        ? admin
            .from(
              "social_verification_applications",
            )
            .select(
              "user_id",
            )
            .eq(
              "status",
              "pending",
            )
            .in(
              "user_id",
              ids,
            )
        : Promise.resolve({
            data: [],
          }),
    ]);

  const socialMap =
    new Map(
      (
        socialResult.data ??
        []
      ).map(
        (item) => [
          item.user_id,
          item,
        ],
      ),
    );

  const roleMap =
    new Map(
      (
        roleResult.data ??
        []
      ).map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  const controlMap =
    new Map(
      (
        controlResult.data ??
        []
      ).map(
        (item) => [
          item.user_id,
          item,
        ],
      ),
    );

  const blueMap =
    new Map(
      (
        blueResult.data ??
        []
      ).map(
        (item) => [
          item.user_id,
          item,
        ],
      ),
    );

  const pendingSet =
    new Set(
      (
        pendingResult.data ??
        []
      ).map(
        (item) =>
          item.user_id,
      ),
    );

  const prepared =
    users
      .map((user) => {
        const social =
          socialMap.get(
            user.id,
          );

        const role =
          roleMap.get(
            user.id,
          );

        const control =
          controlMap.get(
            user.id,
          );

        const blue =
          blueMap.get(
            user.id,
          );

        const isAdmin =
          role?.role ===
          "admin";

        const type =
          isAdmin
            ? "admin"
            : social?.account_type ??
              "none";

        const status =
          control?.status ??
          "active";

        return {
          user,
          social,
          role,
          blue,
          type,
          status,
          pending:
            pendingSet.has(
              user.id,
            ),
        };
      })
      .filter((item) => {
        if (q) {
          const haystack = [
            item.user.email,
            item.social?.username,
            item.social?.display_name,
            item.role?.full_name,
            item.blue?.verified_roll_number,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (
            !haystack.includes(
              q,
            )
          ) {
            return false;
          }
        }

        if (
          filter ===
          "student"
        ) {
          return (
            item.type ===
            "student" &&
            !item.blue
          );
        }

        if (
          filter ===
          "verified"
        ) {
          return Boolean(
            item.blue,
          );
        }

        if (
          filter ===
          "visitor"
        ) {
          return (
            item.type ===
            "visitor"
          );
        }

        if (
          filter ===
          "admin"
        ) {
          return (
            item.type ===
            "admin"
          );
        }

        if (
          filter ===
          "restricted"
        ) {
          return (
            item.status !==
            "active"
          );
        }

        return true;
      });

  const total =
    users.length;

  const students =
    Array.from(
      socialMap.values(),
    ).filter(
      (profile) =>
        profile.account_type ===
        "student",
    ).length;

  const verified =
    blueMap.size;

  const pending =
    pendingSet.size;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-violet-700">
              <ShieldCheck
                size={15}
              />

              Social Administration
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] text-[#071a3d]">
              Manage All Users
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Search, review,
              suspend, restore,
              verify and remove
              Social Connect
              accounts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/social/verifications"
              className="flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white"
            >
              <BadgeCheck
                size={15}
              />

              Applications
            </Link>

            <Link
              href="/admin/social"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black"
            >
              Control Center
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "All Users",
              total,
            ],
            [
              "Students",
              students,
            ],
            [
              "Blue Verified",
              verified,
            ],
            [
              "Pending",
              pending,
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
                className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-3xl font-black text-[#071a3d]">
                  {value}
                </p>

                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {label}
                </p>
              </div>
            ),
          )}
        </div>

        <form className="mt-7 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                name="q"
                defaultValue={
                  params.q ??
                  ""
                }
                placeholder="Search name, username, email or verified roll number..."
                className="w-full rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none"
              />
            </div>

            <select
              name="filter"
              defaultValue={
                filter
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold"
            >
              <option value="all">
                All
              </option>

              <option value="student">
                Students 🟡
              </option>

              <option value="verified">
                Verified 🔵
              </option>

              <option value="visitor">
                Visitors
              </option>

              <option value="admin">
                Admin 🟣
              </option>

              <option value="restricted">
                Restricted
              </option>
            </select>

            <button className="rounded-xl bg-[#071f50] px-6 py-3 text-sm font-black text-white">
              Search
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {prepared.map(
            (item) => {
              const {
                user,
                social,
                blue,
                type,
                status,
                pending,
              } =
                item;

              const isAdmin =
                type ===
                "admin";

              const badge =
                isAdmin
                  ? "admin"
                  : blue
                    ? "blue"
                    : type ===
                        "student"
                      ? "student"
                      : null;

              return (
                <article
                  key={
                    user.id
                  }
                  className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {social?.avatar_url ? (
                      <img
                        src={
                          social.avatar_url
                        }
                        alt=""
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 font-black text-slate-500">
                        {(social?.display_name ??
                          user.email ??
                          "U")
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-black text-slate-900">
                          {social?.display_name ??
                            item.role?.full_name ??
                            "No Social Profile"}
                        </p>

                        {badge && (
                          <SocialBadge
                            kind={
                              badge
                            }
                          />
                        )}

                        <span
                          className={`rounded-md px-2 py-1 text-[9px] font-black uppercase ${
                            status ===
                            "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : status ===
                                  "suspended"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {
                            status
                          }
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-400">
                        {social
                          ? `@${social.username}`
                          : user.email}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-black uppercase text-slate-500">
                          {isAdmin
                            ? "Administrator"
                            : type ===
                                "student"
                              ? blue
                                ? "Verified Student"
                                : "Student"
                              : type ===
                                  "visitor"
                                ? "Visitor"
                                : "No Profile"}
                        </span>

                        {blue && (
                          <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-black text-blue-700">
                            Roll:
                            {" "}
                            {
                              blue.verified_roll_number
                            }
                          </span>
                        )}

                        {pending && (
                          <span className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-black text-amber-700">
                            Verification Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {isAdmin ? (
                      <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-2.5 text-xs font-black text-violet-700">
                        <ShieldCheck
                          size={14}
                        />

                        Protected Admin
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {social && (
                          <Link
                            href={`/social-connect/u/${social.username}`}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black"
                          >
                            View
                          </Link>
                        )}

                        {pending && (
                          <Link
                            href="/admin/social/verifications"
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-black text-blue-700"
                          >
                            Review
                          </Link>
                        )}

                        {blue && (
                          <form
                            action={
                              revokeBlueTick
                            }
                          >
                            <input
                              type="hidden"
                              name="user_id"
                              value={
                                user.id
                              }
                            />

                            <button className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-black text-sky-700">
                              Revoke Blue
                            </button>
                          </form>
                        )}

                        <form
                          action={
                            setAccountStatus
                          }
                        >
                          <input
                            type="hidden"
                            name="user_id"
                            value={
                              user.id
                            }
                          />

                          <input
                            type="hidden"
                            name="status"
                            value={
                              status ===
                              "active"
                                ? "suspended"
                                : "active"
                            }
                          />

                          <button className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
                            {status ===
                            "active" ? (
                              <>
                                <Ban
                                  size={13}
                                />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck
                                  size={13}
                                />
                                Restore
                              </>
                            )}
                          </button>
                        </form>

                        <DeleteSocialUserButton
                          userId={
                            user.id
                          }
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            },
          )}

          {prepared.length ===
            0 && (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">
              No users match this
              search.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
