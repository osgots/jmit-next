"use client";

import {
  Camera,
  GraduationCap,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
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

type AccountType =
  | "student"
  | "visitor";

export default function ProfileEditor({
  userId,
  isAdmin,
}: {
  userId: string;
  isAdmin: boolean;
}) {
  const router =
    useRouter();

  const supabase =
    createClient();

  const [
    accountType,
    setAccountType,
  ] =
    useState<AccountType>(
      "student",
    );

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
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
        form.get("username") ??
          "",
      )
        .trim()
        .toLowerCase();

    const displayName =
      String(
        form.get(
          "display_name",
        ) ?? "",
      ).trim();

    const bio =
      String(
        form.get("bio") ??
          "",
      ).trim();

    if (
      !/^[a-zA-Z0-9_.]{3,30}$/.test(
        username,
      )
    ) {
      setError(
        "Username must be 3-30 characters using letters, numbers, _ or .",
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

    const finalType =
      isAdmin
        ? "admin"
        : accountType;

    let avatarUrl:
      | string
      | null =
      null;

    /*
     * Visitors are view/like/comment/follow
     * accounts only.
     *
     * They do not upload media.
     */
    if (
      finalType !==
      "visitor"
    ) {
      const avatar =
        form.get("avatar");

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

        if (
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
          ].includes(
            avatar.type,
          )
        ) {
          setError(
            "Use JPG, PNG or WEBP for your profile photo.",
          );

          setBusy(false);
          return;
        }

        const extension =
          avatar.name
            .split(".")
            .pop() ||
          "jpg";

        const storagePath =
          `${userId}/avatar/${Date.now()}.${extension}`;

        const {
          error:
            uploadError,
        } =
          await supabase.storage
            .from(
              "social-media",
            )
            .upload(
              storagePath,
              avatar,
              {
                upsert:
                  true,
              },
            );

        if (
          uploadError
        ) {
          setError(
            uploadError.message,
          );

          setBusy(false);
          return;
        }

        const {
          data:
            publicData,
        } =
          supabase.storage
            .from(
              "social-media",
            )
            .getPublicUrl(
              storagePath,
            );

        avatarUrl =
          publicData.publicUrl;
      }
    }

    const {
      error:
        profileError,
    } =
      await supabase
        .from(
          "social_profiles",
        )
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

          account_type:
            finalType,

          /*
           * Legacy fields are deliberately
           * cleared.
           */
          department:
            null,

          course:
            null,

          updated_at:
            new Date()
              .toISOString(),
        });

    if (
      profileError
    ) {
      setError(
        profileError.message,
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
      className="space-y-6"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {isAdmin ? (
        <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={23}
              className="mt-0.5 text-violet-700"
            />

            <div>
              <p className="font-black text-violet-950">
                Administrator Account
              </p>

              <p className="mt-1 text-xs leading-5 text-violet-700">
                Your administrator
                privileges are already
                verified by JMIT Next.
                No department, course or
                college ID is required.
              </p>

              <div className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-xs font-black text-violet-700 shadow-sm">
                ✦ Gradient Violet
                Verification
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Choose Account Type
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setAccountType(
                  "student",
                )
              }
              className={`rounded-2xl border p-5 text-left transition ${
                accountType ===
                "student"
                  ? "border-amber-400 bg-amber-50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <GraduationCap
                size={22}
                className="text-amber-600"
              />

              <p className="mt-3 font-black">
                Student
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Can upload photos and
                videos and receives a
                yellow student badge.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setAccountType(
                  "visitor",
                )
              }
              className={`rounded-2xl border p-5 text-left transition ${
                accountType ===
                "visitor"
                  ? "border-slate-500 bg-slate-100 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Users
                size={22}
                className="text-slate-700"
              />

              <p className="mt-3 font-black">
                Visitor
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                View, follow, like and
                comment only. No posting.
              </p>
            </button>
          </div>
        </div>
      )}

      {(isAdmin ||
        accountType ===
          "student") && (
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 transition hover:border-blue-300 hover:bg-blue-50/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <Camera
              size={22}
            />
          </div>

          <div>
            <p className="font-black">
              Profile Photo
            </p>

            <p className="text-xs text-slate-500">
              JPG, PNG or WEBP,
              maximum 5 MB
            </p>
          </div>

          <input
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
        </label>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="display_name"
          required
          placeholder="Display name"
          className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-blue-400 focus:bg-white"
        />

        <input
          name="username"
          required
          placeholder="username"
          className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-blue-400 focus:bg-white"
        />
      </div>

      <textarea
        name="bio"
        rows={4}
        maxLength={300}
        placeholder="Bio..."
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none transition focus:border-blue-400 focus:bg-white"
      />

      {!isAdmin &&
        accountType ===
          "visitor" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-600">
            Visitor accounts do not
            receive a verification badge
            and cannot create photo/video
            posts.
          </div>
        )}

      <button
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071f50] px-5 py-3.5 font-black text-white transition hover:bg-blue-900 disabled:opacity-60"
      >
        {busy ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <UserRound
            size={18}
          />
        )}

        Create Social Profile
      </button>
    </form>
  );
}
