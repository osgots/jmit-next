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
    100_000
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
      age /
      60_000,
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
      minutes /
      60,
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
      hours /
      24,
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


  /*
   * This state just re-renders the label.
   * It makes "1m ago" become "2m ago"
   * WITHOUT making an API request.
   */
  const [
    tick,
    setTick,
  ] =
    useState(0);


  useEffect(() => {

    let alive =
      true;


    async function initialLoad() {

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


    initialLoad();


    const channel =
      supabase
        .channel(
          `presence-${userId}`,
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_presence",

            filter:
              `user_id=eq.${userId}`,
          },
          (
            payload,
          ) => {

            if (
              payload.eventType ===
              "DELETE"
            ) {

              setLastSeen(
                null,
              );

              return;
            }


            const row =
              payload.new as {
                last_seen_at?:
                  string;
              };


            if (
              row.last_seen_at
            ) {

              setLastSeen(
                row.last_seen_at,
              );
            }
          },
        )
        .subscribe();


    /*
     * Local timer only.
     * ZERO Supabase requests.
     */
    const timer =
      window.setInterval(
        () => {

          setTick(
            (
              value,
            ) =>
              value + 1,
          );

        },
        30_000,
      );


    return () => {

      alive =
        false;


      window.clearInterval(
        timer,
      );


      supabase.removeChannel(
        channel,
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


  /*
   * Prevent TS/lint from treating tick as unused.
   */
  void tick;


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
