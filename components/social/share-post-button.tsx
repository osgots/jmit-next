"use client";

import {
  Check,
  Share2,
} from "lucide-react";

import {
  useState,
} from "react";


export default function SharePostButton({
  postId,
}: {
  postId: string;
}) {
  const [
    copied,
    setCopied,
  ] =
    useState(false);


  async function share() {
    const url =
      `${window.location.origin}/social-connect/post/${postId}`;


    try {

      if (
        navigator.share
      ) {
        await navigator.share({
          title:
            "JMIT Next Social Connect",

          text:
            "Check out this post on JMIT Next Social Connect.",

          url,
        });

        return;
      }


      await navigator.clipboard.writeText(
        url,
      );

      setCopied(
        true,
      );


      window.setTimeout(
        () =>
          setCopied(
            false,
          ),
        1800,
      );

    } catch (
      error
    ) {
      if (
        error instanceof DOMException &&
        error.name ===
          "AbortError"
      ) {
        return;
      }


      try {
        await navigator.clipboard.writeText(
          url,
        );

        setCopied(
          true,
        );

        window.setTimeout(
          () =>
            setCopied(
              false,
            ),
          1800,
        );
      } catch {
        // Browser blocked clipboard access.
      }
    }
  }


  return (
    <button
      type="button"
      onClick={
        share
      }
      title={
        copied
          ? "Link copied"
          : "Share post"
      }
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
        copied
          ? "text-emerald-600"
          : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {copied ? (
        <Check
          size={20}
        />
      ) : (
        <Share2
          size={20}
        />
      )}
    </button>
  );
}
