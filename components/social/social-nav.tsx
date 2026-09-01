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
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[65] border-t border-slate-200 bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-lg items-center justify-around">

          <Link
            href="/social-connect"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
          >
            <Home
              size={22}
            />
          </Link>

          <Link
            href="/social-connect/search"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
          >
            <Search
              size={22}
            />
          </Link>


          {canPost ? (
            <Link
              href="/social-connect/new"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"
            >
              <PlusSquare
                size={22}
              />
            </Link>
          ) : (
            <Link
              href="/social-connect/saved"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
            >
              <Bookmark
                size={22}
              />
            </Link>
          )}


          <Link
            href="/social-connect/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
          >
            <Bell
              size={22}
            />

            {unread >
              0 && (
              <span className="absolute right-1 top-1 min-w-4 rounded-full bg-red-500 px-1 text-center text-[9px] font-black leading-4 text-white">
                {unread >
                99
                  ? "99+"
                  : unread}
              </span>
            )}
          </Link>


          <Link
            href={
              username
                ? `/social-connect/u/${username}`
                : "/social-connect/onboarding"
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 dark:text-slate-200"
          >
            <UserRound
              size={22}
            />
          </Link>
        </div>
      </nav>


      <nav className="fixed left-1/2 top-[118px] z-[55] hidden -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-xl md:flex dark:border-slate-800 dark:bg-slate-900/95">

        <Link
          href="/social-connect"
          title="Feed"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Home
            size={18}
          />
        </Link>

        <Link
          href="/social-connect/search"
          title="Search"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Search
            size={18}
          />
        </Link>

        {canPost && (
          <Link
            href="/social-connect/new"
            title="Create"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <PlusSquare
              size={18}
            />
          </Link>
        )}

        <Link
          href="/social-connect/notifications"
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
          href="/social-connect/saved"
          title="Saved"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bookmark
            size={18}
          />
        </Link>

        <span
          title="Chats coming in next patch"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 dark:text-slate-700"
        >
          <MessageCircle
            size={18}
          />
        </span>

        {username && (
          <Link
            href={`/social-connect/u/${username}`}
            title="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
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
