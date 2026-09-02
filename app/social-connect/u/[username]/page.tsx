import {
  BadgeCheck,
  Camera,
  Grid3X3,
  Eye,
  ImageIcon,
  Pencil,
  Plus,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import { ProfileRealtimeRefresh } from "@/components/social/realtime-refresh";
import SocialBadge from "@/components/social/social-badge";
import SocialRolePill from "@/components/social/social-role-pill";
import PresenceLabel from "@/components/social/presence-label";
import UserActionsMenu from "@/components/social/user-actions-menu";
import MessageUserButton from "@/components/social/message-user-button";
import { createClient } from "@/lib/supabase/server";
import { getPublicSocialIdentityMap, identityKind } from "@/lib/social/public-identity";

import {
  toggleFollow,
} from "../../actions";


export default async function SocialProfilePage({
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
      .select("*")
      .eq(
        "username",
        username,
      )
      .maybeSingle();


  if (!profile) {
    notFound();
  }


  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      [
        profile.user_id,
      ],
    );


  const publicIdentity =
    publicIdentityMap.get(
      profile.user_id,
    );


  const {
    data: { user },
  } =
    await supabase.auth.getUser();


  /*
   * Admin status comes from the
   * authoritative application role,
   * not merely from social profile data.
   */
  const {
    data:
      targetAppProfile,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        profile.user_id,
      )
      .maybeSingle();


  const isAdmin =
    publicIdentity?.is_admin ===
      true ||
    targetAppProfile?.role ===
      "admin";


  const blue =
    !isAdmin &&
    publicIdentity?.is_blue_verified
      ? {
          verified_roll_number:
            publicIdentity.verified_roll_number,

          approved_at:
            publicIdentity.approved_at,
        }
      : null;


  const [
    postsResult,
    followersResult,
    followingResult,
  ] =
    await Promise.all([

      supabase
        .from(
          "social_posts",
        )
        .select("*")
        .eq(
          "user_id",
          profile.user_id,
        )
        .eq(
          "status",
          "active",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        ),


      supabase
        .from(
          "social_follows",
        )
        .select("*", {
          count:
            "exact",

          head:
            true,
        })
        .eq(
          "following_id",
          profile.user_id,
        ),


      supabase
        .from(
          "social_follows",
        )
        .select("*", {
          count:
            "exact",

          head:
            true,
        })
        .eq(
          "follower_id",
          profile.user_id,
        ),
    ]);


  const posts =
    postsResult.data ??
    [];


  const followers =
    followersResult.count ??
    0;


  const following =
    followingResult.count ??
    0;


  const isOwnProfile =
    user?.id ===
    profile.user_id;


  let isFollowing =
    false;


  if (
    user &&
    !isOwnProfile
  ) {
    const {
      data,
    } =
      await supabase
        .from(
          "social_follows",
        )
        .select(
          "follower_id",
        )
        .eq(
          "follower_id",
          user.id,
        )
        .eq(
          "following_id",
          profile.user_id,
        )
        .maybeSingle();

    isFollowing =
      Boolean(data);
  }


  const badge =
    publicIdentity?.badge_kind ??
    (
      isAdmin
        ? "admin"
        : blue
          ? "blue"
          : profile.account_type ===
              "student"
            ? "student"
            : null
    );


  const accountTitle =
    publicIdentity?.account_title ??
    (
      isAdmin
        ? "Administrator"
        : blue
          ? "Verified Student"
          : profile.account_type ===
              "student"
            ? "Student"
            : "Visitor"
    );


  const canPost =
    isAdmin ||
    profile.account_type ===
      "student";


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <SiteHeader />

      <ProfileRealtimeRefresh
        userId={
          profile.user_id
        }
      />

      <div className="mx-auto max-w-5xl px-0 pb-16 sm:px-5 sm:pt-8">


        {/* FACEBOOK-LIKE PROFILE HEADER */}

        <section className="overflow-hidden border-y border-slate-200 bg-white shadow-sm sm:rounded-[30px] sm:border dark:border-slate-800 dark:bg-slate-900">
          <div
            className={`relative h-44 sm:h-56 ${
              isAdmin
                ? "bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,.75),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,.8),transparent_35%),linear-gradient(135deg,#4c1d95,#7c3aed,#c026d3)]"
                : blue
                  ? "bg-[radial-gradient(circle_at_75%_20%,rgba(34,211,238,.8),transparent_30%),linear-gradient(135deg,#1e40af,#2563eb,#0891b2)]"
                  : profile.account_type ===
                      "student"
                    ? "bg-[radial-gradient(circle_at_75%_20%,rgba(253,224,71,.9),transparent_35%),linear-gradient(135deg,#d97706,#f59e0b,#facc15)]"
                    : "bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.22),transparent_55%)]" />
          </div>


          <div className="relative px-5 pb-7 sm:px-8">
            <div className="-mt-16 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">


              {/* AVATAR */}

              <div className="relative w-fit shrink-0">
                <div className="rounded-full bg-white p-[5px] shadow-xl">
                  {profile.avatar_url ? (
                    <img
                      src={
                        profile.avatar_url
                      }
                      alt={`${profile.display_name} profile`}
                      className="h-32 w-32 rounded-full bg-slate-100 object-cover sm:h-36 sm:w-36"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-4xl font-black text-slate-500 sm:h-36 sm:w-36">
                      {profile.display_name
                        .slice(
                          0,
                          1,
                        )
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {badge && (
                  <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-white shadow">
                    <SocialBadge
                      kind={
                        badge
                      }
                      size={
                        25
                      }
                    />
                  </div>
                )}
              </div>


              {/* NAME */}

              <div className="min-w-0 flex-1 sm:pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-3xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white sm:text-4xl">
                    {
                      profile.display_name
                    }
                  </h1>

                  {badge && (
                    <SocialBadge
                      kind={
                        badge
                      }
                      size={
                        23
                      }
                    />
                  )}
                </div>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  @
                  {
                    profile.username
                  }
                </p>

                <PresenceLabel
                  userId={
                    profile.user_id
                  }
                />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <SocialRolePill
                    kind={
                      badge ??
                      "visitor"
                    }
                  />

                  {isAdmin && (
                    <ShieldCheck
                      size={16}
                      className="text-violet-600"
                    />
                  )}
                </div>
              </div>


              {/* ACTIONS */}

              <div className="flex flex-wrap gap-2 sm:pb-3">

                {!isOwnProfile && user && (
                  <MessageUserButton
                    targetUserId={profile.user_id}
                  />
                )}

                {!isOwnProfile && user && (
                  <UserActionsMenu
                    targetUserId={
                      profile.user_id
                    }
                  />
                )}

                {isOwnProfile ? (
                  <>
                    <Link
                      href="/social-connect/settings"
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-800 transition hover:bg-slate-100"
                    >
                      <Pencil
                        size={15}
                      />

                      Edit Profile
                    </Link>

                    {canPost && (
                      <Link
                        href="/social-connect/new"
                        className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white"
                      >
                        <Plus
                          size={16}
                        />

                        New Post
                      </Link>
                    )}

                    {!isAdmin &&
                      profile.account_type ===
                        "student" &&
                      !blue && (
                      <Link
                        href="/social-connect/verification"
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white"
                      >
                        <BadgeCheck
                          size={16}
                        />

                        Get Blue Tick
                      </Link>
                    )}
                  </>
                ) : user ? (
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

                    <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-blue-700">
                      <UserPlus
                        size={16}
                      />

                      {isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/auth/login"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white"
                  >
                    Log in to Follow
                  </Link>
                )}
              </div>
            </div>


            {/* SOCIAL STATS */}

            <div className="mt-7 flex border-y border-slate-100 py-4">
              <div className="flex-1 text-center sm:flex-none sm:px-7">
                <p className="text-xl font-black text-[#071a3d] dark:text-white">
                  {posts?.length ??
                    0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Posts
                </p>
              </div>

              <Link
                href={`/social-connect/u/${profile.username}/followers`}
                className="flex-1 border-x border-slate-100 text-center transition hover:bg-slate-50 dark:hover:bg-slate-800 sm:flex-none sm:px-7"
              >
                <p className="text-xl font-black text-[#071a3d] dark:text-white">
                  {followers ?? 0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Followers
                </p>
              </Link>

              <Link
                href={`/social-connect/u/${profile.username}/following`}
                className="flex-1 text-center transition hover:bg-slate-50 dark:hover:bg-slate-800 sm:flex-none sm:px-7"
              >
                <p className="text-xl font-black text-[#071a3d] dark:text-white">
                  {following ?? 0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Following
                </p>
              </Link>
            </div>


            {/* BIO */}

            {(profile.bio ||
              blue) && (
              <div className="mt-6 max-w-2xl">
                {profile.bio && (
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                    {
                      profile.bio
                    }
                  </p>
                )}

                {blue && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
                    <BadgeCheck
                      size={17}
                    />

                    Verified Student

                    <span className="text-blue-300">
                      •
                    </span>

                    Roll No.
                    <strong>
                      {
                        blue.verified_roll_number
                      }
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>


        {/* INSTAGRAM-LIKE POSTS */}

        <section className="mt-6 bg-white sm:rounded-[28px] sm:border sm:border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#071a3d] dark:text-white">
              <Grid3X3
                size={16}
              />

              Posts
            </div>


            {isOwnProfile &&
              canPost && (
              <Link
                href="/social-connect/new"
                className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-xs font-black text-white dark:bg-blue-600"
              >
                <Plus
                  size={15}
                />

                Add Post
              </Link>
            )}
          </div>

          {(posts ?? []).length ===
          0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200 text-slate-400">
                <ImageIcon
                  size={27}
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-[#071a3d] dark:text-white">
                No posts yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {isOwnProfile &&
                canPost
                  ? "Share your first photo or video with Social Connect."
                  : "This user has not shared any posts yet."}
              </p>

              {isOwnProfile &&
                canPost && (
                <Link
                  href="/social-connect/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#071f50] px-5 py-3 text-sm font-black text-white"
                >
                  <Plus
                    size={16}
                  />

                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[2px] sm:gap-2 sm:p-2">
              {(posts ??
                []).map(
                (post) => (
                  <Link
                    key={
                      post.id
                    }
                    href={`/social-connect/post/${post.id}?from=${encodeURIComponent(`/social-connect/u/${profile.username}`)}`}
                    className="group relative aspect-square overflow-hidden bg-slate-100 sm:rounded-xl"
                  >
                    {post.media_type ===
                    "video" ? (
                      <>
                        <video
                          src={
                            post.media_url
                          }
                          muted
                          playsInline
                          preload="metadata"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-white backdrop-blur">
                          Video
                        </span>
                      </>
                    ) : (
                      <img
                        src={
                          post.media_url
                        }
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black text-white backdrop-blur">
                      <Eye
                        size={12}
                      />

                      {Number(
                        post.view_count ??
                        0,
                      ).toLocaleString()}
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
