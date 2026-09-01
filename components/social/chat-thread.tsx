"use client";

import {
  Check,
  CheckCheck,
  Edit3,
  Loader2,
  Send,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  read_at: string | null;
};


export default function ChatThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
}) {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );


  const [
    messages,
    setMessages,
  ] =
    useState<ChatMessage[]>(
      initialMessages,
    );


  const [
    body,
    setBody,
  ] =
    useState("");


  const [
    busy,
    setBusy,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(
      null,
    );


  const [
    editBody,
    setEditBody,
  ] =
    useState("");


  const [
    otherTyping,
    setOtherTyping,
  ] =
    useState(false);


  const channelRef =
    useRef<ReturnType<
      typeof supabase.channel
    > | null>(
      null,
    );


  const typingStopRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(
      null,
    );


  const bottomRef =
    useRef<HTMLDivElement>(
      null,
    );


  const ordered =
    useMemo(
      () =>
        [...messages].sort(
          (
            a,
            b,
          ) =>
            new Date(
              a.created_at,
            ).getTime() -
            new Date(
              b.created_at,
            ).getTime(),
        ),
      [messages],
    );


  function upsertMessage(
    incoming:
      ChatMessage,
  ) {
    setMessages(
      (
        previous,
      ) => {
        const exists =
          previous.some(
            (
              message,
            ) =>
              message.id ===
              incoming.id,
          );


        if (exists) {
          return previous.map(
            (
              message,
            ) =>
              message.id ===
              incoming.id
                ? incoming
                : message,
          );
        }


        return [
          ...previous,
          incoming,
        ];
      },
    );
  }


  useEffect(() => {
    supabase.rpc(
      "social_mark_conversation_read",
      {
        p_conversation_id:
          conversationId,
      },
    );


    const channel =
      supabase
        .channel(
          `chat:${conversationId}`,
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

            filter:
              `conversation_id=eq.${conversationId}`,
          },
          (
            payload,
          ) => {
            if (
              payload.eventType ===
              "DELETE"
            ) {
              const deletedId =
                (
                  payload.old as {
                    id?: string;
                  }
                ).id;


              if (deletedId) {
                setMessages(
                  (
                    previous,
                  ) =>
                    previous.filter(
                      (
                        message,
                      ) =>
                        message.id !==
                        deletedId,
                    ),
                );
              }

              return;
            }


            const message =
              payload.new as ChatMessage;


            upsertMessage(
              message,
            );


            if (
              message.sender_id !==
              currentUserId
            ) {
              supabase.rpc(
                "social_mark_conversation_read",
                {
                  p_conversation_id:
                    conversationId,
                },
              );
            }
          },
        )
        .on(
          "broadcast",
          {
            event:
              "typing",
          },
          ({
            payload,
          }) => {
            const typedBy =
              String(
                (
                  payload as {
                    userId?: string;
                  }
                ).userId ??
                "",
              );


            if (
              typedBy ===
              currentUserId
            ) {
              return;
            }


            const typing =
              Boolean(
                (
                  payload as {
                    typing?: boolean;
                  }
                ).typing,
              );


            setOtherTyping(
              typing,
            );


            if (typing) {
              window.setTimeout(
                () =>
                  setOtherTyping(
                    false,
                  ),
                2500,
              );
            }
          },
        )
        .subscribe();


    channelRef.current =
      channel;


    return () => {

      if (
        typingStopRef.current
      ) {
        clearTimeout(
          typingStopRef.current,
        );
      }


      channelRef.current =
        null;


      supabase.removeChannel(
        channel,
      );
    };
  }, [
    conversationId,
    currentUserId,
    supabase,
  ]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior:
        "smooth",
    });
  }, [
    ordered.length,
  ]);


  function updateTyping(
    value: string,
  ) {
    setBody(
      value,
    );


    const typing =
      Boolean(
        value.trim(),
      );


    void channelRef.current?.send({
      type:
        "broadcast",

      event:
        "typing",

      payload: {
        userId:
          currentUserId,

        typing,
      },
    });


    if (
      typingStopRef.current
    ) {
      clearTimeout(
        typingStopRef.current,
      );
    }


    if (typing) {
      typingStopRef.current =
        setTimeout(
          () => {
            void channelRef.current?.send({
              type:
                "broadcast",

              event:
                "typing",

              payload: {
                userId:
                  currentUserId,

                typing:
                  false,
              },
            });
          },
          1400,
        );
    }
  }


  async function sendMessage(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();


    const text =
      body.trim();


    if (
      !text ||
      text.length >
        2000
    ) {
      return;
    }


    setBusy(
      true,
    );

    setError(
      "",
    );


    const {
      data,
      error:
        insertError,
    } =
      await supabase
        .from(
          "social_messages",
        )
        .insert({
          conversation_id:
            conversationId,

          sender_id:
            currentUserId,

          body:
            text,
        })
        .select("*")
        .single();


    if (
      insertError
    ) {
      setError(
        insertError.message,
      );

      setBusy(
        false,
      );

      return;
    }


    if (data) {
      upsertMessage(
        data as ChatMessage,
      );
    }


    setBody(
      "",
    );


    void channelRef.current?.send({
      type:
        "broadcast",

      event:
        "typing",

      payload: {
        userId:
          currentUserId,

        typing:
          false,
      },
    });


    setBusy(
      false,
    );
  }


  async function saveEdit(
    messageId:
      string,
  ) {
    const text =
      editBody.trim();


    if (
      !text ||
      text.length >
        2000
    ) {
      return;
    }


    const {
      data,
      error:
        updateError,
    } =
      await supabase
        .from(
          "social_messages",
        )
        .update({
          body:
            text,

          edited_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          messageId,
        )
        .eq(
          "sender_id",
          currentUserId,
        )
        .select("*")
        .single();


    if (
      updateError
    ) {
      setError(
        updateError.message,
      );

      return;
    }


    if (data) {
      upsertMessage(
        data as ChatMessage,
      );
    }


    setEditingId(
      null,
    );

    setEditBody(
      "",
    );
  }


  async function deleteMessage(
    messageId:
      string,
  ) {
    if (
      !window.confirm(
        "Delete this message?",
      )
    ) {
      return;
    }


    const {
      data,
      error:
        updateError,
    } =
      await supabase
        .from(
          "social_messages",
        )
        .update({
          deleted_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          messageId,
        )
        .eq(
          "sender_id",
          currentUserId,
        )
        .select("*")
        .single();


    if (
      updateError
    ) {
      setError(
        updateError.message,
      );

      return;
    }


    if (data) {
      upsertMessage(
        data as ChatMessage,
      );
    }
  }


  return (
    <div className="flex min-h-0 flex-1 flex-col">

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6">

        {ordered.map(
          (
            message,
          ) => {
            const mine =
              message.sender_id ===
              currentUserId;


            return (
              <div
                key={
                  message.id
                }
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`group max-w-[82%] sm:max-w-[70%] ${
                    mine
                      ? "items-end"
                      : "items-start"
                  }`}
                >

                  {message.deleted_at ? (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm italic ${
                        mine
                          ? "bg-blue-100 text-blue-500 dark:bg-blue-950 dark:text-blue-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                      }`}
                    >
                      Message deleted
                    </div>

                  ) : editingId ===
                    message.id ? (
                    <div className="flex min-w-[250px] gap-2">
                      <input
                        value={
                          editBody
                        }
                        onChange={(
                          event,
                        ) =>
                          setEditBody(
                            event.target.value,
                          )
                        }
                        maxLength={
                          2000
                        }
                        className="min-w-0 flex-1 rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none dark:bg-slate-950 dark:text-white"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          saveEdit(
                            message.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"
                      >
                        <Check
                          size={15}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingId(
                            null,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <X
                          size={15}
                        />
                      </button>
                    </div>

                  ) : (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        mine
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {
                          message.body
                        }
                      </p>
                    </div>
                  )}


                  <div
                    className={`mt-1 flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                      mine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <span>
                      {new Date(
                        message.created_at,
                      ).toLocaleTimeString(
                        [],
                        {
                          hour:
                            "2-digit",
                          minute:
                            "2-digit",
                        },
                      )}
                    </span>


                    {message.edited_at &&
                      !message.deleted_at && (
                        <span>
                          edited
                        </span>
                      )}


                    {mine &&
                      !message.deleted_at && (
                        message.read_at ? (
                          <CheckCheck
                            size={13}
                            className="text-blue-500"
                          />
                        ) : (
                          <Check
                            size={13}
                          />
                        )
                      )}


                    {mine &&
                      !message.deleted_at &&
                      editingId !==
                        message.id && (
                        <div className="ml-1 hidden items-center gap-1 group-hover:flex">

                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(
                                message.id,
                              );

                              setEditBody(
                                message.body,
                              );
                            }}
                            title="Edit"
                          >
                            <Edit3
                              size={12}
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              deleteMessage(
                                message.id,
                              )
                            }
                            title="Delete"
                            className="text-red-500"
                          >
                            <Trash2
                              size={12}
                            />
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          },
        )}


        <div
          ref={
            bottomRef
          }
        />
      </div>


      {otherTyping && (
        <div className="px-5 pb-2 text-xs font-semibold text-slate-400">
          typing
          <span className="ml-1 inline-flex gap-0.5">
            <span className="animate-pulse">
              .
            </span>
            <span className="animate-pulse [animation-delay:150ms]">
              .
            </span>
            <span className="animate-pulse [animation-delay:300ms]">
              .
            </span>
          </span>
        </div>
      )}


      {error && (
        <div className="mx-4 mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}


      <form
        onSubmit={
          sendMessage
        }
        className="sticky bottom-0 border-t border-slate-200 bg-white p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mx-auto flex max-w-4xl items-end gap-2">

          <textarea
            value={
              body
            }
            onChange={(
              event,
            ) =>
              updateTyping(
                event.target.value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                  "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                event.currentTarget
                  .form
                  ?.requestSubmit();
              }
            }}
            maxLength={
              2000
            }
            rows={1}
            placeholder="Message..."
            className="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <button
            disabled={
              busy ||
              !body.trim()
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white disabled:opacity-40"
          >
            {busy ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Send
                size={18}
              />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
