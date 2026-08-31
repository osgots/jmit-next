import Link from "next/link";

import CreatePostForm from "@/components/social/create-post-form";
import SiteHeader from "@/components/site-header";
import { requireSocialPoster } from "@/lib/social/require-user";

export default async function NewSocialPostPage() {
  const {
    user,
  } =
    await requireSocialPoster();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-xl px-5 py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          Social Connect
        </p>

        <h1 className="mt-3 text-3xl font-black text-[#071a3d]">
          Create Post
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Share a photo or video with
          the JMIT Next community.
        </p>

        <div className="mt-7 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <CreatePostForm
            userId={
              user.id
            }
          />
        </div>

        <Link
          href="/social-connect"
          className="mt-5 block text-center text-sm font-black text-blue-700"
        >
          Cancel
        </Link>
      </div>
    </main>
  );
}
