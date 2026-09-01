"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


function formatPresence(
  value:
    string
    | null,
) {
  if (!value) {
    return {
      online:
        false,

      label:
        "Offline",
    };
  }


  const age =
    Date.now() -
    new Date(
      value,
    ).getTime();


  if (
    age <=
    90_000
  ) {
    return {
      online:
        true,

      label:
        "Online",
    };
  }


  const minutes =
    Math.floor(
      age / 60_000,
    );


  if (
    minutes <
    60
  ) {
    return {
      online:
        false,

      label:
        `Active ${Math.max(
          1,
          minutes,
        )}m ago`,
    };
  }


  const hours =
    Math.floor(
      minutes / 60,
    );


  if (
    hours <
    24
  ) {
    return {
      online:
        false,

      label:
        `Active ${hours}h ago`,
    };
  }


  const days =
    Math.floor(
      hours / 24,
    );


  return {
    online:
      false,

    label:
      `Active ${days}d ago`,
  };
}


export default function PresenceLabel({
  userId,
}: {
  userId: string;
}) {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    lastSeen,
    setLastSeen,
  ] =
    useState<string | null>(
      null,
    );


  useEffect(() => {
    let alive =
      true;


    async function load() {
      const {
        data,
      } =
        await supabase
          .from(
            "social_presence",
          )
          .select(
            "last_seen_at",
          )
          .eq(
            "user_id",
            userId,
          )
          .maybeSingle();


      if (alive) {
        setLastSeen(
          data?.last_seen_at ??
          null,
        );
      }
    }


    load();


    const timer =
      window.setInterval(
        load,
        30_000,
      );


    return () => {
      alive =
        false;

      window.clearInterval(
        timer,
      );
    };
  }, [
    supabase,
    userId,
  ]);


  const status =
    formatPresence(
      lastSeen,
    );


  return (
    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
      <span
        className={`h-2 w-2 rounded-full ${
          status.online
            ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,.6)]"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
      />

      {
        status.label
      }
    </div>
  );
}
