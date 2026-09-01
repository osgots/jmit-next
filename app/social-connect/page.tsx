import {
  Search,
  Heart,
  MessageCircle,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,

} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";
import SocialRolePill from "@/components/social/social-role-pill";
import PostControls from "@/components/social/post-controls";
import { createClient } from "@/lib/supabase/server";
import { getPublicSocialIdentityMap, identityKind } from "@/lib/social/public-identity";

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
        user_id: string;
        username: string;
        avatar_url: string | null;
        account_type: string;
      }
    | null = null;

  let myBlue =
    false;

  if (user) {
    const {
      data: profile,
    } =
      await supabase
        .from("social_profiles")
        .select(
          "user_id, username, avatar_url, account_type",
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    myProfile =
      profile;

    if (profile) {
      const {
        data: verification,
      } =
        await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();

      myBlue =
        Boolean(
          verification,
        );
    }
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
      .limit(50);

  const posts =
    postsData ?? [];

  const postIds =
    posts.map(
      (post) => post.id,
    );

  const authorIds =
    Array.from(
      new Set(
        posts.map(
          (post) =>
            post.user_id,
        ),
      ),
    );

  const {
    data: profilesData,
  } =
    authorIds.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url, account_type",
          )
          .in(
            "user_id",
            authorIds,
          )
      : {
          data: [],
        };

  const {
    data: roleData,
  } =
    authorIds.length
      ? await supabase
          .from("profiles")
          .select("id, role")
          .in("id", authorIds)
      : { data: [] };

  const {
    data: blueData,
  } =
    authorIds.length
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id, verified_roll_number",
          )
          .in(
            "user_id",
            authorIds,
          )
      : {
          data: [],
        };

  const {
    data: likesData,
  } =
    postIds.length
      ? await supabase
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
      : {
          data: [],
        };

  const {
    data: commentsData,
  } =
    postIds.length
      ? await supabase
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
      : {
          data: [],
        };

  const commentUserIds =
    Array.from(
      new Set(
        (
          commentsData ??
          []
        ).map(
          (comment) =>
            comment.user_id,
        ),
      ),
    );

  const missingIds =
    commentUserIds.filter(
      (id) =>
        !authorIds.includes(
          id,
        ),
    );

  let extraProfiles:
    any[] = [];

  if (
    missingIds.length
  ) {
    const {
      data,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, display_name, avatar_url, account_type",
        )
        .in(
          "user_id",
          missingIds,
        );

    extraProfiles =
      data ?? [];
  }

  const profiles = [
    ...(profilesData ??
      []),
    ...extraProfiles,
  ];

  const profileMap =
    new Map(
      profiles.map(
        (profile) => [
          profile.user_id,
          profile,
        ],
      ),
    );

  const roleMap =
    new Map(
      (
        roleData ??
        []
      ).map(
        (row) => [
          row.id,
          row.role,
        ],
      ),
    );

  const blueMap =
    new Map(
      (
        blueData ??
        []
      ).map(
        (blue) => [
          blue.user_id,
          blue,
        ],
      ),
    );

  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      profiles.map(
        (
          item,
        ) =>
          item.user_id,
      ),
    );


  const likes =
    likesData ?? [];

  const comments =
    commentsData ?? [];

  function getBadge(
    profile:
      | any
      | undefined,
  ) {
    if (!profile) {
      return null;
    }


    const identity =
      publicIdentityMap.get(
        profile.user_id,
      );


    const kind =
      identityKind(
        identity,
        profile.account_type,
      );


    return kind ===
      "visitor"
      ? null
      : kind;
  }


  const {
    data: savedRows,
  } =
    user && postIds.length
      ? await supabase
          .from("social_saved_posts")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds)
      : { data: [] };

  const savedSet =
    new Set(
      (
        savedRows ??
        []
      ).map(
        (row) =>
          row.post_id,
      ),
    );

  const {
    count: unreadNotifications,
  } =
    user
      ? await supabase
          .from("social_notifications")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("user_id", user.id)
          .eq("is_read", false)
      : { count: 0 };

  const canPost =
    myProfile &&
    (
      myProfile.account_type ===
        "student" ||
      myProfile.account_type ===
        "admin"
    );

  return (
    <main className="min-h-screen bg-[#f4f6fa]">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              <Users
                size={15}
              />

              Social Connect
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#071a3d]">
              JMIT Community
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Share campus moments,
              connect with people and
              discover what's happening.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
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

                {myProfile.account_type ===
                  "student" &&
                  !myBlue && (
                  <Link
                    href="/social-connect/verification"
                    className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700"
                  >
                    <ShieldCheck
                      size={15}
                    />

                    Get Blue Tick
                  </Link>
                )}

                {canPost && (
                  <Link
                    href="/social-connect/new"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2.5 text-sm font-black text-white shadow-sm"
                  >
                    <Plus
                      size={16}
                    />

                    New Post
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {user &&
        myProfile?.account_type ===
          "visitor" && (
          <div className="mx-auto mt-5 max-w-2xl px-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Visitor account:
              you can browse,
              follow, like and
              comment. Posting
              photos/videos is
              available to student
              and administrator
              accounts.
            </div>
          </div>
        )}

      <section className="mx-auto max-w-2xl px-4 pt-6">
        <form
          action="/social-connect/search"
          className="relative"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="q"
            placeholder="Search people on Social Connect..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-24 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#071f50] px-4 py-2 text-xs font-black text-white">
            Search
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8">
        {posts.length ===
        0 ? (
          <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <UserPlus
              size={36}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-5 text-xl font-black text-[#071a3d]">
              Social Connect is
              ready.
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No posts have been
              shared yet.
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
                  getBadge(
                    author,
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
                  Boolean(
                    user &&
                      postLikes.some(
                        (like) =>
                          like.user_id ===
                          user.id,
                      ),
                  );

                return (
                  <article
                    key={
                      post.id
                    }
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
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
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-50 font-black text-blue-700">
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
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                              {author?.display_name ??
                                "Social User"}
                            </p>

                            {badge && (
                              <SocialBadge
                                kind={
                                  badge
                                }
                              />
                            )}
                          </div>

                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="text-xs text-slate-400">
                              @
                              {author?.username ??
                                "unknown"}
                            </p>

                            {badge && (
                              <div className="mt-1">
                                <SocialRolePill
                                  kind={
                                    badge
                                  }
                                  compact
                                />
                              </div>
                            )}

                            {roleMap.get(
                              author?.user_id,
                            ) === "admin" && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-violet-600">
                                Admin
                              </span>
                            )}

                            {author?.account_type ===
                              "student" &&
                              !blueMap.has(
                                author.user_id,
                              ) && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600">
                                Student
                              </span>
                            )}

                            {blueMap.has(
                              author?.user_id,
                            ) && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-blue-600">
                                Verified
                              </span>
                            )}
                          </div>
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
                        className="max-h-[760px] w-full bg-black object-contain"
                      />
                    ) : (
                      <img
                        src={
                          post.media_url
                        }
                        alt=""
                        loading="lazy"
                        className="max-h-[760px] w-full bg-slate-100 object-contain"
                      />
                    )}

                    <div className="p-5">
                      <div className="flex items-center gap-6">
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
                              aria-label="Like"
                              className={`flex items-center gap-2 text-sm font-black transition ${
                                likedByMe
                                  ? "text-red-500"
                                  : "text-slate-700 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                size={23}
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
                          <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                            <Heart
                              size={23}
                            />
                            {
                              postLikes.length
                            }
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm font-black text-slate-500">
                          <MessageCircle
                            size={22}
                          />

                          {
                            postComments.length
                          }
                        </div>
                      </div>

                      {post.caption && (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                          <strong className="text-slate-900">
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

                            const commentBadge =
                              getBadge(
                                commentAuthor,
                              );

                            return (
                              <div
                                key={
                                  comment.id
                                }
                                className="mt-2 flex gap-1.5 text-sm text-slate-600"
                              >
                                <span className="inline-flex items-center gap-1 font-black text-slate-800">
                                  @
                                  {commentAuthor?.username ??
                                    "user"}

                                  {commentBadge && (
                                    <SocialBadge
                                      kind={
                                        commentBadge
                                      }
                                      size={
                                        15
                                      }
                                    />
                                  )}
                                </span>

                                <span>
                                  {
                                    comment.body
                                  }
                                </span>
                              </div>
                            );
                          },
                        )}

                      {user &&
                        myProfile && (
                          <form
                            action={
                              addComment
                            }
                            className="mt-5 flex gap-2 border-t border-slate-100 pt-4"
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
                              className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />

                            <button className="px-2 text-sm font-black text-blue-700">
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
      </section>
<div className="h-20 md:h-0" />
    </main>
  );
}
