import {
  ArrowLeft,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";
import SocialRolePill from "@/components/social/social-role-pill";
import { createClient } from "@/lib/supabase/server";
import { getPublicSocialIdentityMap, identityKind } from "@/lib/social/public-identity";

import {
  toggleFollow,
} from "../../../actions";


export default async function FollowingPage({
  params,
}: {
  params: Promise<{
    username: string;
  }>;
}) {
  const {
    username,
  } =
    await params;

  const supabase =
    await createClient();


  const {
    data: profile,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select(
        "user_id, username, display_name",
      )
      .eq(
        "username",
        username,
      )
      .maybeSingle();


  if (!profile) {
    notFound();
  }


  const {
    data: { user },
  } =
    await supabase.auth.getUser();


  const {
    data: followRows,
  } =
    await supabase
      .from(
        "social_follows",
      )
      .select(
        "following_id",
      )
      .eq(
        "follower_id",
        profile.user_id,
      );


  const ids =
    (
      followRows ??
      []
    ).map(
      (row) =>
        row.following_id,
    );


  const {
    data: people,
  } =
    ids.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url, account_type",
          )
          .in(
            "user_id",
            ids,
          )
      : {
          data: [],
        };


  const {
    data: roles,
  } =
    ids.length
      ? await supabase
          .from(
            "profiles",
          )
          .select(
            "id, role",
          )
          .in(
            "id",
            ids,
          )
      : {
          data: [],
        };


  const {
    data: blue,
  } =
    ids.length
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .in(
            "user_id",
            ids,
          )
      : {
          data: [],
        };


  const {
    data:
      myFollowing,
  } =
    user && ids.length
      ? await supabase
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
            ids,
          )
      : {
          data: [],
        };


  const roleMap =
    new Map(
      (
        roles ??
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
        blue ??
        []
      ).map(
        (item) =>
          item.user_id,
      ),
    );


  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      ids,
    );


  const followingSet =
    new Set(
      (
        myFollowing ??
        []
      ).map(
        (item) =>
          item.following_id,
      ),
    );


  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-5 py-10">

        <Link
          replace
          href={`/social-connect/u/${profile.username}`}
          className="inline-flex items-center gap-2 text-sm font-black text-blue-700"
        >
          <ArrowLeft
            size={16}
          />

          Back to Profile
        </Link>


        <h1 className="mt-6 text-3xl font-black text-[#071a3d]">
          Following
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          People followed by
          @{profile.username}
        </p>


        <div className="mt-7 space-y-3">

          {(people ?? []).map(
            (person) => {

              const publicIdentity =
                publicIdentityMap.get(
                  person.user_id,
                );


              const resolvedKind =
                identityKind(
                  publicIdentity,
                  person.account_type,
                );


              const badge =
                resolvedKind ===
                  "visitor"
                  ? null
                  : resolvedKind;


              const isMe =
                user?.id ===
                person.user_id;


              return (
                <div
                  key={
                    person.user_id
                  }
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >

                  <Link
                    replace
                    href={`/social-connect/u/${person.username}`}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >

                    {person.avatar_url ? (
                      <img
                        src={
                          person.avatar_url
                        }
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700">
                        {person.display_name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}


                    <div className="min-w-0">

                      <div className="flex items-center gap-1">

                        <p className="truncate font-black text-slate-950 dark:text-white">
                          {
                            person.display_name
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

                      <p className="text-xs text-slate-400">
                        @
                        {
                          person.username
                        }
                      </p>

                      <div className="mt-1">
                        <SocialRolePill
                          kind={
                            resolvedKind
                          }
                          compact
                        />
                      </div>

                    </div>

                  </Link>


                  {!isMe &&
                    user && (
                    <form
                      action={
                        toggleFollow
                      }
                    >

                      <input
                        type="hidden"
                        name="target_user_id"
                        value={
                          person.user_id
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
                        className={`rounded-xl px-4 py-2 text-xs font-black ${
                          followingSet.has(
                            person.user_id,
                          )
                            ? "border border-slate-200 bg-slate-100 text-slate-700"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {followingSet.has(
                          person.user_id,
                        )
                          ? "Following"
                          : "Follow"}
                      </button>

                    </form>
                  )}

                </div>
              );
            },
          )}


          {(people ?? [])
            .length ===
            0 && (
            <div className="py-16 text-center">

              <Users
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-600">
                Not following anyone yet.
              </p>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
