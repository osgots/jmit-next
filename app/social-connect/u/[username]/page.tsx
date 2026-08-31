import {
  Grid3X3,
  UserPlus,
} from "lucide-react";

import {
  notFound,
} from "next/navigation";

import Link from "next/link";

import BlueTick from "@/components/social/blue-tick";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

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
  const { username } =
    await params;

  const supabase =
    await createClient();

  const {
    data: profile,
  } =
    await supabase
      .from("social_profiles")
      .select("*")
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
    data: verification,
  } =
    await supabase
      .from(
        "social_verifications",
      )
      .select("badge_type")
      .eq(
        "user_id",
        profile.user_id,
      )
      .maybeSingle();

  const {
    data: posts,
  } =
    await supabase
      .from("social_posts")
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
          ascending: false,
        },
      );

  const {
    count: followers,
  } =
    await supabase
      .from("social_follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "following_id",
        profile.user_id,
      );

  const {
    count: following,
  } =
    await supabase
      .from("social_follows")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "follower_id",
        profile.user_id,
      );

  let isFollowing =
    false;

  if (
    user &&
    user.id !==
      profile.user_id
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

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-5 py-12">
        <section className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            {profile.avatar_url ? (
              <img
                src={
                  profile.avatar_url
                }
                alt=""
                className="h-28 w-28 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl font-black text-blue-700">
                {profile.display_name
                  .slice(0, 1)
                  .toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black text-[#071a3d]">
                  {
                    profile.display_name
                  }
                </h1>

                {verification && (
                  <BlueTick
                    type={
                      verification.badge_type
                    }
                    size={22}
                  />
                )}
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                @{profile.username}
              </p>

              <div className="mt-5 flex gap-6 text-sm">
                <span>
                  <strong>
                    {
                      posts?.length ??
                      0
                    }
                  </strong>{" "}
                  posts
                </span>

                <span>
                  <strong>
                    {
                      followers ??
                      0
                    }
                  </strong>{" "}
                  followers
                </span>

                <span>
                  <strong>
                    {
                      following ??
                      0
                    }
                  </strong>{" "}
                  following
                </span>
              </div>

              {profile.bio && (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {profile.bio}
                </p>
              )}

              <p className="mt-3 text-xs font-bold text-blue-700">
                {[
                  profile.course,
                  profile.department,
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </p>

              {user?.id ===
              profile.user_id ? (
                <Link
                  href="/social-connect/onboarding"
                  className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700"
                >
                  My Profile
                </Link>
              ) : user ? (
                <form
                  action={
                    toggleFollow
                  }
                  className="mt-5"
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

                  <button className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-black text-white">
                    <UserPlus
                      size={16}
                    />

                    {isFollowing
                      ? "Following"
                      : "Follow"}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-9 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          <Grid3X3 size={15} />
          Posts
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1 sm:gap-3">
          {(posts ?? []).map(
            (post) => (
              <div
                key={post.id}
                className="aspect-square overflow-hidden bg-slate-200"
              >
                {post.media_type ===
                "video" ? (
                  <video
                    src={
                      post.media_url
                    }
                    muted
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={
                      post.media_url
                    }
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </main>
  );
}
