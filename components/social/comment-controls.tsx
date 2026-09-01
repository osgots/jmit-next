"use client";

import {
  Check,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

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
  canEdit,
  canDelete,
}: {
  commentId: string;
  body: string;
  returnTo: string;
  canEdit: boolean;
  canDelete: boolean;
}) {
  const router =
    useRouter();


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


  const [
    pending,
    setPending,
  ] =
    useState(false);


  const [
    hidden,
    setHidden,
  ] =
    useState(false);


  async function saveEdit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (pending) {
      return;
    }


    const form =
      event.currentTarget;


    const data =
      new FormData(
        form,
      );


    setPending(
      true,
    );


    try {

      await editComment(
        data,
      );


      setEditing(
        false,
      );


      /*
       * RSC refresh, NOT browser reload.
       */
      router.refresh();

    } finally {

      setPending(
        false,
      );
    }
  }


  async function removeComment(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    if (pending) {
      return;
    }


    if (
      !window.confirm(
        "Delete this comment?",
      )
    ) {
      return;
    }


    const data =
      new FormData(
        event.currentTarget,
      );


    /*
     * Optimistic removal.
     * It disappears immediately before network response.
     */
    setHidden(
      true,
    );


    setPending(
      true,
    );


    try {

      await deleteComment(
        data,
      );


      router.refresh();

    } catch (
      error
    ) {

      /*
       * Restore it if request itself fails.
       */
      setHidden(
        false,
      );


      console.error(
        error,
      );

    } finally {

      setPending(
        false,
      );
    }
  }


  if (
    hidden
  ) {
    return null;
  }


  if (
    !canEdit &&
    !canDelete
  ) {
    return null;
  }


  if (
    editing &&
    canEdit
  ) {
    return (
      <form
        onSubmit={
          saveEdit
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
          maxLength={
            1000
          }
          defaultValue={
            body
          }
          autoFocus
          disabled={
            pending
          }
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />


        <button
          disabled={
            pending
          }
          title="Save"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >

          {pending ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Check
              size={15}
            />
          )}
        </button>


        <button
          type="button"
          disabled={
            pending
          }
          title="Cancel"
          onClick={() =>
            setEditing(
              false,
            )
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
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
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Comment options"
      >

        <MoreHorizontal
          size={16}
        />
      </button>


      {menu && (
        <div className="absolute right-0 top-9 z-40 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

          {canEdit && (
            <button
              type="button"
              disabled={
                pending
              }
              onClick={() => {

                setEditing(
                  true,
                );

                setMenu(
                  false,
                );
              }}
              className="flex w-full items-center gap-2 px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >

              <Pencil
                size={14}
              />

              Edit
            </button>
          )}


          {canDelete && (
            <form
              onSubmit={
                removeComment
              }
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
                disabled={
                  pending
                }
                className="flex w-full items-center gap-2 px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
              >

                {pending ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={14}
                  />
                )}

                Delete
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
