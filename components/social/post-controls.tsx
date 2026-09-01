"use client";

import {
  Bookmark,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  deletePost,
  toggleSave,
} from "@/app/social-connect/actions";

import SharePostButton from "@/components/social/share-post-button";


export default function PostControls({
  postId,
  isOwner,
  isSaved,
  returnTo,
}: {
  postId: string;
  isOwner: boolean;
  isSaved: boolean;
  returnTo: string;
}) {
  const [
    menu,
    setMenu,
  ] =
    useState(false);


  return (
    <div className="ml-auto flex items-center gap-1">

      <SharePostButton
        postId={
          postId
        }
      />


      <form
        action={
          toggleSave
        }
      >
        <input
          type="hidden"
          name="post_id"
          value={
            postId
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
          type="submit"
          title={
            isSaved
              ? "Remove from saved"
              : "Save post"
          }
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
            isSaved
              ? "text-blue-700 dark:text-blue-400"
              : "text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Bookmark
            size={21}
            fill={
              isSaved
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </form>


      {isOwner && (
        <div className="relative">

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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <MoreHorizontal
              size={21}
            />
          </button>


          {menu && (
            <div className="absolute right-0 top-11 z-40 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

              <Link
                href={`/social-connect/post/${postId}/edit`}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <Pencil
                  size={15}
                />

                Edit Post
              </Link>


              <form
                action={
                  deletePost
                }
                onSubmit={(
                  event,
                ) => {
                  if (
                    !window.confirm(
                      "Delete this post permanently?",
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <input
                  type="hidden"
                  name="post_id"
                  value={
                    postId
                  }
                />

                <button className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                  <Trash2
                    size={15}
                  />

                  Delete Post
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
