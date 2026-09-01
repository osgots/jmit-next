"use client";

import {
  Check,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  deleteComment,
  editComment,
} from "@/app/social-connect/actions";


export default function CommentControls({
  commentId,
  body,
  returnTo,
}: {
  commentId: string;
  body: string;
  returnTo: string;
}) {
  const [
    menu,
    setMenu,
  ] =
    useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState(false);


  if (editing) {
    return (
      <form
        action={
          editComment
        }
        className="mt-2 flex w-full gap-2"
      >
        <input
          type="hidden"
          name="comment_id"
          value={
            commentId
          }
        />

        <input
          type="hidden"
          name="return_to"
          value={
            returnTo
          }
        />

        <input
          name="body"
          required
          maxLength={1000}
          defaultValue={
            body
          }
          autoFocus
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        <button
          title="Save"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"
        >
          <Check
            size={15}
          />
        </button>

        <button
          type="button"
          title="Cancel"
          onClick={() =>
            setEditing(
              false,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
          <X
            size={15}
          />
        </button>
      </form>
    );
  }


  return (
    <div className="relative ml-auto shrink-0">
      <button
        type="button"
        onClick={() =>
          setMenu(
            (
              value,
            ) =>
              !value,
          )
        }
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Comment options"
      >
        <MoreHorizontal
          size={15}
        />
      </button>


      {menu && (
        <div className="absolute right-0 top-8 z-40 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

          <button
            type="button"
            onClick={() => {
              setEditing(
                true,
              );

              setMenu(
                false,
              );
            }}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Pencil
              size={14}
            />

            Edit
          </button>


          <form
            action={
              deleteComment
            }
            onSubmit={(
              event,
            ) => {
              if (
                !window.confirm(
                  "Delete this comment?",
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <input
              type="hidden"
              name="comment_id"
              value={
                commentId
              }
            />

            <input
              type="hidden"
              name="return_to"
              value={
                returnTo
              }
            />

            <button
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2
                size={14}
              />

              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
