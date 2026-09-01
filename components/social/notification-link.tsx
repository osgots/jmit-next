"use client";

import {
  useRouter,
} from "next/navigation";

import type {
  ReactNode,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function NotificationLink({
  notificationId,
  destination,
  children,
  className,
}: {
  notificationId: string;
  destination: string;
  children: ReactNode;
  className?: string;
}) {
  const router =
    useRouter();


  async function open() {
    const supabase =
      createClient();


    await supabase
      .from(
        "social_notifications",
      )
      .update({
        is_read:
          true,
      })
      .eq(
        "id",
        notificationId,
      );


    router.push(
      destination,
    );

    router.refresh();
  }


  return (
    <button
      type="button"
      onClick={
        open
      }
      className={
        className
      }
    >
      {children}
    </button>
  );
}
