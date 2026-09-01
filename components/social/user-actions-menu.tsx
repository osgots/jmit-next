"use client";

import {
  Ban,
  MoreHorizontal,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import ReportDialog from "@/components/social/report-dialog";

import {
  createClient,
} from "@/lib/supabase/client";


export default function UserActionsMenu({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const router =
    useRouter();

  const [
    menu,
    setMenu,
  ] =
    useState(false);

  const [
    busy,
    setBusy,
  ] =
    useState(false);


  async function blockUser() {
    if (
      !window.confirm(
        "Block this user? You will stop following each other and their Social Connect content and chats will be hidden.",
      )
    ) {
      return;
    }


    setBusy(
      true,
    );


    const supabase =
      createClient();


    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();


    if (!user) {
      router.push(
        "/auth/login",
      );

      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "social_blocks",
        )
        .insert({
          blocker_id:
            user.id,

          blocked_id:
            targetUserId,
        });


    if (
      error &&
      error.code !==
        "23505"
    ) {
      window.alert(
        error.message,
      );

      setBusy(
        false,
      );

      return;
    }


    router.replace(
      "/social-connect",
    );

    router.refresh();
  }


  return (
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
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        aria-label="User options"
      >
        <MoreHorizontal
          size={19}
        />
      </button>


      {menu && (
        <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

          <ReportDialog
            targetType="user"
            targetId={
              targetUserId
            }
            label="Report User"
            buttonClassName="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-slate-800"
          />


          <button
            type="button"
            disabled={
              busy
            }
            onClick={
              blockUser
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
          >
            <Ban
              size={15}
            />

            {busy
              ? "Blocking..."
              : "Block User"}
          </button>
        </div>
      )}
    </div>
  );
}
