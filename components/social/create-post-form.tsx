"use client";

import {
  ImagePlus,
  Loader2,
  Video,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";

export default function CreatePostForm({
  userId,
}: {
  userId: string;
}) {
  const router =
    useRouter();

  const supabase =
    createClient();

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState("");

  async function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setError("");

    const data =
      new FormData(
        event.currentTarget,
      );

    const media =
      data.get("media");

    const caption =
      String(
        data.get("caption") ??
          "",
      ).trim();

    if (
      !(media instanceof File) ||
      media.size === 0
    ) {
      setError(
        "Choose a photo or video.",
      );
      setBusy(false);
      return;
    }

    if (
      media.size >
      25 * 1024 * 1024
    ) {
      setError(
        "Maximum upload size is 25 MB.",
      );
      setBusy(false);
      return;
    }

    const isVideo =
      media.type.startsWith(
        "video/",
      );

    const isImage =
      media.type.startsWith(
        "image/",
      );

    if (
      !isVideo &&
      !isImage
    ) {
      setError(
        "Only photos and videos are supported.",
      );
      setBusy(false);
      return;
    }

    const extension =
      media.name
        .split(".")
        .pop() ||
      (isVideo
        ? "mp4"
        : "jpg");

    const storagePath =
      `${userId}/posts/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("social-media")
        .upload(
          storagePath,
          media,
        );

    if (uploadError) {
      setError(
        uploadError.message,
      );
      setBusy(false);
      return;
    }

    const {
      data: publicData,
    } =
      supabase.storage
        .from("social-media")
        .getPublicUrl(
          storagePath,
        );

    const {
      error: insertError,
    } =
      await supabase
        .from("social_posts")
        .insert({
          user_id:
            userId,

          caption:
            caption || null,

          media_url:
            publicData.publicUrl,

          media_type:
            isVideo
              ? "video"
              : "image",
        });

    if (insertError) {
      setError(
        insertError.message,
      );
      setBusy(false);
      return;
    }

    router.push(
      "/social-connect",
    );

    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-300 hover:bg-blue-50">
        <div className="flex gap-3 text-blue-700">
          <ImagePlus size={26} />
          <Video size={26} />
        </div>

        <p className="mt-4 font-black">
          Select photo or video
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Maximum 25 MB
        </p>

        <input
          type="file"
          name="media"
          required
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
        />
      </label>

      <textarea
        name="caption"
        rows={4}
        maxLength={2200}
        placeholder="Write a caption..."
        className="w-full resize-none rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-400"
      />

      <button
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-5 py-3.5 font-black text-white disabled:opacity-60"
      >
        {busy && (
          <Loader2
            size={17}
            className="animate-spin"
          />
        )}

        Share Post
      </button>
    </form>
  );
}
