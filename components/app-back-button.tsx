"use client";

import {
  ArrowLeft,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";


export default function AppBackButton({
  fallback,
  label = "Back",
  close = false,
}: {
  fallback: string;
  label?: string;
  close?: boolean;
}) {
  const router =
    useRouter();


  function goBack() {
    /*
     * We intentionally use replace().
     *
     * This behaves more like Instagram/Facebook
     * internal navigation:
     *
     * Post -> Profile
     *
     * rather than:
     *
     * Post -> Profile -> browser Back -> Post again.
     */
    router.replace(
      fallback,
    );
  }


  return (
    <button
      type="button"
      onClick={
        goBack
      }
      className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800"
    >
      {close ? (
        <X
          size={17}
        />
      ) : (
        <ArrowLeft
          size={17}
        />
      )}

      {label}
    </button>
  );
}
