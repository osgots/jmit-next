import {
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import PostComposer from "@/components/social/post-composer";
import SiteHeader from "@/components/site-header";
import { requireSocialPoster } from "@/lib/social/require-user";


export default async function EditPostPage({
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


  const {
    supabase,
    user,
    profile,
  } =
    await requireSocialPoster();


  const {
    data: post,
  } =
    await supabase
      .from(
        "social_posts",
      )
      .select(
        "id, user_id, caption, media_url, media_path, media_type",
      )
      .eq(
        "id",
        id,
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();


  if (!post) {
    notFound();
  }


  const mediaType:
    | "image"
    | "video" =
    post.media_type ===
    "video"
      ? "video"
      : "image";


  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-12">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Social Connect
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#071a3d]">
              Edit Post
            </h1>
          </div>


          <Link
            href={`/social-connect/post/${post.id}`}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700"
          >
            <ArrowLeft
              size={15}
            />

            Cancel
          </Link>

        </div>


        <PostComposer
          userId={
            user.id
          }
          profile={{
            username:
              profile.username,

            displayName:
              profile.display_name,

            avatarUrl:
              profile.avatar_url,
          }}
          mode="edit"
          postId={
            post.id
          }
          initialCaption={
            post.caption
          }
          initialMediaUrl={
            post.media_url
          }
          initialMediaPath={
            post.media_path
          }
          initialMediaType={
            mediaType
          }
        />

      </div>
    </main>
  );
}
