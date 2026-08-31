"use client";

import {
  BadgeCheck,
  Camera,
  Loader2,
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

export default function VerificationApplicationForm({
  userId,
}: {
  userId: string;
}) {
  const router =
    useRouter();

  const supabase =
    createClient();

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

    const evidence =
      form.get("evidence");

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

      setBusy(false);
      return;
    }

    if (
      !(evidence instanceof File) ||
      evidence.size === 0
    ) {
      setError(
        "Upload a selfie while clearly holding your identity card.",
      );

      setBusy(false);
      return;
    }

    if (
      evidence.size >
      8 * 1024 * 1024
    ) {
      setError(
        "Verification image must be under 8 MB.",
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
        evidence.type,
      )
    ) {
      setError(
        "Upload JPG, PNG or WEBP.",
      );

      setBusy(false);
      return;
    }

    const extension =
      evidence.name
        .split(".")
        .pop() ||
      "jpg";

    const path =
      `${userId}/${crypto.randomUUID()}.${extension}`;

    const {
      error: uploadError,
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

      setBusy(false);
      return;
    }

    const {
      error: insertError,
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
            message || null,
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

      setBusy(false);
      return;
    }

    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="font-black text-blue-950">
          Verification photo
          requirements
        </p>

        <p className="mt-2 text-sm leading-6 text-blue-700">
          Take one clear selfie
          showing your face and your
          JMIT identity card together.
          Your name, photo and roll
          number should be readable.
          Edited or blurred evidence
          may be rejected.
        </p>
      </div>

      <input
        name="roll_number"
        required
        placeholder="Roll number shown on ID card"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:border-blue-400"
      />

      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-blue-300 hover:bg-blue-50">
        <Camera
          size={30}
          className="text-blue-700"
        />

        <p className="mt-4 font-black">
          Selfie + Identity Card
        </p>

        <p className="mt-2 text-xs text-slate-500">
          Private. Visible only to
          authorized administrators.
        </p>

        <input
          name="evidence"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />
      </label>

      <textarea
        name="message"
        rows={3}
        maxLength={500}
        placeholder="Optional message to administrator..."
        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3.5 outline-none focus:border-blue-400"
      />

      <button
        disabled={busy}
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
  );
}
