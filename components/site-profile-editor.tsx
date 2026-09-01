"use client";

import {
  Camera,
  Check,
  Loader2,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function SiteProfileEditor({
  userId,
  email,
  initialProfile,
}: {
  userId: string;
  email: string;

  initialProfile: {
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
  };
}) {
  const supabase =
    createClient();

  const fileRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    file,
    setFile,
  ] =
    useState<File | null>(
      null,
    );

  const [
    preview,
    setPreview,
  ] =
    useState<string | null>(
      initialProfile.avatar_url,
    );

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");


  useEffect(() => {
    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file,
      );

    setPreview(
      url,
    );

    return () =>
      URL.revokeObjectURL(
        url,
      );
  }, [file]);


  async function save(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(
      true,
    );

    setMessage(
      "",
    );

    const data =
      new FormData(
        event.currentTarget,
      );

    let avatarUrl =
      initialProfile.avatar_url;

    if (file) {
      if (
        file.size >
        5 * 1024 * 1024
      ) {
        setMessage(
          "Avatar must be below 5 MB.",
        );

        setBusy(
          false,
        );

        return;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ??
        "jpg";

      const path =
        `${userId}/${crypto.randomUUID()}.${extension}`;

      const {
        error,
      } =
        await supabase.storage
          .from(
            "site-avatars",
          )
          .upload(
            path,
            file,
            {
              upsert:
                false,
            },
          );

      if (error) {
        setMessage(
          error.message,
        );

        setBusy(
          false,
        );

        return;
      }

      avatarUrl =
        supabase.storage
          .from(
            "site-avatars",
          )
          .getPublicUrl(
            path,
          )
          .data.publicUrl;
    }

    const displayName =
      String(
        data.get(
          "display_name",
        ) ?? "",
      ).trim();

    const bio =
      String(
        data.get(
          "bio",
        ) ?? "",
      ).trim();

    const {
      error,
    } =
      await supabase
        .from(
          "site_profiles",
        )
        .upsert({
          user_id:
            userId,

          display_name:
            displayName ||
            "JMIT Next Member",

          bio:
            bio || null,

          avatar_url:
            avatarUrl,

          updated_at:
            new Date()
              .toISOString(),
        });

    setMessage(
      error
        ? error.message
        : "Profile saved successfully.",
    );

    setBusy(
      false,
    );

    if (!error) {
      window.location.reload();
    }
  }


  return (
    <form
      onSubmit={save}
      className="space-y-6"
    >
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-slate-50 p-6 sm:flex-row">
        {preview ? (
          <img
            src={preview}
            alt=""
            className="h-28 w-28 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <UserRound
              size={40}
            />
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() =>
              fileRef.current?.click()
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-3 text-sm font-black text-white"
          >
            <Camera
              size={16}
            />

            Change Avatar
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(
              event,
            ) =>
              setFile(
                event.target.files?.[0] ??
                  null,
              )
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600">
          Email
        </label>

        <input
          value={email}
          disabled
          className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600">
          Display Name
        </label>

        <input
          name="display_name"
          required
          defaultValue={
            initialProfile.display_name
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600">
          Bio
        </label>

        <textarea
          name="bio"
          rows={5}
          maxLength={300}
          defaultValue={
            initialProfile.bio ??
            ""
          }
          placeholder="Tell us about yourself..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {message && (
        <p className="text-sm font-semibold text-slate-700">
          {message}
        </p>
      )}

      <button
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-black text-white disabled:opacity-60"
      >
        {busy ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : (
          <Check
            size={17}
          />
        )}

        Save Account Profile
      </button>
    </form>
  );
}
