from pathlib import Path


path = Path(
    "components/social/chat-thread.tsx"
)

code = path.read_text(
    encoding="utf-8-sig"
)


# ============================================================
# STATE + REFS
# ============================================================

anchor = '''  const bottomRef =
    useRef<HTMLDivElement>(
      null,
    );'''


replacement = '''  const [
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
    );'''


if (
    "otherTyping" not in code
    and
    anchor in code
):
    code = code.replace(
        anchor,
        replacement,
        1,
    )


# ============================================================
# BROADCAST LISTENER
# ============================================================

anchor = '''          },
        )
        .subscribe();'''


replacement = '''          },
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
      channel;'''


if (
    '"broadcast"' not in code
    and
    anchor in code
):
    code = code.replace(
        anchor,
        replacement,
        1,
    )


# ============================================================
# CLEANUP
# ============================================================

anchor = '''    return () => {
      supabase.removeChannel(
        channel,
      );
    };'''


replacement = '''    return () => {

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
    };'''


if anchor in code:
    code = code.replace(
        anchor,
        replacement,
        1,
    )


# ============================================================
# SEND TYPING
# ============================================================

anchor = '''  async function sendMessage(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {'''


typing_function = '''  function updateTyping(
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


''' + anchor


if (
    "function updateTyping" not in code
    and
    anchor in code
):
    code = code.replace(
        anchor,
        typing_function,
        1,
    )


# ============================================================
# STOP TYPING WHEN MESSAGE SENDS
# ============================================================

anchor = '''    setBody(
      "",
    );

    setBusy(
      false,
    );'''


replacement = '''    setBody(
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
    );'''


if anchor in code:
    code = code.replace(
        anchor,
        replacement,
        1,
    )


# ============================================================
# TEXTAREA
# ============================================================

anchor = '''            onChange={(
              event,
            ) =>
              setBody(
                event.target.value,
              )
            }'''


replacement = '''            onChange={(
              event,
            ) =>
              updateTyping(
                event.target.value,
              )
            }'''


if anchor in code:
    code = code.replace(
        anchor,
        replacement,
        1,
    )


# ============================================================
# TYPING INDICATOR UI
# ============================================================

anchor = '''      {error && ('''


replacement = '''      {otherTyping && (
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


      {error && ('''


if (
    "typing\n" not in code
    and
    anchor in code
):
    code = code.replace(
        anchor,
        replacement,
        1,
    )


path.write_text(
    code,
    encoding="utf-8",
    newline="\n",
)


print(
    "✓ Realtime chat typing indicator added."
)
