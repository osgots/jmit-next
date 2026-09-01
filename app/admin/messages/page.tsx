import {
  ArrowLeft,
  Check,
  Mail,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  deleteMessage,
  markMessageRead,
} from "./actions";


export default async function AdminMessagesPage() {
  const {
    supabase,
  } =
    await requireManager();


  const {
    data,
  } =
    await supabase
      .from(
        "contact_messages",
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(
        500,
      );


  const messages =
    data ?? [];


  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 dark:bg-slate-950 sm:px-5 sm:py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-black text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft
            size={16}
          />

          Dashboard
        </Link>


        <div className="mt-6 flex items-center gap-3">

          <Mail
            size={28}
            className="text-blue-600"
          />

          <div>

            <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
              Communication
            </p>

            <h1 className="mt-1 text-4xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Messages
            </h1>
          </div>
        </div>


        <div className="mt-8 space-y-3">

          {messages.map(
            (
              item: any,
            ) => (
              <article
                key={
                  item.id
                }
                className={`rounded-[22px] border p-5 ${
                  item.is_read
                    ? "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    : "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
                }`}
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">

                  <div>

                    <p className="font-black text-slate-950 dark:text-white">
                      {item.subject ||
                        "Contact Message"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.name ||
                        "Visitor"}

                      {item.email &&
                        ` · ${item.email}`}
                    </p>
                  </div>


                  <p className="text-xs text-slate-400">
                    {item.created_at
                      ? new Date(
                          item.created_at,
                        ).toLocaleString()
                      : ""}
                  </p>
                </div>


                <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {item.message ||
                    item.body ||
                    item.content ||
                    "No message body."}
                </p>


                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">

                  {!item.is_read && (
                    <form
                      action={
                        markMessageRead
                      }
                    >

                      <input
                        type="hidden"
                        name="id"
                        value={
                          item.id
                        }
                      />

                      <button className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">

                        <Check
                          size={14}
                        />

                        Mark Read
                      </button>
                    </form>
                  )}


                  <form
                    action={
                      deleteMessage
                    }
                  >

                    <input
                      type="hidden"
                      name="id"
                      value={
                        item.id
                      }
                    />

                    <button className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 dark:bg-red-950/30 dark:text-red-300">

                      <Trash2
                        size={14}
                      />

                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ),
          )}


          {messages.length ===
            0 && (
            <div className="rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

              <Mail
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-950 dark:text-white">
                No messages yet
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
