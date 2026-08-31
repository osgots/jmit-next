import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Pencil,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";
import { createClient } from "@/lib/supabase/server";


export default async function SocialPostPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } =
    await params;


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
    data: appProfile,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        author.user_id,
      )
      .maybeSingle();


  const isAdmin =
    appProfile?.role ===
    "admin";


  const {
    data: blue,
  } =
    !isAdmin
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


  const {
    data: { user },
  } =
    await supabase.auth.getUser();


  const {
    count: likeCount,
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
    count: commentCount,
  } =
    await supabase
      .from(
        "social_comments",
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
      )
      .eq(
        "status",
        "active",
      );


  const badge =
    isAdmin
      ? "admin"
      : blue
        ? "blue"
        : author.account_type ===
            "student"
          ? "student"
          : null;


  const isOwner =
    user?.id ===
    post.user_id;


  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />


      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-12">

        <div className="mb-5 flex items-center justify-between">

          <Link
            href={`/social-connect/u/${author.username}`}
            className="flex items-center gap-2 text-sm font-black text-blue-700"
          >
            <ArrowLeft
              size={16}
            />

            Back to Profile
          </Link>


          {isOwner && (
            <Link
              href={`/social-connect/post/${post.id}/edit`}
              className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white"
            >
              <Pencil
                size={15}
              />

              Edit Post
            </Link>
          )}

        </div>


        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

          <div className="grid lg:grid-cols-[1.4fr_.6fr]">

            <div className="flex min-h-[420px] items-center justify-center bg-black lg:min-h-[680px]">

              {post.media_type ===
              "video" ? (
                <video
                  src={
                    post.media_url
                  }
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[760px] w-full object-contain"
                />
              ) : (
                <img
                  src={
                    post.media_url
                  }
                  alt=""
                  className="max-h-[760px] w-full object-contain"
                />
              )}

            </div>


            <div className="flex flex-col">

              <Link
                href={`/social-connect/u/${author.username}`}
                className="flex items-center gap-3 border-b border-slate-100 p-5"
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
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700">
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

                    <p className="truncate text-sm font-black text-slate-900">
                      {
                        author.display_name
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
                      author.username
                    }
                  </p>

                </div>

              </Link>


              <div className="flex-1 p-5">

                {post.caption ? (
                  <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
                    {
                      post.caption
                    }
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">
                    No caption.
                  </p>
                )}

              </div>


              <div className="flex items-center gap-6 border-t border-slate-100 p-5">

                <div className="flex items-center gap-2 font-black text-slate-700">
                  <Heart
                    size={21}
                  />

                  {likeCount ??
                    0}
                </div>

                <div className="flex items-center gap-2 font-black text-slate-700">
                  <MessageCircle
                    size={21}
                  />

                  {commentCount ??
                    0}
                </div>

              </div>

            </div>

          </div>

        </article>

      </div>

    </main>
  );
}
