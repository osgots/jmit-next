import {
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import AppBackButton from "@/components/app-back-button";
import SiteHeader from "@/components/site-header";

import CommentControls from "@/components/social/comment-controls";
import PostControls from "@/components/social/post-controls";
import PostMediaViewer from "@/components/social/post-media-viewer";
import PostViewCount from "@/components/social/post-view-count";
import SocialBadge from "@/components/social/social-badge";

import {
  addComment,
  toggleLike,
} from "@/app/social-connect/actions";

import {
  createClient,
} from "@/lib/supabase/server";


export default async function SocialPostPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    from?: string;
  }>;
}) {
  const {
    id,
  } =
    await params;


  const search =
    await searchParams;


  const supabase =
    await createClient();


  const {
    data: post,
  } =
    await supabase
      .from(
        "social_posts",
      )
      .select("*")
      .eq(
        "id",
        id,
      )
      .eq(
        "status",
        "active",
      )
      .maybeSingle();


  if (!post) {
    notFound();
  }


  const {
    data: author,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select(
        "user_id, username, display_name, avatar_url, account_type",
      )
      .eq(
        "user_id",
        post.user_id,
      )
      .maybeSingle();


  if (!author) {
    notFound();
  }


  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  const {
    data:
      authorAppProfile,
  } =
    await supabase
      .from(
        "profiles",
      )
      .select(
        "role",
      )
      .eq(
        "id",
        author.user_id,
      )
      .maybeSingle();


  const authorAdmin =
    authorAppProfile?.role ===
    "admin";


  const {
    data:
      authorBlue,
  } =
    !authorAdmin
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .eq(
            "user_id",
            author.user_id,
          )
          .maybeSingle()
      : {
          data:
            null,
        };


  const authorBadge =
    authorAdmin
      ? "admin"
      : authorBlue
        ? "blue"
        : author.account_type ===
            "student"
          ? "student"
          : null;


  const isOwner =
    user?.id ===
    post.user_id;


  let mySocialProfile:
    any = null;

  let myRole:
    string | null = null;


  if (user) {

    const {
      data:
        social,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, account_type, profile_completed",
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();


    mySocialProfile =
      social;


    const {
      data:
        appProfile,
    } =
      await supabase
        .from(
          "profiles",
        )
        .select(
          "role",
        )
        .eq(
          "id",
          user.id,
        )
        .maybeSingle();


    myRole =
      appProfile?.role ??
      null;
  }


  const {
    count:
      likeCount,
  } =
    await supabase
      .from(
        "social_likes",
      )
      .select("*", {
        count:
          "exact",

        head:
          true,
      })
      .eq(
        "post_id",
        post.id,
      );


  const {
    data:
      myLike,
  } =
    user
      ? await supabase
          .from(
            "social_likes",
          )
          .select(
            "post_id",
          )
          .eq(
            "post_id",
            post.id,
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle()
      : {
          data:
            null,
        };


  const {
    data:
      mySaved,
  } =
    user
      ? await supabase
          .from(
            "social_saved_posts",
          )
          .select(
            "post_id",
          )
          .eq(
            "post_id",
            post.id,
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle()
      : {
          data:
            null,
        };


  const {
    data:
      comments,
  } =
    await supabase
      .from(
        "social_comments",
      )
      .select(
        "id, post_id, user_id, body, status, created_at, updated_at",
      )
      .eq(
        "post_id",
        post.id,
      )
      .eq(
        "status",
        "active",
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        },
      )
      .limit(
        150,
      );


  const commentAuthorIds =
    Array.from(
      new Set(
        (
          comments ??
          []
        ).map(
          (
            comment,
          ) =>
            comment.user_id,
        ),
      ),
    );


  const {
    data:
      commentProfiles,
  } =
    commentAuthorIds.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url, account_type",
          )
          .in(
            "user_id",
            commentAuthorIds,
          )
      : {
          data: [],
        };


  const {
    data:
      commentRoles,
  } =
    commentAuthorIds.length
      ? await supabase
          .from(
            "profiles",
          )
          .select(
            "id, role",
          )
          .in(
            "id",
            commentAuthorIds,
          )
      : {
          data: [],
        };


  const {
    data:
      commentBlueRows,
  } =
    commentAuthorIds.length
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .in(
            "user_id",
            commentAuthorIds,
          )
      : {
          data: [],
        };


  const commentProfileMap =
    new Map(
      (
        commentProfiles ??
        []
      ).map(
        (
          profile,
        ) => [
          profile.user_id,
          profile,
        ],
      ),
    );


  const commentRoleMap =
    new Map(
      (
        commentRoles ??
        []
      ).map(
        (
          role,
        ) => [
          role.id,
          role.role,
        ],
      ),
    );


  const commentBlueSet =
    new Set(
      (
        commentBlueRows ??
        []
      ).map(
        (
          item,
        ) =>
          item.user_id,
      ),
    );


  const defaultBack =
    `/social-connect/u/${author.username}`;


  const requestedBack =
    search.from &&
    search.from.startsWith("/") &&
    !search.from.startsWith("//")
      ? search.from
      : defaultBack;


  const pagePath =
    `/social-connect/post/${post.id}`;


  const canModerate =
    myRole ===
    "admin";


  return (
    <main className="min-h-screen bg-[#f5f7fb] pb-12 dark:bg-slate-950">

      <SiteHeader />


      <div className="mx-auto max-w-6xl px-0 py-3 sm:px-5 sm:py-10">

        <div className="mb-3 flex items-center justify-between px-3 sm:px-0">

          <AppBackButton
            fallback={
              requestedBack
            }
            label="Back"
          />


          {isOwner &&
            mySocialProfile && (
            <PostControls
              postId={
                post.id
              }
              isOwner
              isSaved={
                Boolean(
                  mySaved,
                )
              }
              returnTo={
                pagePath
              }
            />
          )}
        </div>


        <article className="overflow-hidden border-y border-slate-200 bg-white shadow-xl shadow-slate-200/30 sm:rounded-[28px] sm:border dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

          <div className="grid lg:grid-cols-[1.35fr_.65fr]">

            <PostMediaViewer
              url={
                post.media_url
              }
              type={
                post.media_type ===
                "video"
                  ? "video"
                  : "image"
              }
              alt={
                post.caption ??
                `${author.display_name} post`
              }
            />


            <div className="flex min-h-0 flex-col">

              <Link
                href={`/social-connect/u/${author.username}`}
                className="flex items-center gap-3 border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800"
              >

                {author.avatar_url ? (
                  <img
                    src={
                      author.avatar_url
                    }
                    alt=""
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {author.display_name
                      .slice(
                        0,
                        1,
                      )
                      .toUpperCase()}
                  </div>
                )}


                <div className="min-w-0">

                  <div className="flex items-center gap-1.5">

                    <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                      {
                        author.display_name
                      }
                    </p>

                    {authorBadge && (
                      <SocialBadge
                        kind={
                          authorBadge
                        }
                        size={
                          17
                        }
                      />
                    )}
                  </div>


                  <p className="text-xs text-slate-500">
                    @
                    {
                      author.username
                    }
                  </p>
                </div>
              </Link>


              {post.caption && (
                <div className="border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">

                  <p className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                    {
                      post.caption
                    }
                  </p>
                </div>
              )}


              {/* COMMENTS */}

              <div className="max-h-[430px] flex-1 overflow-y-auto p-4 sm:p-5">

                <div className="space-y-5">

                  {(comments ??
                    []).map(
                    (
                      comment,
                    ) => {

                      const person =
                        commentProfileMap.get(
                          comment.user_id,
                        );


                      if (!person) {
                        return null;
                      }


                      const badge =
                        commentRoleMap.get(
                          person.user_id,
                        ) ===
                        "admin"
                          ? "admin"
                          : commentBlueSet.has(
                                person.user_id,
                              )
                            ? "blue"
                            : person.account_type ===
                                "student"
                              ? "student"
                              : null;


                      const ownComment =
                        user?.id ===
                        comment.user_id;


                      const canDelete =
                        Boolean(
                          user &&
                          (
                            ownComment ||
                            isOwner ||
                            canModerate
                          )
                        );


                      return (
                        <div
                          key={
                            comment.id
                          }
                          className="flex items-start gap-3"
                        >

                          <Link
                            href={`/social-connect/u/${person.username}`}
                            className="shrink-0"
                          >
                            {person.avatar_url ? (
                              <img
                                src={
                                  person.avatar_url
                                }
                                alt=""
                                className="h-9 w-9 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {person.display_name
                                  .slice(
                                    0,
                                    1,
                                  )
                                  .toUpperCase()}
                              </div>
                            )}
                          </Link>


                          <div className="min-w-0 flex-1">

                            <div className="flex items-center gap-1.5">

                              <Link
                                href={`/social-connect/u/${person.username}`}
                                className="truncate text-sm font-black text-slate-950 dark:text-white"
                              >
                                {
                                  person.display_name
                                }
                              </Link>

                              {badge && (
                                <SocialBadge
                                  kind={
                                    badge
                                  }
                                  size={
                                    15
                                  }
                                />
                              )}
                            </div>


                            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                              {
                                comment.body
                              }
                            </p>


                            <p className="mt-1 text-[10px] font-semibold text-slate-400">
                              {new Date(
                                comment.created_at,
                              ).toLocaleString()}

                              {comment.updated_at &&
                                comment.updated_at !==
                                  comment.created_at &&
                                " · edited"}
                            </p>


                            <CommentControls
                              commentId={
                                comment.id
                              }
                              body={
                                comment.body
                              }
                              returnTo={
                                pagePath
                              }
                              canEdit={
                                Boolean(
                                  ownComment,
                                )
                              }
                              canDelete={
                                canDelete
                              }
                            />
                          </div>
                        </div>
                      );
                    },
                  )}


                  {(comments ??
                    []).length ===
                    0 && (
                    <p className="py-8 text-center text-sm text-slate-400">
                      No comments yet. Start the conversation.
                    </p>
                  )}
                </div>
              </div>


              {/* INTERACTION COUNTERS */}

              <div className="border-t border-slate-100 dark:border-slate-800">

                <div className="flex items-center gap-5 px-4 py-3 sm:px-5">

                  {mySocialProfile ? (
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

                      <input
                        type="hidden"
                        name="return_to"
                        value={
                          pagePath
                        }
                      />

                      <button
                        className={`flex items-center gap-2 font-black ${
                          myLike
                            ? "text-red-500"
                            : "text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <Heart
                          size={22}
                          fill={
                            myLike
                              ? "currentColor"
                              : "none"
                          }
                        />

                        {
                          likeCount ??
                          0
                        }
                      </button>
                    </form>

                  ) : (
                    <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200">
                      <Heart
                        size={22}
                      />

                      {
                        likeCount ??
                        0
                      }
                    </div>
                  )}


                  <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200">
                    <MessageCircle
                      size={21}
                    />

                    {(comments ??
                      []).length}
                  </div>


                  <PostViewCount
                    postId={
                      post.id
                    }
                    initialCount={
                      Number(
                        post.view_count ??
                        0,
                      )
                    }
                  />


                  {mySocialProfile &&
                    !isOwner && (
                    <PostControls
                      postId={
                        post.id
                      }
                      isOwner={
                        false
                      }
                      isSaved={
                        Boolean(
                          mySaved,
                        )
                      }
                      returnTo={
                        pagePath
                      }
                    />
                  )}
                </div>


                {/* COMMENT BOX */}

                {mySocialProfile ? (
                  <form
                    action={
                      addComment
                    }
                    className="flex items-center gap-2 border-t border-slate-100 p-3 sm:p-4 dark:border-slate-800"
                  >
                    <input
                      type="hidden"
                      name="post_id"
                      value={
                        post.id
                      }
                    />

                    <input
                      type="hidden"
                      name="return_to"
                      value={
                        pagePath
                      }
                    />

                    <input
                      name="body"
                      maxLength={
                        1000
                      }
                      required
                      placeholder="Add a comment... use @username to mention"
                      className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />

                    <button
                      title="Post comment"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"
                    >
                      <Send
                        size={17}
                      />
                    </button>
                  </form>

                ) : (
                  <div className="border-t border-slate-100 p-4 text-center dark:border-slate-800">

                    <Link
                      href="/social-connect/onboarding"
                      className="text-sm font-black text-blue-700 dark:text-blue-400"
                    >
                      Create your Social Connect profile to interact
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
