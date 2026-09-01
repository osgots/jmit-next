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


export default function SocialNav({
  username,
  canPost = false,
  unread = 0,
}: {
  username?: string | null;
  canPost?: boolean;
  unread?: number;
}) {
  const item =
    "relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300";


  return (
    <>
      {/* MOBILE */}

      <nav className="fixed bottom-0 left-0 right-0 z-[65] border-t border-slate-200 bg-white/95 px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">

        <div className="mx-auto flex max-w-lg items-center justify-around">

          <Link
            replace
            href="/social-connect"
            className={item}
            title="Feed"
          >
            <Home
              size={21}
            />
          </Link>


          <Link
            replace
            href="/social-connect/search"
            className={item}
            title="Search"
          >
            <Search
              size={21}
            />
          </Link>


          {canPost ? (
            /*
             * Create is a task/modal-like route,
             * so it intentionally PUSHES.
             */
            <Link
              href="/social-connect/new"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"
              title="Create"
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
              title="Saved"
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
            title="Chats"
          >
            <MessageCircle
              size={21}
            />
          </Link>


          <Link
            replace
            href="/social-connect/notifications"
            className={item}
            title="Notifications"
          >
            <Bell
              size={21}
            />

            {unread >
              0 && (
              <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-center text-[8px] font-black leading-4 text-white">
                {unread >
                99
                  ? "99+"
                  : unread}
              </span>
            )}
          </Link>


          <Link
            replace
            href={
              username
                ? `/social-connect/u/${username}`
                : "/social-connect/onboarding"
            }
            className={item}
            title="Profile"
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

          {unread >
            0 && (
            <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-center text-[8px] font-black leading-4 text-white">
              {unread >
              99
                ? "99+"
                : unread}
            </span>
          )}
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
