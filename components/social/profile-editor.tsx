"use client";

import MentionTextarea from "@/components/social/mention-textarea";

import {
  Camera,
  Check,
  GraduationCap,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
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

  roll_number?: string | null;
  department?: string | null;
  semester?: number | null;
  profile_completed?: boolean | null;
};


const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electrical & Computer Engineering",
  "Mechanical Engineering",
  "Electronics & Communication Engineering",
  "Civil Engineering",
  "BCA",
  "BBA",
  "MBA",
  "MCA",
  "Other",
];


function cleanUsername(
  raw: string,
) {
  return raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 30);
}


function usernameFormatValid(
  value: string,
) {
  return (
    value.length >= 3 &&
    value.length <= 30 &&
    /^[a-z0-9_][a-z0-9._]*[a-z0-9_]$/.test(
      value,
    ) &&
    !value.includes("..")
  );
}


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

  const fileRef =
    useRef<HTMLInputElement>(
      null,
    );

  const initialType: AccountType =
    isAdmin
      ? "admin"
      : initialProfile?.account_type ===
          "visitor"
        ? "visitor"
        : "student";

  const [
    accountType,
    setAccountType,
  ] =
    useState<AccountType>(
      initialType,
    );

  const [
    username,
    setUsername,
  ] =
    useState(
      initialProfile?.username ??
        "",
    );

  const [
    bio,
    setBio,
  ] =
    useState(
      initialProfile?.bio ??
        "",
    );


  const [
    availability,
    setAvailability,
  ] =
    useState<
      | "idle"
      | "checking"
      | "available"
      | "taken"
      | "invalid"
    >("idle");

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

    return () =>
      URL.revokeObjectURL(
        objectUrl,
      );
  }, [selectedAvatar]);


  useEffect(() => {
    if (!username) {
      setAvailability(
        "idle",
      );

      return;
    }

    if (
      !usernameFormatValid(
        username,
      )
    ) {
      setAvailability(
        "invalid",
      );

      return;
    }

    if (
      mode === "edit" &&
      username ===
        initialProfile?.username
    ) {
      setAvailability(
        "available",
      );

      return;
    }

    setAvailability(
      "checking",
    );

    const timer =
      window.setTimeout(
        async () => {
          const {
            data,
            error:
              rpcError,
          } =
            await supabase.rpc(
              "social_username_available",
              {
                p_username:
                  username,
              },
            );

          if (rpcError) {
            console.error(
              rpcError,
            );

            setAvailability(
              "idle",
            );

            return;
          }

          setAvailability(
            data
              ? "available"
              : "taken",
          );
        },
        450,
      );

    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    username,
    mode,
    initialProfile?.username,
    supabase,
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

    if (
      !usernameFormatValid(
        username,
      )
    ) {
      setError(
        "Username must be 3–30 lowercase characters. Use letters, numbers, . or _. A period cannot be first, last or repeated.",
      );

      setBusy(false);

      return;
    }

    if (
      availability ===
        "taken"
    ) {
      setError(
        "That username is already taken.",
      );

      setBusy(false);

      return;
    }

    const form =
      new FormData(
        event.currentTarget,
      );

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

    const rollNumber =
      String(
        form.get(
          "roll_number",
        ) ?? "",
      ).trim();

    const department =
      String(
        form.get(
          "department",
        ) ?? "",
      ).trim();

    const semesterText =
      String(
        form.get(
          "semester",
        ) ?? "",
      );

    const semester =
      semesterText
        ? Number(
            semesterText,
          )
        : null;

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

    if (
      finalType ===
      "student"
    ) {
      if (
        !rollNumber ||
        !department ||
        !semester ||
        semester < 1 ||
        semester > 8
      ) {
        setError(
          "Student accounts must provide Roll Number, Department and Semester.",
        );

        setBusy(false);

        return;
      }
    }

    let avatarUrl =
      initialProfile?.avatar_url ??
      null;

    /*
     * Visitor accounts cannot upload
     * Social Connect media.
     */
    if (
      selectedAvatar &&
      (
        finalType ===
          "student" ||
        finalType ===
          "admin"
      )
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

    const profileCompleted =
      finalType !==
        "student" ||
      Boolean(
        rollNumber &&
          department &&
          semester &&
          semester >= 1 &&
          semester <= 8,
      );

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

            roll_number:
              finalType ===
              "student"
                ? rollNumber
                : null,

            department:
              finalType ===
              "student"
                ? department
                : null,

            semester:
              finalType ===
              "student"
                ? semester
                : null,

            profile_completed:
              profileCompleted,

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

    if (profileError) {
      if (
        profileError.code ===
          "23505" ||
        profileError.message
          .toLowerCase()
          .includes(
            "duplicate",
          )
      ) {
        setError(
          "That username is already taken. Choose another username.",
        );

        setAvailability(
          "taken",
        );
      } else {
        setError(
          profileError.message,
        );
      }

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

  const studentSelected =
    !isAdmin &&
    accountType ===
      "student";

  const canUploadSocialAvatar =
    isAdmin ||
    studentSelected;


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

      {isAdmin ? (
        <div className="rounded-[22px] border border-violet-200 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 text-white">
              <ShieldCheck
                size={20}
              />
            </div>

            <div>
              <p className="font-black text-violet-950">
                Administrator Profile
              </p>

              <p className="mt-1 text-sm leading-6 text-violet-700">
                Administrator identity is provided by your JMIT Next account role.
              </p>
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
              className={`rounded-[20px] border p-5 text-left ${
                accountType ===
                "student"
                  ? "border-amber-400 bg-amber-50 ring-2 ring-amber-100"
                  : "border-slate-200 bg-white"
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
                Share posts and receive a yellow student identity dot. Blue verification requires separate admin review.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setAccountType(
                  "visitor",
                )
              }
              className={`rounded-[20px] border p-5 text-left ${
                accountType ===
                "visitor"
                  ? "border-slate-500 bg-slate-100 ring-2 ring-slate-100"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Users
                size={23}
                className="text-slate-700"
              />

              <p className="mt-3 font-black text-slate-950">
                Visitor / Other
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Browse, search, like, save, comment, follow and chat. Social media uploads are disabled.
              </p>
            </button>
          </div>
        </div>
      ) : null}


      {canUploadSocialAvatar && (
        <div>
          <label className="mb-3 block text-xs font-black uppercase tracking-[0.16em] text-slate-600">
            Profile Picture
          </label>

          <div className="flex flex-col items-center gap-5 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:flex-row">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-50 text-blue-700 shadow-lg">
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
                JPG, PNG or WEBP. Maximum 5 MB.
              </p>

              <button
                type="button"
                onClick={() =>
                  fileRef.current?.click()
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-black text-white"
              >
                <Camera
                  size={16}
                />

                {previewUrl
                  ? "Change Photo"
                  : "Upload Photo"}
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(
                  event,
                ) =>
                  selectAvatar(
                    event.target.files?.[0],
                  )
                }
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}


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
            placeholder="Your display name"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>


        <div>
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
            Username
          </label>

          <div className="relative">
            <span className="absolute left-4 top-[17px] font-bold text-slate-400">
              @
            </span>

            <input
              name="username"
              required
              value={username}
              onChange={(
                event,
              ) =>
                setUsername(
                  cleanUsername(
                    event.target.value,
                  ),
                )
              }
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="username"
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-9 pr-4 text-[15px] font-semibold lowercase text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mt-2 min-h-5 text-xs font-semibold">
            {availability ===
              "checking" && (
              <span className="text-slate-500">
                Checking availability...
              </span>
            )}

            {availability ===
              "available" && (
              <span className="text-emerald-600">
                ✓ Username available
              </span>
            )}

            {availability ===
              "taken" && (
              <span className="text-red-600">
                <X
                  size={12}
                  className="mr-1 inline"
                />
                Username already taken
              </span>
            )}

            {availability ===
              "invalid" && (
              <span className="text-amber-700">
                3–30 lowercase letters, numbers, . and _ only.
              </span>
            )}
          </div>
        </div>
      </div>


      {studentSelected && (
        <div className="rounded-[22px] border border-amber-200 bg-amber-50/60 p-5">
          <div className="mb-5">
            <p className="font-black text-slate-950">
              Student Details
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              These details are required for Student accounts.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
                Roll Number
              </label>

              <input
                name="roll_number"
                required
                defaultValue={
                  initialProfile?.roll_number ??
                  ""
                }
                placeholder="Enter university/college roll number"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
                Department
              </label>

              <select
                name="department"
                required
                defaultValue={
                  initialProfile?.department ??
                  ""
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  Select department
                </option>

                {departments.map(
                  (
                    department,
                  ) => (
                    <option
                      key={
                        department
                      }
                      value={
                        department
                      }
                    >
                      {
                        department
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.13em] text-slate-600">
                Semester
              </label>

              <select
                name="semester"
                required
                defaultValue={
                  initialProfile?.semester?.toString() ??
                  ""
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  Select semester
                </option>

                {Array.from(
                  {
                    length: 8,
                  },
                  (
                    _,
                    index,
                  ) =>
                    index + 1,
                ).map(
                  (
                    semester,
                  ) => (
                    <option
                      key={
                        semester
                      }
                      value={
                        semester
                      }
                    >
                      Semester{" "}
                      {
                        semester
                      }
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>
      )}


      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className="text-xs font-black uppercase tracking-[0.13em] text-slate-600">
            Bio
          </label>

          <span className="text-[11px] font-semibold text-slate-400">
            Maximum 300 characters
          </span>
        </div>

        <MentionTextarea
          name="bio"
          value={
            bio
          }
          onChange={
            setBio
          }
          maxLength={
            300
          }
          rows={5}
          placeholder="Tell people something about yourself... use @username to mention"
          className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] leading-7 text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>


      {!isAdmin &&
        accountType ===
          "visitor" && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Visitor accounts can browse, search, like, save, comment, follow and chat, but cannot upload Social Connect photos/videos or create posts.
          </div>
        )}


      <button
        disabled={
          busy ||
          availability ===
            "taken" ||
          availability ===
            "invalid" ||
          availability ===
            "checking"
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#08255b] to-blue-700 px-5 py-4 text-[15px] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
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
