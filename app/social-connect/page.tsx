import {
  Heart,
  MessageCircle,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";

import Link from "next/link";

import BlueTick from "@/components/social/blue-tick";
import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

import {
  addComment,
  toggleLike,
} from "./actions";

export default async function SocialConnectPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  let myProfile:
    | {
        username: string;
        avatar_url:
          | string
          | null;
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
          "username, avatar_url",
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    myProfile = data;
  }

  const {
    data: postsData,
  } =
    await supabase
      .from("social_posts")
      .select("*")
      .eq(
        "status",
        "active",
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(40);

  const posts =
    postsData ?? [];

  const userIds =
    Array.from(
      new Set(
        posts.map(
          (post) =>
            post.user_id,
        ),
      ),
    );

  const postIds =
    posts.map(
      (post) =>
        post.id,
    );

  const profiles =
    userIds.length
      ? (
          await supabase
            .from(
              "social_profiles",
            )
            .select("*")
            .in(
              "user_id",
              userIds,
            )
        ).data ?? []
      : [];

  const verifications =
    userIds.length
      ? (
          await supabase
            .from(
              "social_verifications",
            )
            .select(
              "user_id, badge_type",
            )
            .in(
              "user_id",
              userIds,
            )
        ).data ?? []
      : [];

  const likes =
    postIds.length
      ? (
          await supabase
            .from(
              "social_likes",
            )
            .select(
              "post_id, user_id",
            )
            .in(
              "post_id",
              postIds,
            )
        ).data ?? []
      : [];

  const comments =
    postIds.length
      ? (
          await supabase
            .from(
              "social_comments",
            )
            .select(
              "id, post_id, user_id, body, created_at",
            )
            .eq(
              "status",
              "active",
            )
            .in(
              "post_id",
              postIds,
            )
            .order(
              "created_at",
              {
                ascending: true,
              },
            )
        ).data ?? []
      : [];

  const profileMap =
    new Map(
      profiles.map(
        (profile) => [
          profile.user_id,
          profile,
        ],
      ),
    );

  const verificationMap =
    new Map(
      verifications.map(
        (verification) => [
          verification.user_id,
          verification.badge_type,
        ],
      ),
    );

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              <Users size={15} />
              Social Connect
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#071a3d]">
              JMIT community feed
            </h1>
          </div>

          <div className="flex gap-2">
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
                >
                  Log in
                </Link>

                <Link
                  href="/auth/sign-up"
                  className="rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white"
                >
                  Create Account
                </Link>
              </>
            ) : !myProfile ? (
              <Link
                href="/social-connect/onboarding"
                className="rounded-xl bg-[#071f50] px-5 py-2.5 text-sm font-black text-white"
              >
                Create Social Profile
              </Link>
            ) : (
              <>
                <Link
                  href={`/social-connect/u/${myProfile.username}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
                >
                  My Profile
                </Link>

                <Link
                  href="/social-connect/new"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2.5 text-sm font-black text-white"
                >
                  <Plus size={16} />
                  New Post
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {posts.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-14 text-center">
            <UserPlus
              size={34}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-black text-slate-700">
              Social Connect is ready.
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Be the first person to
              create a profile and share
              a campus post.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(
              (post) => {
                const author =
                  profileMap.get(
                    post.user_id,
                  );

                const badge =
                  verificationMap.get(
                    post.user_id,
                  );

                const postLikes =
                  likes.filter(
                    (like) =>
                      like.post_id ===
                      post.id,
                  );

                const postComments =
                  comments.filter(
                    (comment) =>
                      comment.post_id ===
                      post.id,
                  );

                const likedByMe =
                  !!user &&
                  postLikes.some(
                    (like) =>
                      like.user_id ===
                      user.id,
                  );

                return (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 p-4">
                      <Link
                        href={
                          author
                            ? `/social-connect/u/${author.username}`
                            : "/social-connect"
                        }
                        className="flex min-w-0 items-center gap-3"
                      >
                        {author?.avatar_url ? (
                          <img
                            src={
                              author.avatar_url
                            }
                            alt=""
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">
                            {(author?.display_name ??
                              "?")
                              .slice(
                                0,
                                1,
                              )
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="truncate text-sm font-black text-slate-900">
                              {author?.display_name ??
                                "Social User"}
                            </p>

                            {badge && (
                              <BlueTick
                                type={
                                  badge
                                }
                              />
                            )}
                          </div>

                          <p className="text-xs text-slate-400">
                            @
                            {author?.username ??
                              "unknown"}
                          </p>
                        </div>
                      </Link>
                    </div>

                    {post.media_type ===
                    "video" ? (
                      <video
                        src={
                          post.media_url
                        }
                        controls
                        playsInline
                        preload="metadata"
                        className="max-h-[720px] w-full bg-black object-contain"
                      />
                    ) : (
                      <img
                        src={
                          post.media_url
                        }
                        alt=""
                        loading="lazy"
                        className="max-h-[720px] w-full bg-slate-100 object-contain"
                      />
                    )}

                    <div className="p-5">
                      <div className="flex items-center gap-5">
                        {user &&
                        myProfile ? (
                          <form
                            action={
                              toggleLike
                            }
                          >
                            <input
                              type="hidden"
                              name="post_id"
                              value={
                                post.id
                              }
                            />

                            <button
                              className={`flex items-center gap-2 font-black ${
                                likedByMe
                                  ? "text-red-500"
                                  : "text-slate-700"
                              }`}
                            >
                              <Heart
                                size={22}
                                fill={
                                  likedByMe
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                              {
                                postLikes.length
                              }
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-2 font-black text-slate-500">
                            <Heart
                              size={22}
                            />
                            {
                              postLikes.length
                            }
                          </div>
                        )}

                        <div className="flex items-center gap-2 font-black text-slate-500">
                          <MessageCircle
                            size={21}
                          />
                          {
                            postComments.length
                          }
                        </div>
                      </div>

                      {post.caption && (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          <strong>
                            @
                            {author?.username ??
                              "user"}{" "}
                          </strong>

                          {
                            post.caption
                          }
                        </p>
                      )}

                      {postComments
                        .slice(-3)
                        .map(
                          (
                            comment,
                          ) => {
                            const commentAuthor =
                              profileMap.get(
                                comment.user_id,
                              );

                            return (
                              <p
                                key={
                                  comment.id
                                }
                                className="mt-2 text-sm text-slate-600"
                              >
                                <strong>
                                  @
                                  {commentAuthor?.username ??
                                    "user"}{" "}
                                </strong>

                                {
                                  comment.body
                                }
                              </p>
                            );
                          },
                        )}

                      {user &&
                        myProfile && (
                          <form
                            action={
                              addComment
                            }
                            className="mt-4 flex gap-2 border-t border-slate-100 pt-4"
                          >
                            <input
                              type="hidden"
                              name="post_id"
                              value={
                                post.id
                              }
                            />

                            <input
                              name="body"
                              required
                              maxLength={
                                1000
                              }
                              placeholder="Add a comment..."
                              className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-sm outline-none"
                            />

                            <button className="font-black text-blue-700">
                              Post
                            </button>
                          </form>
                        )}
                    </div>
                  </article>
                );
              },
            )}
          </div>
        )}
      </div>
    </main>
  );
}
