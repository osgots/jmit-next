"use client";

import {
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  Play,
  RotateCcw,
  Send,
  Trash2,
  Upload,
  Video,
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


type ComposerProfile = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
};


type PostComposerProps = {
  userId: string;

  profile: ComposerProfile;

  mode?: "create" | "edit";

  postId?: string;

  initialCaption?: string | null;

  initialMediaUrl?: string | null;

  initialMediaPath?: string | null;

  initialMediaType?:
    | "image"
    | "video"
    | null;
};


const MAX_SIZE =
  25 * 1024 * 1024;


const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];


export default function PostComposer({
  userId,
  profile,
  mode = "create",
  postId,
  initialCaption = "",
  initialMediaUrl = null,
  initialMediaPath = null,
  initialMediaType = null,
}: PostComposerProps) {
  const router =
    useRouter();

  const supabase =
    createClient();

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<File | null>(
      null,
    );


  const [
    localPreview,
    setLocalPreview,
  ] =
    useState<string | null>(
      null,
    );


  const [
    caption,
    setCaption,
  ] =
    useState(
      initialCaption ?? "",
    );


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    busy,
    setBusy,
  ] =
    useState(false);


  const [
    dragActive,
    setDragActive,
  ] =
    useState(false);


  const previewUrl =
    localPreview ??
    initialMediaUrl;


  const previewType:
    | "image"
    | "video"
    | null =
    selectedFile
      ? selectedFile.type.startsWith(
          "video/",
        )
        ? "video"
        : "image"
      : initialMediaType;


  useEffect(() => {
    if (!selectedFile) {
      setLocalPreview(
        null,
      );

      return;
    }


    const objectUrl =
      URL.createObjectURL(
        selectedFile,
      );


    setLocalPreview(
      objectUrl,
    );


    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [
    selectedFile,
  ]);


  function validateAndSelect(
    file:
      | File
      | undefined,
  ) {
    if (!file) {
      return;
    }


    setError("");


    if (
      !ACCEPTED_TYPES.includes(
        file.type,
      )
    ) {
      setError(
        "Unsupported format. Use JPG, PNG, WEBP, GIF, MP4 or WEBM.",
      );

      return;
    }


    if (
      file.size >
      MAX_SIZE
    ) {
      setError(
        "This file is larger than 25 MB. Choose a smaller photo or video.",
      );

      return;
    }


    setSelectedFile(
      file,
    );
  }


  function removeSelection() {
    setSelectedFile(
      null,
    );

    setLocalPreview(
      null,
    );


    if (
      inputRef.current
    ) {
      inputRef.current.value =
        "";
    }
  }


  function humanSize(
    size: number,
  ) {
    if (
      size >=
      1024 * 1024
    ) {
      return `${(
        size /
        1024 /
        1024
      ).toFixed(1)} MB`;
    }


    return `${(
      size / 1024
    ).toFixed(0)} KB`;
  }


  async function uploadMedia(
    file: File,
  ) {
    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ??
      (
        file.type.startsWith(
          "video/",
        )
          ? "mp4"
          : "jpg"
      );


    const storagePath =
      `${userId}/posts/${crypto.randomUUID()}.${extension}`;


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
          file,
          {
            cacheControl:
              "3600",

            contentType:
              file.type,

            upsert:
              false,
          },
        );


    if (
      uploadError
    ) {
      throw new Error(
        `Upload failed: ${uploadError.message}`,
      );
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


    return {
      storagePath,

      publicUrl:
        publicData.publicUrl,

      mediaType:
        file.type.startsWith(
          "video/",
        )
          ? "video"
          : "image",
    } as const;
  }


  async function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setError("");


    let newlyUploadedPath:
      | string
      | null =
      null;


    try {
      if (
        mode === "create" &&
        !selectedFile
      ) {
        throw new Error(
          "Choose a photo or video before sharing your post.",
        );
      }


      let mediaUrl =
        initialMediaUrl;

      let mediaPath =
        initialMediaPath;

      let mediaType =
        initialMediaType;


      if (
        selectedFile
      ) {
        const uploaded =
          await uploadMedia(
            selectedFile,
          );


        newlyUploadedPath =
          uploaded.storagePath;

        mediaUrl =
          uploaded.publicUrl;

        mediaPath =
          uploaded.storagePath;

        mediaType =
          uploaded.mediaType;
      }


      if (
        !mediaUrl ||
        !mediaType
      ) {
        throw new Error(
          "Your post requires a photo or video.",
        );
      }


      if (
        mode === "create"
      ) {
        const {
          error:
            insertError,
        } =
          await supabase
            .from(
              "social_posts",
            )
            .insert({
              user_id:
                userId,

              caption:
                caption.trim() ||
                null,

              media_url:
                mediaUrl,

              media_path:
                mediaPath,

              media_type:
                mediaType,

              status:
                "active",

              updated_at:
                new Date()
                  .toISOString(),
            });


        if (
          insertError
        ) {
          throw new Error(
            `Post could not be created: ${insertError.message}`,
          );
        }


        newlyUploadedPath =
          null;


        router.push(
          "/social-connect",
        );

        router.refresh();

        return;
      }


      if (
        !postId
      ) {
        throw new Error(
          "Post ID is missing.",
        );
      }


      const {
        error:
          updateError,
      } =
        await supabase
          .from(
            "social_posts",
          )
          .update({
            caption:
              caption.trim() ||
              null,

            media_url:
              mediaUrl,

            media_path:
              mediaPath,

            media_type:
              mediaType,

            updated_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            postId,
          )
          .eq(
            "user_id",
            userId,
          );


      if (
        updateError
      ) {
        throw new Error(
          `Post could not be updated: ${updateError.message}`,
        );
      }


      /*
       * Replacement succeeded.
       * Remove the OLD media object.
       */
      if (
        selectedFile &&
        initialMediaPath &&
        initialMediaPath !==
          mediaPath
      ) {
        await supabase.storage
          .from(
            "social-media",
          )
          .remove([
            initialMediaPath,
          ]);
      }


      newlyUploadedPath =
        null;


      router.push(
        `/social-connect/post/${postId}`,
      );

      router.refresh();

    } catch (
      caught
    ) {
      /*
       * If media uploaded but DB write failed,
       * clean the unused object automatically.
       */
      if (
        newlyUploadedPath
      ) {
        await supabase.storage
          .from(
            "social-media",
          )
          .remove([
            newlyUploadedPath,
          ]);
      }


      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong while saving the post.",
      );

      setBusy(false);
    }
  }


  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-950 shadow-xl shadow-slate-200/40"
    >
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
            Social Connect
          </p>

          <h2 className="mt-1 text-lg font-black text-[#071a3d]">
            {mode ===
            "edit"
              ? "Edit Post"
              : "Create New Post"}
          </h2>
        </div>


        <button
          type="submit"
          disabled={
            busy
          }
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : mode ===
            "edit" ? (
            <Check
              size={16}
            />
          ) : (
            <Send
              size={16}
            />
          )}

          {busy
            ? mode === "edit"
              ? "Saving..."
              : "Uploading..."
            : mode ===
                "edit"
              ? "Save"
              : "Share"}
        </button>
      </div>


      <div className="grid lg:grid-cols-[1.35fr_.65fr]">


        {/* ================================================
            MEDIA PREVIEW
        ================================================= */}

        <div className="relative min-h-[420px] border-b border-slate-200 bg-[#0b0b0d] lg:min-h-[620px] lg:border-b-0 lg:border-r">

          {previewUrl ? (
            <>
              {previewType ===
              "video" ? (
                <video
                  key={
                    previewUrl
                  }
                  src={
                    previewUrl
                  }
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full min-h-[420px] max-h-[720px] w-full object-contain lg:min-h-[620px]"
                />
              ) : (
                <img
                  src={
                    previewUrl
                  }
                  alt="Post preview"
                  className="h-full min-h-[420px] max-h-[720px] w-full object-contain lg:min-h-[620px]"
                />
              )}


              <div className="absolute right-4 top-4 flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    inputRef.current?.click()
                  }
                  className="flex items-center gap-2 rounded-xl bg-black/70 px-3 py-2 text-xs font-black text-white backdrop-blur"
                >
                  <Pencil
                    size={14}
                  />

                  Change
                </button>


                {selectedFile && (
                  <button
                    type="button"
                    onClick={
                      removeSelection
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/70 text-white backdrop-blur"
                    title="Undo selected media"
                  >
                    {mode ===
                    "edit" ? (
                      <RotateCcw
                        size={15}
                      />
                    ) : (
                      <X
                        size={16}
                      />
                    )}
                  </button>
                )}

              </div>


              {previewType ===
                "video" && (
                <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur">
                  <Play
                    size={14}
                    fill="currentColor"
                  />

                  Video Preview
                </div>
              )}
            </>
          ) : (
            <label
              onDragEnter={(
                event,
              ) => {
                event.preventDefault();
                setDragActive(
                  true,
                );
              }}
              onDragOver={(
                event,
              ) => {
                event.preventDefault();
                setDragActive(
                  true,
                );
              }}
              onDragLeave={() =>
                setDragActive(
                  false,
                )
              }
              onDrop={(
                event,
              ) => {
                event.preventDefault();

                setDragActive(
                  false,
                );

                validateAndSelect(
                  event
                    .dataTransfer
                    .files?.[0],
                );
              }}
              className={`flex min-h-[420px] cursor-pointer flex-col items-center justify-center p-8 text-center transition lg:min-h-[620px] ${
                dragActive
                  ? "bg-blue-950"
                  : "bg-[#0b0b0d]"
              }`}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white">
                <Upload
                  size={32}
                />
              </div>

              <h3 className="mt-6 text-xl font-black text-white">
                Select a photo
                or video
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Drag media here or
                click to browse.
                Your preview will
                appear before you
                publish it.
              </p>

              <div className="mt-5 flex gap-3 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ImagePlus
                    size={15}
                  />

                  Photo
                </span>

                <span className="flex items-center gap-1.5">
                  <Video
                    size={15}
                  />

                  Video
                </span>
              </div>

              <span className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-slate-900">
                Select From Device
              </span>
            </label>
          )}


          <input
            ref={
              inputRef
            }
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            onChange={(
              event,
            ) =>
              validateAndSelect(
                event.target
                  .files?.[0],
              )
            }
            className="hidden"
          />
        </div>


        {/* ================================================
            INSTAGRAM-LIKE SIDE PANEL
        ================================================= */}

        <div className="flex min-w-0 flex-col">

          <div className="flex items-center gap-3 border-b border-slate-100 p-5">

            {profile.avatarUrl ? (
              <img
                src={
                  profile.avatarUrl
                }
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">
                {profile.displayName
                  .slice(
                    0,
                    1,
                  )
                  .toUpperCase()}
              </div>
            )}


            <div className="min-w-0">

              <p className="truncate text-sm font-black text-slate-900">
                {
                  profile.displayName
                }
              </p>

              <p className="truncate text-xs text-slate-400">
                @
                {
                  profile.username
                }
              </p>

            </div>

          </div>


          <div className="flex-1 p-5">

            <textarea
              value={
                caption
              }
              onChange={(
                event,
              ) =>
                setCaption(
                  event.target.value,
                )
              }
              rows={8}
              maxLength={
                2200
              }
              placeholder="Write a caption..."
              className="w-full resize-none bg-transparent text-[15px] leading-7 text-slate-950 outline-none placeholder:text-slate-400"
            />


            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-4">

              <span className="text-xs font-semibold text-slate-400">
                {
                  caption.length
                }
                /2200
              </span>


              {selectedFile && (
                <span className="max-w-[170px] truncate text-xs font-semibold text-emerald-700">
                  {
                    selectedFile.name
                  }
                </span>
              )}

            </div>


            {selectedFile && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">

                <p className="font-black text-slate-800">
                  Selected media
                </p>

                <p className="mt-1">
                  {
                    humanSize(
                      selectedFile.size,
                    )
                  }
                  {" • "}
                  {selectedFile.type.startsWith(
                    "video/",
                  )
                    ? "Video"
                    : "Photo"}
                </p>

              </div>
            )}


            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-6 text-red-700">
                {
                  error
                }
              </div>
            )}

          </div>


          <div className="border-t border-slate-100 p-5">

            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">

              <Check
                size={15}
                className="mt-0.5 shrink-0"
              />

              Photos and videos
              are previewed before
              being uploaded.
              Maximum file size:
              25 MB.

            </div>

          </div>

        </div>

      </div>
    </form>
  );
}
