"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function PresenceHeartbeat() {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );


  useEffect(() => {
    let alive =
      true;


    async function touch() {
      if (!alive) {
        return;
      }

      await supabase.rpc(
        "social_touch_presence",
      );
    }


    touch();


    const interval =
      window.setInterval(
        touch,
        45_000,
      );


    function visible() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        touch();
      }
    }


    function focused() {
      touch();
    }


    document.addEventListener(
      "visibilitychange",
      visible,
    );

    window.addEventListener(
      "focus",
      focused,
    );


    return () => {
      alive =
        false;

      window.clearInterval(
        interval,
      );

      document.removeEventListener(
        "visibilitychange",
        visible,
      );

      window.removeEventListener(
        "focus",
        focused,
      );
    };
  }, [
    supabase,
  ]);


  return null;
}
