"use client";

import {
  Check,
  ImagePlus,
  Loader2,
  Trash2,
  Video,
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


type CoverType =
  "image" |
  "video";


export default function ProfileCoverEditor({
  userId,
  initialUrl,
  initialPath,
  initialType,
  isAdmin,
}: {
  userId: string;
  initialUrl?: string | null;
  initialPath?: string | null;
  initialType?: string | null;
  isAdmin: boolean;
}) {
  const router =
    useRouter();


  const supabaseRef =
    useRef(
      createClient(),
    );


  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const [
    selected,
    setSelected,
  ] =
    useState<File | null>(
      null,
    );


  const [
    selectedType,
    setSelectedType,
  ] =
    useState<CoverType | null>(
      null,
    );


  const [
    preview,
    setPreview,
  ] =
    useState<string | null>(
      initialUrl ??
      null,
    );


  const [
    currentPath,
    setCurrentPath,
  ] =
    useState<string | null>(
      initialPath ??
      null,
    );


  const [
    currentType,
    setCurrentType,
  ] =
    useState<CoverType>(
      initialType ===
        "video"
        ? "video"
        : "image",
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


  const [
    error,
    setError,
  ] =
    useState("");


  useEffect(() => {
    if (!selected) {
      return;
    }


    const url =
      URL.createObjectURL(
        selected,
      );


    setPreview(
      url,
    );


    return () => {
      URL.revokeObjectURL(
        url,
      );
    };
  }, [
    selected,
  ]);


  function chooseFile(
    file:
      File |
      undefined,
  ) {
    if (!file) {
      return;
    }


    const isImage =
      [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(
        file.type,
      );


    const isVideo =
      [
        "video/mp4",
        "video/webm",
      ].includes(
        file.type,
      );


    if (
      !isImage &&
      !isVideo
    ) {
      setError(
        isAdmin
          ? "Use JPG, PNG, WEBP, MP4 or WEBM."
          : "Use JPG, PNG or WEBP.",
      );

      return;
    }


    if (
      isVideo &&
      !isAdmin
    ) {
      setError(
        "Video covers are available only to the Administrator.",
      );

      return;
    }


    const maxSize =
      isVideo
        ? 25 * 1024 * 1024
        : 8 * 1024 * 1024;


    if (
      file.size >
      maxSize
    ) {
      setError(
        isVideo
          ? "Video cover must be smaller than 25 MB."
          : "Image cover must be smaller than 8 MB.",
      );

      return;
    }


    setError(
      "",
    );

    setMessage(
      "",
    );

    setSelected(
      file,
    );

    setSelectedType(
      isVideo
        ? "video"
        : "image",
    );
  }


  async function saveCover() {
    if (
      !selected ||
      !selectedType ||
      busy
    ) {
      return;
    }


    setBusy(
      true,
    );

    setError(
      "",
    );

    setMessage(
      "",
    );


    const supabase =
      supabaseRef.current;


    let extension =
      selected.name
        .split(".")
        .pop()
        ?.toLowerCase();


    if (!extension) {
      extension =
        selectedType ===
          "video"
          ? "mp4"
          : "jpg";
    }


    const path =
      `${userId}/cover/${crypto.randomUUID()}.${extension}`;


    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "social-media",
        )
        .upload(
          path,
          selected,
          {
            cacheControl:
              "31536000",

            upsert:
              false,
          },
        );


    if (uploadError) {
      setError(
        uploadError.message,
      );

      setBusy(
        false,
      );

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
          path,
        );


    const coverUrl =
      publicData.publicUrl;


    const {
      error:
        profileError,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .update({
          cover_url:
            coverUrl,

          cover_path:
            path,

          cover_type:
            selectedType,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "user_id",
          userId,
        );


    if (profileError) {
      await supabase.storage
        .from(
          "social-media",
        )
        .remove([
          path,
        ]);


      setError(
        profileError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    if (
      currentPath &&
      currentPath !==
        path
    ) {
      await supabase.storage
        .from(
          "social-media",
        )
        .remove([
          currentPath,
        ]);
    }


    setCurrentPath(
      path,
    );

    setCurrentType(
      selectedType,
    );

    setPreview(
      coverUrl,
    );

    setSelected(
      null,
    );

    setSelectedType(
      null,
    );

    setMessage(
      selectedType ===
        "video"
        ? "Video cover updated."
        : "Cover photo updated.",
    );

    setBusy(
      false,
    );


    router.refresh();
  }


  async function removeCover() {
    if (busy) {
      return;
    }


    if (
      !window.confirm(
        "Remove your custom profile cover?",
      )
    ) {
      return;
    }


    setBusy(
      true,
    );

    setError(
      "",
    );

    setMessage(
      "",
    );


    const supabase =
      supabaseRef.current;


    const {
      error:
        profileError,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .update({
          cover_url:
            null,

          cover_path:
            null,

          cover_type:
            null,

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "user_id",
          userId,
        );


    if (profileError) {
      setError(
        profileError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    if (currentPath) {
      await supabase.storage
        .from(
          "social-media",
        )
        .remove([
          currentPath,
        ]);
    }


    setCurrentPath(
      null,
    );

    setCurrentType(
      "image",
    );

    setSelected(
      null,
    );

    setSelectedType(
      null,
    );

    setPreview(
      null,
    );

    setMessage(
      "Custom cover removed.",
    );

    setBusy(
      false,
    );


    router.refresh();
  }


  const previewType =
    selectedType ??
    currentType;


  return (
    <section
      id="cover"
      className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">

          {isAdmin ? (
            <Video
              size={21}
            />
          ) : (
            <ImagePlus
              size={21}
            />
          )}

        </div>


        <div>

          <p className="font-black text-slate-950 dark:text-white">
            Profile Background
          </p>


          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

            {isAdmin
              ? "Upload a photo or continuously looping video cover."
              : "Customize the large image behind your profile."}

          </p>

        </div>

      </div>


      <div className="relative mt-5 aspect-[3/1] overflow-hidden rounded-[20px] border border-slate-200 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:border-slate-700">

        {preview &&
          previewType ===
            "video" && (
          <video
            key={
              preview
            }
            src={
              preview
            }
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}


        {preview &&
          previewType ===
            "image" && (
          <img
            src={
              preview
            }
            alt="Profile cover preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}


        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />


        {!preview && (
          <div className="absolute inset-0 flex items-center justify-center">

            <p className="rounded-full bg-black/30 px-4 py-2 text-xs font-black text-white backdrop-blur">
              Default Background
            </p>

          </div>
        )}

      </div>


      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">

        {isAdmin
          ? "Images: JPG/PNG/WEBP up to 8 MB · Videos: MP4/WEBM up to 25 MB · videos autoplay muted and loop continuously."
          : "JPG, PNG or WEBP · maximum 8 MB · wide landscape images work best."}

      </p>


      <div className="mt-4 flex flex-wrap gap-2">

        <button
          type="button"
          disabled={
            busy
          }
          onClick={() =>
            inputRef.current?.click()
          }
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-50"
        >

          {isAdmin ? (
            <Video
              size={16}
            />
          ) : (
            <ImagePlus
              size={16}
            />
          )}


          {preview
            ? "Choose New Background"
            : "Choose Background"}

        </button>


        {selected && (
          <button
            type="button"
            disabled={
              busy
            }
            onClick={
              saveCover
            }
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >

            {busy ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Check
                size={16}
              />
            )}


            Save Background

          </button>
        )}


        {preview && (
          <button
            type="button"
            disabled={
              busy
            }
            onClick={
              removeCover
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >

            <Trash2
              size={16}
            />

            Remove

          </button>
        )}


        <input
          ref={
            inputRef
          }
          type="file"
          accept={
            isAdmin
              ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
              : "image/jpeg,image/png,image/webp"
          }
          onChange={(
            event,
          ) => {
            chooseFile(
              event.target.files?.[0],
            );

            event.currentTarget.value =
              "";
          }}
          className="hidden"
        />

      </div>


      {selectedType ===
        "video" && (
        <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs font-semibold text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300">
          Video selected. It will automatically play muted and continuously loop on your profile.
        </div>
      )}


      {message && (
        <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {
            message
          }
        </p>
      )}


      {error && (
        <p className="mt-4 text-sm font-bold text-red-600 dark:text-red-400">
          {
            error
          }
        </p>
      )}

    </section>
  );
}
