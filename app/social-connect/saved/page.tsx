import {
  Bookmark,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";


export default async function SavedPostsPage() {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();


  const {
    data:
      savedRows,
  } =
    await supabase
      .from(
        "social_saved_posts",
      )
      .select(
        "post_id, created_at",
      )
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      );


  const ids =
    (
      savedRows ??
      []
    ).map(
      (
        row,
      ) =>
        row.post_id,
    );


  const {
    data: posts,
  } =
    ids.length
      ? await supabase
          .from(
            "social_posts",
          )
          .select(
            "id, media_url, media_type, caption",
          )
          .in(
            "id",
            ids,
          )
          .eq(
            "status",
            "active",
          )
      : {
          data: [],
        };


  const postMap =
    new Map(
      (
        posts ??
        []
      ).map(
        (
          post,
        ) => [
          post.id,
          post,
        ],
      ),
    );


  const ordered =
    ids
      .map(
        (
          id,
        ) =>
          postMap.get(
            id,
          ),
      )
      .filter(
        Boolean,
      );


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-12">

        <div className="flex items-center gap-3">
          <Bookmark
            size={26}
            className="text-blue-600"
          />

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Social Connect
            </p>

            <h1 className="mt-1 text-3xl font-black text-[#071a3d] dark:text-white">
              Saved Posts
            </h1>
          </div>
        </div>


        {ordered.length ===
        0 ? (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900">

            <Bookmark
              size={35}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-black text-slate-900 dark:text-white">
              Nothing saved yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Saved posts are private and visible only to you.
            </p>
          </div>

        ) : (
          <div className="mt-8 grid grid-cols-3 gap-[2px] sm:gap-2">

            {ordered.map(
              (
                post: any,
              ) => (
                <Link
                  key={
                    post.id
                  }
                  href={`/social-connect/post/${post.id}`}
                  className="group relative aspect-square overflow-hidden bg-slate-100 sm:rounded-xl dark:bg-slate-800"
                >

                  {post.media_type ===
                  "video" ? (
                    <video
                      src={
                        post.media_url
                      }
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={
                        post.media_url
                      }
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}

                  {post.media_type ===
                    "video" && (
                    <span className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[8px] font-black uppercase text-white">
                      Video
                    </span>
                  )}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
