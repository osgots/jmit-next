"use client";

import {
  CheckCircle2,
  Flag,
  Loader2,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type TargetType =
  | "user"
  | "post"
  | "comment"
  | "message";


const reasons = [
  {
    value:
      "spam",

    label:
      "Spam",
  },
  {
    value:
      "harassment",

    label:
      "Harassment or bullying",
  },
  {
    value:
      "impersonation",

    label:
      "Impersonation",
  },
  {
    value:
      "inappropriate",

    label:
      "Inappropriate content",
  },
  {
    value:
      "misinformation",

    label:
      "Misinformation",
  },
  {
    value:
      "privacy",

    label:
      "Privacy concern",
  },
  {
    value:
      "other",

    label:
      "Other",
  },
];


export default function ReportDialog({
  targetType,
  targetId,
  label = "Report",
  buttonClassName = "",
}: {
  targetType: TargetType;
  targetId: string;
  label?: string;
  buttonClassName?: string;
}) {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    reason,
    setReason,
  ] =
    useState(
      "spam",
    );

  const [
    details,
    setDetails,
  ] =
    useState("");

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState(false);


  async function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(
      true,
    );

    setMessage(
      "",
    );


    const supabase =
      createClient();


    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();


    if (!user) {
      setMessage(
        "Please log in first.",
      );

      setBusy(
        false,
      );

      return;
    }


    const {
      error,
    } =
      await supabase
        .from(
          "social_moderation_reports",
        )
        .insert({
          reporter_id:
            user.id,

          target_type:
            targetType,

          target_id:
            targetId,

          reason,

          details:
            details.trim() ||
            null,
        });


    if (error) {
      if (
        error.code ===
        "23505"
      ) {
        setMessage(
          "You already have a pending report for this item.",
        );
      } else {
        setMessage(
          error.message,
        );
      }

      setBusy(
        false,
      );

      return;
    }


    setSuccess(
      true,
    );

    setMessage(
      "Report submitted for review.",
    );

    setBusy(
      false,
    );
  }


  function close() {
    setOpen(
      false,
    );

    setSuccess(
      false,
    );

    setMessage(
      "",
    );

    setDetails(
      "",
    );
  }


  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(
            true,
          )
        }
        className={
          buttonClassName
        }
      >
        <Flag
          size={15}
        />

        {label}
      </button>


      {open && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={
            close
          }
        >
          <div
            className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">
                  Report
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reports are reviewed by JMIT Next moderators.
                </p>
              </div>


              <button
                type="button"
                onClick={
                  close
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X
                  size={18}
                />
              </button>
            </div>


            {success ? (
              <div className="py-10 text-center">

                <CheckCircle2
                  size={42}
                  className="mx-auto text-emerald-500"
                />

                <p className="mt-4 font-black text-slate-950 dark:text-white">
                  Report received
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {
                    message
                  }
                </p>


                <button
                  type="button"
                  onClick={
                    close
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white"
                >
                  Done
                </button>
              </div>

            ) : (
              <form
                onSubmit={
                  submit
                }
                className="mt-6 space-y-4"
              >

                <select
                  value={
                    reason
                  }
                  onChange={(
                    event,
                  ) =>
                    setReason(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {reasons.map(
                    (
                      item,
                    ) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {
                          item.label
                        }
                      </option>
                    ),
                  )}
                </select>


                <textarea
                  value={
                    details
                  }
                  onChange={(
                    event,
                  ) =>
                    setDetails(
                      event.target.value,
                    )
                  }
                  maxLength={
                    1000
                  }
                  rows={4}
                  placeholder="Optional details..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />


                {message && (
                  <p className="text-sm font-semibold text-red-600">
                    {
                      message
                    }
                  </p>
                )}


                <button
                  disabled={
                    busy
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-black text-white disabled:opacity-50"
                >
                  {busy && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
