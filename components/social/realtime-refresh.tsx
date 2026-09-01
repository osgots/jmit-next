"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


export function PostRealtimeRefresh({
  postId,
}: {
  postId: string;
}) {
  const router =
    useRouter();

  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const timer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);


  useEffect(() => {

    function refreshSoon() {

      if (
        timer.current
      ) {
        clearTimeout(
          timer.current,
        );
      }


      /*
       * Small debounce prevents several DB events
       * from causing several React refreshes.
       */
      timer.current =
        setTimeout(
          () => {
            router.refresh();
          },
          120,
        );
    }


    const channel =
      supabase
        .channel(
          `post-live-${postId}`,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_comments",

            filter:
              `post_id=eq.${postId}`,
          },
          refreshSoon,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_likes",

            filter:
              `post_id=eq.${postId}`,
          },
          refreshSoon,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_posts",

            filter:
              `id=eq.${postId}`,
          },
          refreshSoon,
        )

        .subscribe();


    return () => {

      if (
        timer.current
      ) {
        clearTimeout(
          timer.current,
        );
      }


      supabase.removeChannel(
        channel,
      );
    };

  }, [
    postId,
    router,
    supabase,
  ]);


  return null;
}


export function ProfileRealtimeRefresh({
  userId,
}: {
  userId: string;
}) {
  const router =
    useRouter();

  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const timer =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);


  useEffect(() => {

    function refreshSoon() {

      if (
        timer.current
      ) {
        clearTimeout(
          timer.current,
        );
      }


      timer.current =
        setTimeout(
          () => {
            router.refresh();
          },
          150,
        );
    }


    const channel =
      supabase
        .channel(
          `profile-live-${userId}`,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_posts",

            filter:
              `user_id=eq.${userId}`,
          },
          refreshSoon,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_follows",

            filter:
              `following_id=eq.${userId}`,
          },
          refreshSoon,
        )

        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_follows",

            filter:
              `follower_id=eq.${userId}`,
          },
          refreshSoon,
        )

        .subscribe();


    return () => {

      if (
        timer.current
      ) {
        clearTimeout(
          timer.current,
        );
      }


      supabase.removeChannel(
        channel,
      );
    };

  }, [
    router,
    supabase,
    userId,
  ]);


  return null;
}
