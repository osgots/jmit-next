import {
  MessageCircle,
  Search,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";
import SocialNav from "@/components/social/social-nav";

import {
  startConversation,
} from "../actions";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";


export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    error?: string;
  }>;
}) {
  const params =
    await searchParams;


  const {
    supabase,
    user,
    profile,
    isAdmin,
  } =
    await requireSocialProfile();


  const {
    data:
      conversations,
  } =
    await supabase
      .from(
        "social_conversations",
      )
      .select("*")
      .or(
        `user_a.eq.${user.id},user_b.eq.${user.id}`,
      )
      .order(
        "last_message_at",
        {
          ascending:
            false,
          nullsFirst:
            false,
        },
      )
      .limit(
        100,
      );


  const otherIds =
    Array.from(
      new Set(
        (
          conversations ??
          []
        ).map(
          (
            conversation,
          ) =>
            conversation.user_a ===
            user.id
              ? conversation.user_b
              : conversation.user_a,
        ),
      ),
    );


  const {
    data:
      otherProfiles,
  } =
    otherIds.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url, account_type",
          )
          .in(
            "user_id",
            otherIds,
          )
      : {
          data: [],
        };


  const profileMap =
    new Map(
      (
        otherProfiles ??
        []
      ).map(
        (
          item,
        ) => [
          item.user_id,
          item,
        ],
      ),
    );


  const {
    data:
      roleRows,
  } =
    otherIds.length
      ? await supabase
          .from(
            "profiles",
          )
          .select(
            "id, role",
          )
          .in(
            "id",
            otherIds,
          )
      : {
          data: [],
        };


  const {
    data:
      blueRows,
  } =
    otherIds.length
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .in(
            "user_id",
            otherIds,
          )
      : {
          data: [],
        };


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


  const conversationIds =
    (
      conversations ??
      []
    ).map(
      (
        item,
      ) =>
        item.id,
    );


  const {
    data:
      messageRows,
  } =
    conversationIds.length
      ? await supabase
          .from(
            "social_messages",
          )
          .select(
            "id, conversation_id, sender_id, body, created_at, deleted_at, read_at",
          )
          .in(
            "conversation_id",
            conversationIds,
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            },
          )
          .limit(
            500,
          )
      : {
          data: [],
        };


  const latestMap =
    new Map<string, any>();

  const unreadMap =
    new Map<string, number>();


  for (
    const message
    of messageRows ??
    []
  ) {
    if (
      !latestMap.has(
        message.conversation_id,
      )
    ) {
      latestMap.set(
        message.conversation_id,
        message,
      );
    }


    if (
      message.sender_id !==
        user.id &&
      !message.read_at
    ) {
      unreadMap.set(
        message.conversation_id,
        (
          unreadMap.get(
            message.conversation_id,
          ) ?? 0
        ) + 1,
      );
    }
  }


  const query =
    params.q
      ?.trim()
      .toLowerCase() ??
    "";


  let searchResults:
    any[] = [];


  if (
    query.length >=
    1
  ) {
    const safe =
      query
        .replace(
          /[%_,]/g,
          "",
        )
        .slice(
          0,
          50,
        );


    const {
      data,
    } =
      await supabase
        .from(
          "social_profiles",
        )
        .select(
          "user_id, username, display_name, avatar_url, account_type",
        )
        .or(
          `username.ilike.%${safe}%,display_name.ilike.%${safe}%`,
        )
        .limit(
          25,
        );


    searchResults =
      (
        data ??
        []
      ).filter(
        (
          item,
        ) =>
          item.user_id !==
          user.id,
      );
  }


  const {
    count:
      unreadNotifications,
  } =
    await supabase
      .from(
        "social_notifications",
      )
      .select("*", {
        count:
          "exact",
        head:
          true,
      })
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "is_read",
        false,
      );


  const canPost =
    isAdmin ||
    profile.account_type ===
      "student";


  function badgeFor(
    person: any,
  ) {
    if (
      roleMap.get(
        person.user_id,
      ) ===
      "admin"
    ) {
      return "admin" as const;
    }


    if (
      blueSet.has(
        person.user_id,
      )
    ) {
      return "blue" as const;
    }


    if (
      person.account_type ===
      "student"
    ) {
      return "student" as const;
    }


    return null;
  }


  return (
    <main className="min-h-screen bg-[#f5f7fb] pb-24 dark:bg-slate-950">
      <SiteHeader />


      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-12">

        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Social Connect
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
            Chats
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Private conversations with other Social Connect users.
          </p>
        </div>


        {params.error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {
              params.error
            }
          </div>
        )}


        <form className="relative mt-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="q"
            defaultValue={
              query
            }
            placeholder="Search people to message..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-24 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#071f50] px-4 py-2 text-xs font-black text-white dark:bg-blue-600">
            Search
          </button>
        </form>


        {query && (
          <section className="mt-6">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
              New Conversation
            </p>

            <div className="space-y-2">

              {searchResults.map(
                (
                  person,
                ) => (
                  <form
                    key={
                      person.user_id
                    }
                    action={
                      startConversation
                    }
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <input
                      type="hidden"
                      name="target_user_id"
                      value={
                        person.user_id
                      }
                    />

                    {person.avatar_url ? (
                      <img
                        src={
                          person.avatar_url
                        }
                        alt=""
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {person.display_name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}


                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-black text-slate-950 dark:text-white">
                          {
                            person.display_name
                          }
                        </p>

                        {badgeFor(
                          person,
                        ) && (
                          <SocialBadge
                            kind={
                              badgeFor(
                                person,
                              )!
                            }
                            size={
                              17
                            }
                          />
                        )}
                      </div>

                      <p className="text-xs text-slate-500">
                        @
                        {
                          person.username
                        }
                      </p>
                    </div>


                    <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white">
                      Message
                    </button>
                  </form>
                ),
              )}
            </div>
          </section>
        )}


        <section className="mt-8">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">
            Messages
          </p>


          <div className="space-y-2">

            {(conversations ??
              []).map(
              (
                conversation,
              ) => {
                const otherId =
                  conversation.user_a ===
                  user.id
                    ? conversation.user_b
                    : conversation.user_a;


                const person =
                  profileMap.get(
                    otherId,
                  );


                if (!person) {
                  return null;
                }


                const latest =
                  latestMap.get(
                    conversation.id,
                  );


                const unread =
                  unreadMap.get(
                    conversation.id,
                  ) ?? 0;


                const badge =
                  badgeFor(
                    person,
                  );


                return (
                  <Link
                    key={
                      conversation.id
                    }
                    href={`/social-connect/chats/${conversation.id}`}
                    className="flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white p-4 transition hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    {person.avatar_url ? (
                      <img
                        src={
                          person.avatar_url
                        }
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {person.display_name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}


                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-black text-slate-950 dark:text-white">
                          {
                            person.display_name
                          }
                        </p>

                        {badge && (
                          <SocialBadge
                            kind={
                              badge
                            }
                            size={
                              17
                            }
                          />
                        )}
                      </div>


                      <p
                        className={`mt-1 truncate text-sm ${
                          unread
                            ? "font-bold text-slate-900 dark:text-white"
                            : "text-slate-500"
                        }`}
                      >
                        {latest
                          ? latest.deleted_at
                            ? "Message deleted"
                            : latest.sender_id ===
                                user.id
                              ? `You: ${latest.body}`
                              : latest.body
                          : "Start a conversation"}
                      </p>
                    </div>


                    {unread >
                      0 && (
                      <span className="flex min-h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-black text-white">
                        {unread >
                        99
                          ? "99+"
                          : unread}
                      </span>
                    )}
                  </Link>
                );
              },
            )}


            {(conversations ??
              []).length ===
              0 && (
              <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
                <MessageCircle
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-black text-slate-900 dark:text-white">
                  No chats yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Search for somebody above and start your first conversation.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>


      <SocialNav
        username={
          profile.username
        }
        canPost={
          canPost
        }
        unread={
          unreadNotifications ??
          0
        }
      />
    </main>
  );
}
