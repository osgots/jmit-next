"use client";

import {
  Send,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  addComment,
} from "@/app/social-connect/actions";

import MentionTextarea from "@/components/social/mention-textarea";


export default function MentionCommentForm({
  postId,
  returnTo,
  variant = "feed",
}: {
  postId: string;
  returnTo?: string;
  variant?: "feed" | "post";
}) {
  const [
    body,
    setBody,
  ] =
    useState("");


  const [
    busy,
    setBusy,
  ] =
    useState(false);


  async function submit(
    formData: FormData,
  ) {
    const text =
      body.trim();


    if (
      !text ||
      busy
    ) {
      return;
    }


    setBusy(
      true,
    );


    try {

      await addComment(
        formData,
      );


      setBody(
        "",
      );

    } finally {

      setBusy(
        false,
      );

    }
  }


  const isFeed =
    variant ===
    "feed";


  return (
    <form
      action={
        submit
      }
      className={
        isFeed
          ? "mt-5 flex items-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"
          : "flex items-end gap-2 border-t border-slate-100 p-3 sm:p-4 dark:border-slate-800"
      }
    >

      <input
        type="hidden"
        name="post_id"
        value={
          postId
        }
      />


      {returnTo && (
        <input
          type="hidden"
          name="return_to"
          value={
            returnTo
          }
        />
      )}


      <div className="min-w-0 flex-1">

        <MentionTextarea
          name="body"
          required
          value={
            body
          }
          onChange={
            setBody
          }
          rows={1}
          maxLength={
            1000
          }
          placeholder="Add a comment... use @username"
          onKeyDown={(
            event,
          ) => {

            if (
              event.key ===
                "Enter" &&
              !event.shiftKey
            ) {

              event.preventDefault();


              event.currentTarget
                .form
                ?.requestSubmit();

            }

          }}
          className={
            isFeed
              ? "max-h-28 min-h-10 w-full resize-none rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-950 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:text-white"
              : "max-h-32 min-h-11 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          }
        />

      </div>


      <button
        type="submit"
        disabled={
          busy ||
          !body.trim()
        }
        title="Post comment"
        className={
          isFeed
            ? "shrink-0 rounded-xl px-3 py-2.5 text-sm font-black text-blue-700 disabled:opacity-40 dark:text-blue-400"
            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white disabled:opacity-40"
        }
      >

        {isFeed ? (
          "Post"
        ) : (
          <Send
            size={17}
          />
        )}

      </button>

    </form>
  );
}
