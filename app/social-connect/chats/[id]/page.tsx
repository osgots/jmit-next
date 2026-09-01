import {
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import ChatThread from "@/components/social/chat-thread";
import SiteHeader from "@/components/site-header";
import SocialBadge from "@/components/social/social-badge";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";


export default async function ConversationPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const {
    id,
  } =
    await params;


  const {
    supabase,
    user,
  } =
    await requireSocialProfile();


  const {
    data:
      conversation,
  } =
    await supabase
      .from(
        "social_conversations",
      )
      .select("*")
      .eq(
        "id",
        id,
      )
      .maybeSingle();


  if (
    !conversation ||
    (
      conversation.user_a !==
        user.id &&
      conversation.user_b !==
        user.id
    )
  ) {
    notFound();
  }


  const otherId =
    conversation.user_a ===
    user.id
      ? conversation.user_b
      : conversation.user_a;


  const {
    data:
      otherProfile,
  } =
    await supabase
      .from(
        "social_profiles",
      )
      .select(
        "user_id, username, display_name, avatar_url, account_type",
      )
      .eq(
        "user_id",
        otherId,
      )
      .maybeSingle();


  if (!otherProfile) {
    notFound();
  }


  const {
    data:
      appProfile,
  } =
    await supabase
      .from(
        "profiles",
      )
      .select(
        "role",
      )
      .eq(
        "id",
        otherId,
      )
      .maybeSingle();


  const isAdmin =
    appProfile?.role ===
    "admin";


  const {
    data: blue,
  } =
    !isAdmin
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "user_id",
          )
          .eq(
            "user_id",
            otherId,
          )
          .maybeSingle()
      : {
          data:
            null,
        };


  const badge =
    isAdmin
      ? "admin"
      : blue
        ? "blue"
        : otherProfile.account_type ===
            "student"
          ? "student"
          : null;


  await supabase.rpc(
    "social_mark_conversation_read",
    {
      p_conversation_id:
        id,
    },
  );


  const {
    data:
      messages,
  } =
    await supabase
      .from(
        "social_messages",
      )
      .select(
        "id, conversation_id, sender_id, body, created_at, edited_at, deleted_at, read_at",
      )
      .eq(
        "conversation_id",
        id,
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        },
      )
      .limit(
        500,
      );


  return (
    <main className="flex min-h-screen flex-col bg-[#f5f7fb] dark:bg-slate-950">
      <SiteHeader />


      <div className="mx-auto flex h-[calc(100vh-118px)] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-sm md:my-5 md:h-[calc(100vh-158px)] md:rounded-[28px] md:border md:border-slate-200 dark:bg-slate-900 md:dark:border-slate-800">

        <header className="flex h-18 shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">

          <Link
            replace
            href="/social-connect/chats"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft
              size={19}
            />
          </Link>


          <Link
            replace
            href={`/social-connect/u/${otherProfile.username}`}
            className="flex min-w-0 items-center gap-3"
          >

            {otherProfile.avatar_url ? (
              <img
                src={
                  otherProfile.avatar_url
                }
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {otherProfile.display_name
                  .slice(
                    0,
                    1,
                  )
                  .toUpperCase()}
              </div>
            )}


            <div className="min-w-0">

              <div className="flex items-center gap-1.5">
                <p className="truncate font-black text-slate-950 dark:text-white">
                  {
                    otherProfile.display_name
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

              <p className="truncate text-xs text-slate-500">
                @
                {
                  otherProfile.username
                }
              </p>
            </div>
          </Link>
        </header>


        <ChatThread
          conversationId={
            id
          }
          currentUserId={
            user.id
          }
          initialMessages={
            messages ??
            []
          }
        />
      </div>
    </main>
  );
}
