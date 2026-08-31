"use client";

import {
  Camera,
  Loader2,
  UserRound,
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

export default function ProfileEditor({
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

    const form =
      new FormData(
        event.currentTarget,
      );

    const username =
      String(
        form.get("username") ?? "",
      )
        .trim()
        .toLowerCase();

    const displayName =
      String(
        form.get("display_name") ??
          "",
      ).trim();

    const bio =
      String(
        form.get("bio") ?? "",
      ).trim();

    const department =
      String(
        form.get("department") ??
          "",
      ).trim();

    const course =
      String(
        form.get("course") ?? "",
      ).trim();

    const collegeId =
      String(
        form.get("college_id") ??
          "",
      ).trim();

    const avatar =
      form.get("avatar");

    if (
      !/^[a-zA-Z0-9_.]{3,30}$/.test(
        username,
      )
    ) {
      setError(
        "Username must be 3-30 characters and use only letters, numbers, _ or .",
      );
      setBusy(false);
      return;
    }

    if (!displayName) {
      setError(
        "Display name is required.",
      );
      setBusy(false);
      return;
    }

    let avatarUrl:
      | string
      | null = null;

    if (
      avatar instanceof File &&
      avatar.size > 0
    ) {
      if (
        avatar.size >
        5 * 1024 * 1024
      ) {
        setError(
          "Profile photo must be under 5 MB.",
        );
        setBusy(false);
        return;
      }

      const extension =
        avatar.name
          .split(".")
          .pop() || "jpg";

      const path =
        `${userId}/avatar/${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from("social-media")
          .upload(
            path,
            avatar,
            {
              upsert: true,
            },
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
          .getPublicUrl(path);

      avatarUrl =
        publicData.publicUrl;
    }

    const {
      error: profileError,
    } =
      await supabase
        .from("social_profiles")
        .upsert({
          user_id:
            userId,

          username,

          display_name:
            displayName,

          bio:
            bio || null,

          avatar_url:
            avatarUrl,

          department:
            department ||
            null,

          course:
            course || null,

          updated_at:
            new Date()
              .toISOString(),
        });

    if (profileError) {
      setError(
        profileError.message,
      );
      setBusy(false);
      return;
    }

    if (collegeId) {
      await supabase
        .from("social_identity")
        .upsert({
          user_id:
            userId,

          college_id:
            collegeId,

          updated_at:
            new Date()
              .toISOString(),
        });
    }

    /*
     * If this is an actual application admin,
     * RLS allows the account to receive the
     * administrator verification badge.
     */
    const {
      data: appProfile,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

    if (
      appProfile?.role ===
      "admin"
    ) {
      await supabase
        .from(
          "social_verifications",
        )
        .upsert({
          user_id:
            userId,

          badge_type:
            "admin",

          verified_by:
            userId,

          verified_at:
            new Date()
              .toISOString(),
        });
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
        <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <Camera size={22} />
        </div>

        <div>
          <p className="font-black">
            Profile Photo
          </p>

          <p className="text-xs text-slate-500">
            JPG, PNG or WEBP,
            max 5 MB
          </p>
        </div>

        <input
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="display_name"
          required
          placeholder="Display name"
          className="rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400"
        />

        <input
          name="username"
          required
          placeholder="username"
          className="rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400"
        />
      </div>

      <textarea
        name="bio"
        maxLength={300}
        rows={3}
        placeholder="Bio..."
        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-400"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="department"
          placeholder="Department e.g. CSE"
          className="rounded-xl border border-slate-200 p-3"
        />

        <input
          name="course"
          placeholder="Course e.g. B.Tech"
          className="rounded-xl border border-slate-200 p-3"
        />
      </div>

      <input
        name="college_id"
        placeholder="College ID (kept private)"
        className="w-full rounded-xl border border-slate-200 p-3"
      />

      <button
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071f50] px-5 py-3.5 font-black text-white disabled:opacity-60"
      >
        {busy ? (
          <Loader2
            className="animate-spin"
            size={18}
          />
        ) : (
          <UserRound size={18} />
        )}

        Create Social Profile
      </button>
    </form>
  );
}
