import {
  Search,
  UserPlus,
  Users,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";
import SocialRolePill from "@/components/social/social-role-pill";
import { createClient } from "@/lib/supabase/server";
import { getPublicSocialIdentityMap, identityKind } from "@/lib/social/public-identity";

import {
  toggleFollow,
} from "../actions";


export default async function SocialSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const params =
    await searchParams;

  const query =
    String(
      (params.q?.trim() ?? "") ?? ""
    )
      .trim()
      .replace(
        /^@+/,
        "",
      );

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();


  let mySocialProfile:
    | {
        username: string;
      }
    | null = null;


  if (user) {
    const {
      data,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "username",
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    mySocialProfile =
      data;
  }


  let profiles:
    any[] = [];


  if (query.length >= 1) {
    const safe =
      query
        .replace(
          /[%_,]/g,
          "",
        )
        .slice(
          0,
          50,
        );


    const {
      data,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, display_name, bio, avatar_url, account_type",
        )
        .or(
          `username.ilike.%${safe}%,display_name.ilike.%${safe}%`,
        )
        .limit(40);


    profiles =
      data ?? [];
  } else {
    /*
     * Initial people discovery.
     */
    const {
      data,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, display_name, bio, avatar_url, account_type",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        )
        .limit(30);


    profiles =
      data ?? [];
  }


  const userIds =
    profiles.map(
      (profile) =>
        profile.user_id,
    );


  const [
    roleResult,
    blueResult,
    followResult,
  ] =
    await Promise.all([
      userIds.length
        ? supabase
            .from(
              "profiles",
            )
            .select(
              "id, role",
            )
            .in(
              "id",
              userIds,
            )
        : Promise.resolve({
            data: [],
          }),

      userIds.length
        ? supabase
            .from(
              "social_blue_verifications",
            )
            .select(
              "user_id",
            )
            .in(
              "user_id",
              userIds,
            )
        : Promise.resolve({
            data: [],
          }),

      user && userIds.length
        ? supabase
            .from(
              "social_follows",
            )
            .select(
              "following_id",
            )
            .eq(
              "follower_id",
              user.id,
            )
            .in(
              "following_id",
              userIds,
            )
        : Promise.resolve({
            data: [],
          }),
    ]);


  const roleMap =
    new Map(
      (
        roleResult.data ??
        []
      ).map(
        (item) => [
          item.id,
          item.role,
        ],
      ),
    );


  const blueSet =
    new Set(
      (
        blueResult.data ??
        []
      ).map(
        (item) =>
          item.user_id,
      ),
    );


  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      userIds,
    );


  const followingSet =
    new Set(
      (
        followResult.data ??
        []
      ).map(
        (item) =>
          item.following_id,
      ),
    );


  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />


      {/* HEADER */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-8">

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            <Users size={15} />

            Social Connect
          </div>


          <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#071a3d]">
            Find People
          </h1>


          <p className="mt-2 text-sm text-slate-500">
            Search Social Connect
            by username or name.
          </p>


          <form className="relative mt-6">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              name="q"
              defaultValue={
                query
              }
              autoFocus
              placeholder="Search users..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-28 text-[15px] font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#071f50] px-5 py-2.5 text-sm font-black text-white"
            >
              Search
            </button>

          </form>

        </div>
      </section>


      {/* RESULTS */}

      <section className="mx-auto max-w-4xl px-5 py-8">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="font-black text-[#071a3d]">
            {query
              ? `Results for "${query}"`
              : "Discover People"}
          </h2>

          <Link
            href="/social-connect"
            className="text-sm font-black text-blue-700"
          >
            Back to Feed
          </Link>

        </div>


        <div className="space-y-3">

          {profiles.map(
            (profile) => {

              const publicIdentity =
                publicIdentityMap.get(
                  profile.user_id,
                );


              const isAdmin =
                publicIdentity?.is_admin ===
                  true;


              const blue =
                publicIdentity?.is_blue_verified ===
                  true;


              const resolvedKind =
                identityKind(
                  publicIdentity,
                  profile.account_type,
                );


              const badge =
                resolvedKind ===
                  "visitor"
                  ? null
                  : resolvedKind;


              const following =
                followingSet.has(
                  profile.user_id,
                );


              const isMe =
                user?.id ===
                profile.user_id;


              return (
                <article
                  key={
                    profile.user_id
                  }
                  className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                >

                  <Link
                    href={`/social-connect/u/${profile.username}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >

                    {profile.avatar_url ? (
                      <img
                        src={
                          profile.avatar_url
                        }
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-slate-100 text-xl font-black text-blue-700">
                        {profile.display_name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}


                    <div className="min-w-0">

                      <div className="flex items-center gap-1.5">

                        <p className="truncate font-black text-slate-900 dark:text-white">
                          {
                            profile.display_name
                          }
                        </p>

                        {badge && (
                          <SocialBadge
                            kind={
                              badge
                            }
                          />
                        )}

                      </div>


                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        @
                        {
                          profile.username
                        }
                      </p>


                      <div className="mt-1">
                        <SocialRolePill
                          kind={
                            identityKind(
                              publicIdentity,
                              profile.account_type,
                            )
                          }
                          compact
                        />
                      </div>


                      {profile.bio && (
                        <p className="mt-2 line-clamp-1 text-sm text-slate-500">
                          {
                            profile.bio
                          }
                        </p>
                      )}

                    </div>

                  </Link>


                  <div className="flex gap-2">

                    <Link
                      href={`/social-connect/u/${profile.username}`}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
                    >
                      View Profile
                    </Link>


                    {!isMe && (
                      user &&
                      mySocialProfile ? (

                        <form
                          action={
                            toggleFollow
                          }
                        >

                          <input
                            type="hidden"
                            name="target_user_id"
                            value={
                              profile.user_id
                            }
                          />

                          <input
                            type="hidden"
                            name="username"
                            value={
                              profile.username
                            }
                          />

                          <button
                            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black ${
                              following
                                ? "border border-slate-200 bg-slate-100 text-slate-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >

                            <UserPlus
                              size={15}
                            />

                            {following
                              ? "Following"
                              : "Follow"}

                          </button>

                        </form>

                      ) : (

                        <Link
                          href="/auth/login"
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white"
                        >
                          Follow
                        </Link>

                      )
                    )}

                  </div>

                </article>
              );
            },
          )}


          {profiles.length ===
            0 && (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white py-16 text-center">

              <Users
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-700">
                No users found.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Try another name or username.
              </p>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}
