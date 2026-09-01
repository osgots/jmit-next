"use client";

import {
  UserCheck,
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


export default function UnblockButton({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const router =
    useRouter();

  const [
    busy,
    setBusy,
  ] =
    useState(false);


  async function unblock() {
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
      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "social_blocks",
        )
        .delete()
        .eq(
          "blocker_id",
          user.id,
        )
        .eq(
          "blocked_id",
          targetUserId,
        );


    if (error) {
      window.alert(
        error.message,
      );

      setBusy(
        false,
      );

      return;
    }


    router.refresh();

    setBusy(
      false,
    );
  }


  return (
    <button
      type="button"
      disabled={
        busy
      }
      onClick={
        unblock
      }
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50"
    >
      <UserCheck
        size={15}
      />

      {busy
        ? "Unblocking..."
        : "Unblock"}
    </button>
  );
}
