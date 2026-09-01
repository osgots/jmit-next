import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  BadgeCheck,
  Mail,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";

import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../actions";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";


export default async function NotificationsPage() {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();


  const {
    data:
      notifications,
  } =
    await supabase
      .from(
        "social_notifications",
      )
      .select("*")
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(100);


  const actors =
    Array.from(
      new Set(
        (
          notifications ??
          []
        )
          .map(
            (
              item,
            ) =>
              item.actor_id,
          )
          .filter(
            Boolean,
          ),
      ),
    ) as string[];


  const {
    data:
      actorProfiles,
  } =
    actors.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url, account_type",
          )
          .in(
            "user_id",
            actors,
          )
      : {
          data: [],
        };


  const {
    data:
      blueRows,
  } =
    actors.length
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .in(
            "user_id",
            actors,
          )
      : {
          data: [],
        };


  /*
   * Admin badge comes from authoritative
   * application profiles.role.
   */
  const {
    data:
      roleRows,
  } =
    actors.length
      ? await supabase
          .from(
            "profiles",
          )
          .select(
            "id, role",
          )
          .in(
            "id",
            actors,
          )
      : {
          data: [],
        };


  const actorMap =
    new Map(
      (
        actorProfiles ??
        []
      ).map(
        (
          profile,
        ) => [
          profile.user_id,
          profile,
        ],
      ),
    );


  const blueSet =
    new Set(
      (
        blueRows ??
        []
      ).map(
        (
          row,
        ) =>
          row.user_id,
      ),
    );


  const roleMap =
    new Map(
      (
        roleRows ??
        []
      ).map(
        (
          row,
        ) => [
          row.id,
          row.role,
        ],
      ),
    );


  const unread =
    (
      notifications ??
      []
    ).filter(
      (
        item,
      ) =>
        !item.is_read,
    ).length;


  function icon(
    type: string,
  ) {
    switch (type) {
      case "like":
        return (
          <Heart
            size={18}
          />
        );

      case "comment":
        return (
          <MessageCircle
            size={18}
          />
        );

      case "follow":
        return (
          <UserPlus
            size={18}
          />
        );

      case "mention":
        return (
          <AtSign
            size={18}
          />
        );

      case "verification":
        return (
          <BadgeCheck
            size={18}
          />
        );

      case "message":
        return (
          <Mail
            size={18}
          />
        );

      default:
        return (
          <Bell
            size={18}
          />
        );
    }
  }


  function destination(
    item: any,
    actor: any,
  ) {
    if (
      [
        "like",
        "comment",
        "mention",
      ].includes(
        item.notification_type,
      ) &&
      item.entity_id
    ) {
      return `/social-connect/post/${item.entity_id}`;
    }

    if (
      item.notification_type ===
        "follow" &&
      actor?.username
    ) {
      return `/social-connect/u/${actor.username}`;
    }

    if (
      item.notification_type ===
      "verification"
    ) {
      return "/social-connect/verification";
    }

    if (
      item.notification_type ===
      "message"
    ) {
      return "/social-connect/chats";
    }

    return "/social-connect";
  }


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-5 sm:py-12">

        <div className="flex items-end justify-between gap-4">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              Social Connect
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {unread
                ? `${unread} unread notification${unread === 1 ? "" : "s"}`
                : "You're all caught up."}
            </p>
          </div>


          {unread >
            0 && (
            <form
              action={
                markAllNotificationsRead
              }
            >
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <CheckCheck
                  size={15}
                />

                Mark all read
              </button>
            </form>
          )}
        </div>


        <div className="mt-7 space-y-2">

          {(
            notifications ??
            []
          ).map(
            (
              item,
            ) => {
              const actor =
                item.actor_id
                  ? actorMap.get(
                      item.actor_id,
                    )
                  : null;


              const badge =
                !actor
                  ? null
                  : roleMap.get(
                      actor.user_id,
                    ) ===
                    "admin"
                    ? "admin"
                    : blueSet.has(
                          actor.user_id,
                        )
                      ? "blue"
                      : actor.account_type ===
                          "student"
                        ? "student"
                        : null;


              return (
                <form
                  key={
                    item.id
                  }
                  action={
                    markNotificationRead
                  }
                >
                  <input
                    type="hidden"
                    name="id"
                    value={
                      item.id
                    }
                  />

                  <Link
                    href={
                      destination(
                        item,
                        actor,
                      )
                    }
                    className={`flex items-center gap-4 rounded-[20px] border p-4 transition hover:bg-blue-50 dark:hover:bg-slate-800 ${
                      item.is_read
                        ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                        : "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/30"
                    }`}
                  >

                    {actor?.avatar_url ? (
                      <img
                        src={
                          actor.avatar_url
                        }
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
                        {icon(
                          item.notification_type,
                        )}
                      </div>
                    )}


                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                          {actor?.display_name ??
                            "JMIT Next"}
                        </p>

                        {badge && (
                          <SocialBadge
                            kind={
                              badge
                            }
                            size={
                              16
                            }
                          />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {item.message ??
                          item.notification_type}
                      </p>

                      <p className="mt-1 text-[11px] font-semibold text-slate-400">
                        {new Date(
                          item.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>


                    {!item.is_read && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </Link>
                </form>
              );
            },
          )}


          {(notifications ??
            []).length ===
            0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <Bell
                size={34}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-black text-slate-900 dark:text-white">
                No notifications yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Likes, comments, follows, mentions and messages will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
