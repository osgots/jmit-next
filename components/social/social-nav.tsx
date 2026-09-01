"use client";

import {
  Bell,
  Bookmark,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  UserRound,
} from "lucide-react";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function SocialNav({
  username,
  canPost = false,
  userId,
  unread = 0,
  unreadChats = 0,
}: {
  username?: string | null;
  canPost?: boolean;
  userId?: string | null;

  /*
   * Kept for compatibility with older pages.
   */
  unread?: number;
  unreadChats?: number;
}) {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    notificationCount,
    setNotificationCount,
  ] =
    useState(
      unread,
    );

  const [
    chatCount,
    setChatCount,
  ] =
    useState(
      unreadChats,
    );


  useEffect(() => {
    let alive =
      true;


    async function refresh() {
      const {
        data,
      } =
        await supabase.rpc(
          "social_nav_counts",
        );


      if (!alive) {
        return;
      }


      const row =
        Array.isArray(
          data,
        )
          ? data[0]
          : data;


      setNotificationCount(
        Number(
          row?.unread_notifications ??
          0,
        ),
      );


      setChatCount(
        Number(
          row?.unread_chats ??
          0,
        ),
      );
    }


    refresh();


    const interval =
      window.setInterval(
        refresh,
        60_000,
      );


    const channel =
      supabase
        .channel(
          `social-nav-${userId ?? "current"}`,
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_notifications",

            ...(userId
              ? {
                  filter:
                    `user_id=eq.${userId}`,
                }
              : {}),
          },
          refresh,
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "social_messages",
          },
          refresh,
        )
        .subscribe();


    function visible() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refresh();
      }
    }


    document.addEventListener(
      "visibilitychange",
      visible,
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

      supabase.removeChannel(
        channel,
      );
    };
  }, [
    supabase,
    userId,
  ]);


  const item =
    "relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300";


  function Count({
    value,
  }: {
    value: number;
  }) {
    if (
      value <=
      0
    ) {
      return null;
    }


    return (
      <span className="absolute right-0 top-0 min-w-4 rounded-full bg-red-500 px-1 text-center text-[8px] font-black leading-4 text-white shadow">
        {value >
        99
          ? "99+"
          : value}
      </span>
    );
  }


  return (
    <>
      {/* MOBILE */}

      <nav className="fixed bottom-0 left-0 right-0 z-[65] border-t border-slate-200 bg-white/95 px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">

        <div className="mx-auto flex max-w-lg items-center justify-around">

          <Link
            replace
            href="/social-connect"
            className={item}
            aria-label="Social feed"
          >
            <Home
              size={21}
            />
          </Link>


          <Link
            replace
            href="/social-connect/search"
            className={item}
            aria-label="Search"
          >
            <Search
              size={21}
            />
          </Link>


          {canPost ? (
            <Link
              href="/social-connect/new"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md"
              aria-label="Create post"
            >
              <PlusSquare
                size={21}
              />
            </Link>
          ) : (
            <Link
              replace
              href="/social-connect/saved"
              className={item}
              aria-label="Saved posts"
            >
              <Bookmark
                size={21}
              />
            </Link>
          )}


          <Link
            replace
            href="/social-connect/chats"
            className={item}
            aria-label="Chats"
          >
            <MessageCircle
              size={21}
            />

            <Count
              value={
                chatCount
              }
            />
          </Link>


          <Link
            replace
            href="/social-connect/notifications"
            className={item}
            aria-label="Notifications"
          >
            <Bell
              size={21}
            />

            <Count
              value={
                notificationCount
              }
            />
          </Link>


          <Link
            replace
            href={
              username
                ? `/social-connect/u/${username}`
                : "/social-connect/onboarding"
            }
            className={item}
            aria-label="Profile"
          >
            <UserRound
              size={21}
            />
          </Link>
        </div>
      </nav>


      {/* DESKTOP */}

      <nav className="fixed left-1/2 top-[118px] z-[55] hidden -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl md:flex dark:border-slate-800 dark:bg-slate-900/95">

        <Link
          replace
          href="/social-connect"
          className={item}
          title="Feed"
        >
          <Home
            size={18}
          />
        </Link>


        <Link
          replace
          href="/social-connect/search"
          className={item}
          title="Search"
        >
          <Search
            size={18}
          />
        </Link>


        {canPost && (
          <Link
            href="/social-connect/new"
            className={item}
            title="Create"
          >
            <PlusSquare
              size={18}
            />
          </Link>
        )}


        <Link
          replace
          href="/social-connect/chats"
          className={item}
          title="Chats"
        >
          <MessageCircle
            size={18}
          />

          <Count
            value={
              chatCount
            }
          />
        </Link>


        <Link
          replace
          href="/social-connect/notifications"
          className={item}
          title="Notifications"
        >
          <Bell
            size={18}
          />

          <Count
            value={
              notificationCount
            }
          />
        </Link>


        <Link
          replace
          href="/social-connect/saved"
          className={item}
          title="Saved"
        >
          <Bookmark
            size={18}
          />
        </Link>


        {username && (
          <Link
            replace
            href={`/social-connect/u/${username}`}
            className={item}
            title="Profile"
          >
            <UserRound
              size={18}
            />
          </Link>
        )}
      </nav>
    </>
  );
}
