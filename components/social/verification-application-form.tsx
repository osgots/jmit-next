"use client";

import {
  BadgeCheck,
  Camera,
  Eye,
  ImagePlus,
  Loader2,
  Trash2,
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


export default function VerificationApplicationForm({
  userId,
}: {
  userId: string;
}) {
  const router =
    useRouter();


  const supabase =
    createClient();


  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const [
    evidence,
    setEvidence,
  ] =
    useState<File | null>(
      null,
    );


  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<string | null>(
      null,
    );


  const [
    fullPreview,
    setFullPreview,
  ] =
    useState(false);


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

    if (!evidence) {
      setPreviewUrl(
        null,
      );

      return;
    }


    const url =
      URL.createObjectURL(
        evidence,
      );


    setPreviewUrl(
      url,
    );


    return () => {
      URL.revokeObjectURL(
        url,
      );
    };

  }, [
    evidence,
  ]);


  function clearEvidence() {

    setEvidence(
      null,
    );


    setPreviewUrl(
      null,
    );


    setFullPreview(
      false,
    );


    if (
      inputRef.current
    ) {
      inputRef.current.value =
        "";
    }
  }


  function selectEvidence(
    file:
      File |
      undefined,
  ) {

    if (!file) {
      return;
    }


    setError(
      "",
    );


    if (
      file.size >
      8 * 1024 * 1024
    ) {
      setError(
        "Verification image must be under 8 MB.",
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
        "Upload JPG, PNG or WEBP.",
      );

      return;
    }


    setEvidence(
      file,
    );
  }


  async function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    setBusy(
      true,
    );

    setError(
      "",
    );


    const form =
      new FormData(
        event.currentTarget,
      );


    const rollNumber =
      String(
        form.get(
          "roll_number",
        ) ?? "",
      ).trim();


    const message =
      String(
        form.get(
          "message",
        ) ?? "",
      ).trim();


    if (!rollNumber) {
      setError(
        "Enter the roll number shown on your ID card.",
      );

      setBusy(
        false,
      );

      return;
    }


    if (!evidence) {
      setError(
        "Upload a selfie while clearly holding your identity card.",
      );

      setBusy(
        false,
      );

      return;
    }


    const extension =
      evidence.name
        .split(".")
        .pop()
        ?.toLowerCase() ??
      "jpg";


    const path =
      `${userId}/${crypto.randomUUID()}.${extension}`;


    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "social-verification",
        )
        .upload(
          path,
          evidence,
        );


    if (
      uploadError
    ) {
      setError(
        uploadError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    const {
      error:
        insertError,
    } =
      await supabase
        .from(
          "social_verification_applications",
        )
        .insert({
          user_id:
            userId,

          evidence_path:
            path,

          claimed_roll_number:
            rollNumber,

          message:
            message ||
            null,
        });


    if (
      insertError
    ) {

      await supabase.storage
        .from(
          "social-verification",
        )
        .remove([
          path,
        ]);


      setError(
        insertError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    router.refresh();
  }


  return (
    <>

      <form
        onSubmit={
          submit
        }
        className="space-y-5"
      >

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {
              error
            }
          </div>
        )}


        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">

          <p className="font-black text-blue-950 dark:text-blue-100">
            Verification photo requirements
          </p>


          <p className="mt-2 text-sm leading-6 text-blue-700 dark:text-blue-300">
            Take one clear selfie showing your face and your JMIT identity card together. Your name, photo and roll number should be readable. Edited or blurred evidence may be rejected.
          </p>

        </div>


        <input
          name="roll_number"
          required
          placeholder="Roll number shown on ID card"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-950 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />


        {!previewUrl ? (

          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="flex min-h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-700"
          >

            <Camera
              size={32}
              className="text-blue-700 dark:text-blue-400"
            />


            <p className="mt-4 font-black text-slate-950 dark:text-white">
              Selfie + Identity Card
            </p>


            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Tap to choose a clear verification image.
            </p>


            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white">
              <ImagePlus
                size={15}
              />

              Choose Photo
            </div>

          </button>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">

            <button
              type="button"
              onClick={() =>
                setFullPreview(
                  true,
                )
              }
              className="relative block h-[340px] w-full bg-slate-950"
            >

              <img
                src={
                  previewUrl
                }
                alt="Verification evidence preview"
                className="h-full w-full object-contain"
              />


              <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur">
                <Eye
                  size={14}
                />

                Full Preview
              </span>

            </button>


            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                  {
                    evidence?.name
                  }
                </p>


                <p className="mt-1 text-xs text-slate-500">
                  {
                    evidence
                      ? `${(
                          evidence.size /
                          1024 /
                          1024
                        ).toFixed(
                          2,
                        )} MB`
                      : ""
                  }
                </p>

              </div>


              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={() =>
                    inputRef.current?.click()
                  }
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white"
                >
                  Replace
                </button>


                <button
                  type="button"
                  onClick={
                    clearEvidence
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
                >
                  <Trash2
                    size={14}
                  />

                  Remove
                </button>

              </div>

            </div>

          </div>

        )}


        <input
          ref={
            inputRef
          }
          name="evidence"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(
            event,
          ) => {
            selectEvidence(
              event.target.files?.[0],
            );
          }}
          className="hidden"
        />


        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          🔒 Private evidence. Only authorized administrators can access this image.
        </div>


        <textarea
          name="message"
          rows={3}
          maxLength={
            500
          }
          placeholder="Optional message to administrator..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-950 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />


        <button
          disabled={
            busy
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-black text-white disabled:opacity-60"
        >

          {busy ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <BadgeCheck
              size={18}
            />
          )}


          Submit Blue Tick Application

        </button>

      </form>


      {fullPreview &&
        previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 sm:p-8">

          <button
            type="button"
            onClick={() =>
              setFullPreview(
                false,
              )
            }
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
          >
            <X
              size={22}
            />
          </button>


          <img
            src={
              previewUrl
            }
            alt="Full verification evidence preview"
            className="max-h-full max-w-full object-contain"
          />

        </div>
      )}

    </>
  );
}
