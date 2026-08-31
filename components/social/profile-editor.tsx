"use client";

import {
  Camera,
  Check,
  GraduationCap,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


type AccountType =
  | "admin"
  | "student"
  | "visitor";


type InitialProfile = {
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  account_type: AccountType;
};


export default function ProfileEditor({
  userId,
  isAdmin,
  mode = "create",
  initialProfile,
}: {
  userId: string;
  isAdmin: boolean;
  mode?: "create" | "edit";
  initialProfile?: InitialProfile | null;
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
      isAdmin
        ? "admin"
        : initialProfile?.account_type ===
            "visitor"
          ? "visitor"
          : "student",
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<string | null>(
      initialProfile?.avatar_url ??
        null,
    );

  const [
    selectedAvatar,
    setSelectedAvatar,
  ] =
    useState<File | null>(
      null,
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


  useEffect(() => {
    if (!selectedAvatar) {
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        selectedAvatar,
      );

    setPreviewUrl(
      objectUrl,
    );

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [
    selectedAvatar,
  ]);


  function selectAvatar(
    file:
      | File
      | undefined,
  ) {
    if (!file) {
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Profile photo must be smaller than 5 MB.",
      );

      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(
        file.type,
      )
    ) {
      setError(
        "Profile photo must be JPG, PNG or WEBP.",
      );

      return;
    }

    setError("");
    setSelectedAvatar(
      file,
    );
  }


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
        form.get(
          "username",
        ) ?? "",
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
        "Username must be 3–30 characters and can contain letters, numbers, _ and . only.",
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


    const finalType:
      AccountType =
      isAdmin
        ? "admin"
        : mode === "edit" &&
            initialProfile
          ? initialProfile.account_type
          : accountType;


    let avatarUrl =
      initialProfile?.avatar_url ??
      null;


    if (
      selectedAvatar &&
      finalType !==
        "visitor"
    ) {
      const extension =
        selectedAvatar.name
          .split(".")
          .pop()
          ?.toLowerCase() ??
        "jpg";

      const storagePath =
        `${userId}/avatar/${crypto.randomUUID()}.${extension}`;

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
            selectedAvatar,
            {
              cacheControl:
                "3600",

              upsert:
                false,
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


    const {
      error:
        profileError,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .upsert(
          {
            user_id:
              userId,

            username,

            display_name:
              displayName,

            bio:
              bio || null,

            avatar_url:
              finalType ===
              "visitor"
                ? null
                : avatarUrl,

            account_type:
              finalType,

            department:
              null,

            course:
              null,

            updated_at:
              new Date()
                .toISOString(),
          },
          {
            onConflict:
              "user_id",
          },
        );


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
      `/social-connect/u/${username}`,
    );

    router.refresh();
  }


  const isEdit =
    mode === "edit";


  return (
    <form
      onSubmit={submit}
      className="space-y-6 text-slate-950"
      style={{
        colorScheme:
          "light",
      }}
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}


      {/* ACCOUNT TYPE */}

      {isAdmin ? (
        <div className="overflow-hidden rounded-[22px] border border-violet-200 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-white shadow-lg shadow-violet-200">
              <ShieldCheck
                size={20}
              />
            </div>

            <div>
              <p className="font-black text-violet-950">
                Administrator
                Profile
              </p>

              <p className="mt-1 text-sm leading-6 text-violet-700">
                Administrator
                privileges are
                already authenticated.
                No department,
                course or college ID
                information is
                required.
              </p>

              <span className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-violet-700 shadow-sm">
                <Check
                  size={14}
                />

                Gradient Violet
                Verification
              </span>
            </div>
          </div>
        </div>
      ) : !isEdit ? (
        <div>
          <label className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-slate-600">
            Account Type
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setAccountType(
                  "student",
                )
              }
              className={`rounded-[20px] border p-5 text-left transition ${
                accountType ===
                "student"
                  ? "border-amber-400 bg-amber-50 ring-2 ring-amber-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <GraduationCap
                size={23}
                className="text-amber-600"
              />

              <p className="mt-3 font-black text-slate-950">
                Student
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Share posts and
                receive the yellow
                student badge.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setAccountType(
                  "visitor",
                )
              }
              className={`rounded-[20px] border p-5 text-left transition ${
                accountType ===
                "visitor"
                  ? "border-slate-500 bg-slate-100 ring-2 ring-slate-100"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Users
                size={23}
                className="text-slate-700"
              />

              <p className="mt-3 font-black text-slate-950">
                Visitor
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Browse, follow,
                like and comment.
                No post uploads.
              </p>
            </button>
          </div>
        </div>
      ) : null}


      {/* AVATAR + PREVIEW */}

      {(isAdmin ||
        accountType ===
          "student") && (
        <div>
          <label className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-slate-600">
            Profile Picture
          </label>

          <div className="flex flex-col items-center gap-5 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:flex-row">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={
                    previewUrl
                  }
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-700 shadow-lg">
                  <UserRound
                    size={40}
                  />
                </div>
              )}

              {selectedAvatar && (
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                  <Check
                    size={13}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="font-black text-slate-950">
                {selectedAvatar
                  ? "Photo ready"
                  : previewUrl
                    ? "Current profile photo"
                    : "Choose your profile photo"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                JPG, PNG or WEBP.
                Maximum 5 MB.
              </p>

              {selectedAvatar && (
                <p className="mt-2 max-w-xs truncate text-xs font-semibold text-emerald-700">
                  {
                    selectedAvatar.name
                  }
                </p>
              )}

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-900">
                <Camera
                  size={16}
                />

                {previewUrl
                  ? "Change Photo"
                  : "Upload Photo"}

                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(
                    event,
                  ) =>
                    selectAvatar(
                      event
                        .target
                        .files?.[0],
                    )
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}


      {/* COMMON FIELDS */}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
            Display Name
          </label>

          <input
            name="display_name"
            required
            defaultValue={
              initialProfile?.display_name ??
              ""
            }
            autoComplete="name"
            placeholder="Your display name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] font-semibold text-slate-950 caret-blue-600 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
            Username
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
              @
            </span>

            <input
              name="username"
              required
              defaultValue={
                initialProfile?.username ??
                ""
              }
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="username"
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-9 pr-4 text-[15px] font-semibold text-slate-950 caret-blue-600 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-600">
            Bio
          </label>

          <span className="text-[11px] font-semibold text-slate-400">
            Maximum 300 characters
          </span>
        </div>

        <textarea
          name="bio"
          maxLength={300}
          rows={5}
          defaultValue={
            initialProfile?.bio ??
            ""
          }
          placeholder="Tell people something about yourself..."
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] leading-7 text-slate-950 caret-blue-600 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          style={{
            colorScheme:
              "light",
          }}
        />
      </div>


      {!isAdmin &&
        accountType ===
          "visitor" && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          Visitor profiles can
          interact with community
          posts but cannot upload
          photos/videos or create
          posts.
        </div>
      )}


      <button
        disabled={
          busy
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#08255b] to-blue-700 px-5 py-4 text-[15px] font-black text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : isEdit ? (
          <Check
            size={18}
          />
        ) : (
          <UserRound
            size={18}
          />
        )}

        {isEdit
          ? "Save Profile Changes"
          : "Create Social Profile"}
      </button>
    </form>
  );
}
