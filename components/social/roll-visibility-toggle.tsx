"use client";

import {
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function RollVisibilityToggle({
  initialVisible,
  rollNumber,
}: {
  initialVisible: boolean;
  rollNumber: string;
}) {
  const router =
    useRouter();


  const [
    visible,
    setVisible,
  ] =
    useState(
      initialVisible,
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


  async function toggle() {
    if (busy) {
      return;
    }


    const next =
      !visible;


    /*
     * Optimistic UI.
     */
    setVisible(
      next,
    );

    setBusy(
      true,
    );

    setError(
      "",
    );


    const supabase =
      createClient();


    const {
      error:
        rpcError,
    } =
      await supabase.rpc(
        "social_set_roll_visibility",
        {
          p_show:
            next,
        },
      );


    if (rpcError) {
      setVisible(
        !next,
      );

      setError(
        rpcError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    setBusy(
      false,
    );

    router.refresh();
  }


  return (
    <section className="rounded-[24px] border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <BadgeCheck
            size={21}
          />
        </div>


        <div className="min-w-0 flex-1">

          <p className="font-black text-blue-950 dark:text-blue-100">
            Verified Roll Number
          </p>


          <p className="mt-1 text-sm leading-6 text-blue-800 dark:text-blue-300">
            Your verified roll number is{" "}

            <strong>
              {
                rollNumber
              }
            </strong>
            .
          </p>


          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
            Your blue verification remains visible even when your roll number is hidden.
          </p>
        </div>
      </div>


      <button
        type="button"
        onClick={
          toggle
        }
        disabled={
          busy
        }
        className={`mt-5 flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 transition ${
          visible
            ? "border-blue-300 bg-white text-blue-800 dark:border-blue-700 dark:bg-slate-900 dark:text-blue-300"
            : "border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        }`}
      >

        <span className="flex items-center gap-3 text-sm font-black">

          {busy ? (
            <Loader2
              size={18}
              className="animate-spin"
            />

          ) : visible ? (
            <Eye
              size={18}
            />

          ) : (
            <EyeOff
              size={18}
            />
          )}


          Show roll number on my profile

        </span>


        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${
            visible
              ? "bg-blue-600"
              : "bg-slate-300 dark:bg-slate-700"
          }`}
        >

          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              visible
                ? "left-6"
                : "left-1"
            }`}
          />

        </span>
      </button>


      <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">

        Currently:{" "}

        <strong
          className={
            visible
              ? "text-blue-700 dark:text-blue-300"
              : "text-slate-700 dark:text-slate-200"
          }
        >
          {visible
            ? "Visible to everyone"
            : "Private"}
        </strong>

      </p>


      {error && (
        <p className="mt-3 text-xs font-bold text-red-600 dark:text-red-400">
          {
            error
          }
        </p>
      )}
    </section>
  );
}
