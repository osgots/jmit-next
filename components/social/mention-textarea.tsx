"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type Suggestion = {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
};


export default function MentionTextarea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 3,
  className = "",
  name,
  required = false,
  onKeyDown,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
  name?: string;
  required?: boolean;
  onKeyDown?: (
    event:
      React.KeyboardEvent<HTMLTextAreaElement>,
  ) => void;
}) {
  const supabaseRef =
    useRef(
      createClient() as any,
    );


  const textareaRef =
    useRef<HTMLTextAreaElement>(
      null,
    );


  const [
    suggestions,
    setSuggestions,
  ] =
    useState<Suggestion[]>(
      [],
    );


  const [
    query,
    setQuery,
  ] =
    useState<string | null>(
      null,
    );


  const [
    mentionStart,
    setMentionStart,
  ] =
    useState<number | null>(
      null,
    );


  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(0);


  function inspectMention(
    text: string,
    caret: number,
  ) {
    const before =
      text.slice(
        0,
        caret,
      );


    const match =
      before.match(
        /(?:^|\s)@([a-z0-9._]{0,30})$/i,
      );


    if (!match) {
      setQuery(
        null,
      );

      setSuggestions(
        [],
      );

      setMentionStart(
        null,
      );

      return;
    }


    const username =
      match[1];


    const start =
      before.lastIndexOf(
        `@${username}`,
      );


    setMentionStart(
      start,
    );


    setQuery(
      username,
    );
  }


  useEffect(() => {

    if (
      query === null ||
      query.length < 1
    ) {
      setSuggestions(
        [],
      );

      return;
    }


    const timer =
      window.setTimeout(
        async () => {

          const {
            data,
          } =
            await supabaseRef.current
              .from(
                "social_profiles",
              )
              .select(
                "user_id, username, display_name, avatar_url",
              )
              .ilike(
                "username",
                `${query}%`,
              )
              .order(
                "username",
              )
              .limit(
                6,
              );


          setSuggestions(
            (
              data ??
              []
            ) as Suggestion[],
          );


          setActiveIndex(
            0,
          );

        },
        120,
      );


    return () =>
      window.clearTimeout(
        timer,
      );

  }, [
    query,
  ]);


  function insertMention(
    username: string,
  ) {

    if (
      mentionStart === null
    ) {
      return;
    }


    const textarea =
      textareaRef.current;


    const caret =
      textarea?.selectionStart ??
      value.length;


    const next =
      value.slice(
        0,
        mentionStart,
      ) +
      `@${username} ` +
      value.slice(
        caret,
      );


    const newCaret =
      mentionStart +
      username.length +
      2;


    onChange(
      next,
    );


    setQuery(
      null,
    );


    setSuggestions(
      [],
    );


    setMentionStart(
      null,
    );


    window.setTimeout(
      () => {

        textareaRef.current?.focus();


        textareaRef.current?.setSelectionRange(
          newCaret,
          newCaret,
        );

      },
      0,
    );
  }


  return (
    <div className="relative">

      <textarea
        ref={
          textareaRef
        }
        name={
          name
        }
        required={
          required
        }
        value={
          value
        }
        rows={
          rows
        }
        maxLength={
          maxLength
        }
        placeholder={
          placeholder
        }
        className={
          className
        }
        onChange={(
          event,
        ) => {

          const next =
            event.target.value;


          onChange(
            next,
          );


          inspectMention(
            next,
            event.target.selectionStart,
          );

        }}
        onClick={(
          event,
        ) => {

          inspectMention(
            value,
            event.currentTarget.selectionStart,
          );

        }}
        onKeyDown={(
          event,
        ) => {

          if (
            suggestions.length
          ) {

            if (
              event.key ===
              "ArrowDown"
            ) {
              event.preventDefault();

              setActiveIndex(
                (
                  current,
                ) =>
                  (
                    current +
                    1
                  ) %
                  suggestions.length,
              );

              return;
            }


            if (
              event.key ===
              "ArrowUp"
            ) {
              event.preventDefault();

              setActiveIndex(
                (
                  current,
                ) =>
                  (
                    current -
                    1 +
                    suggestions.length
                  ) %
                  suggestions.length,
              );

              return;
            }


            if (
              event.key ===
                "Enter" ||
              event.key ===
                "Tab"
            ) {
              event.preventDefault();

              insertMention(
                suggestions[
                  activeIndex
                ].username,
              );

              return;
            }


            if (
              event.key ===
              "Escape"
            ) {
              setSuggestions(
                [],
              );

              setQuery(
                null,
              );

              return;
            }

          }


          onKeyDown?.(
            event,
          );

        }}
      />


      {suggestions.length >
        0 && (
        <div className="absolute bottom-full left-0 z-50 mb-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

          {suggestions.map(
            (
              user,
              index,
            ) => (
              <button
                key={
                  user.user_id
                }
                type="button"
                onMouseDown={(
                  event,
                ) =>
                  event.preventDefault()
                }
                onClick={() =>
                  insertMention(
                    user.username,
                  )
                }
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left ${
                  index ===
                    activeIndex
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >

                {user.avatar_url ? (
                  <img
                    src={
                      user.avatar_url
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                    {
                      user.display_name
                        ?.charAt(
                          0,
                        )
                        .toUpperCase() ??
                      "U"
                    }
                  </div>
                )}


                <div className="min-w-0">

                  <p className="truncate text-sm font-black text-slate-950 dark:text-white">
                    {
                      user.display_name
                    }
                  </p>


                  <p className="truncate text-xs text-slate-500">
                    @
                    {
                      user.username
                    }
                  </p>

                </div>

              </button>
            ),
          )}

        </div>
      )}

    </div>
  );
}
