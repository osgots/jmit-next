import {
  ArrowLeft,
  BookOpen,
  Building2,
  CalendarDays,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  deleteManagedContent,
  saveManagedContent,
} from "../actions";


const configs = {
  events: {
    label:
      "Events",

    singular:
      "Event",

    icon:
      CalendarDays,
  },

  departments: {
    label:
      "Departments",

    singular:
      "Department",

    icon:
      Building2,
  },

  programs: {
    label:
      "Programs",

    singular:
      "Program",

    icon:
      BookOpen,
  },
} as const;


export default async function AdminContentManagerPage({
  params,
  searchParams,
}: {
  params: Promise<{
    kind: string;
  }>;

  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
}) {
  const {
    kind,
  } =
    await params;


  const query =
    await searchParams;


  if (
    !(
      kind in
      configs
    )
  ) {
    notFound();
  }


  const typedKind =
    kind as keyof typeof configs;


  const config =
    configs[
      typedKind
    ];


  const Icon =
    config.icon;


  const {
    supabase,
  } =
    await requireManager();


  const {
    data,
  } =
    await supabase
      .from(
        typedKind,
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      );


  const items =
    data ?? [];


  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 dark:bg-slate-950 sm:px-5 sm:py-10">

      <div className="mx-auto max-w-6xl">

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

          <Icon
            size={29}
            className="text-blue-600"
          />

          <div>

            <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
              Content Manager
            </p>

            <h1 className="mt-1 text-4xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              {
                config.label
              }
            </h1>
          </div>
        </div>


        {query.status ===
          "saved" && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            Saved successfully.
          </div>
        )}


        {query.error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            Unable to save this item.
          </div>
        )}


        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Plus
                size={18}
              />
            </div>

            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              Create{" "}
              {
                config.singular
              }
            </h2>
          </div>


          <ManagedForm
            kind={
              typedKind
            }
          />
        </section>


        <section className="mt-7">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-black text-[#071a3d] dark:text-white">
              All{" "}
              {
                config.label
              }
            </h2>

            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {
                items.length
              }{" "}
              total
            </span>
          </div>


          <div className="space-y-3">

            {items.map(
              (
                item: any,
              ) => (
                <details
                  key={
                    item.id
                  }
                  className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >

                  <summary className="cursor-pointer list-none">

                    <div className="flex items-center justify-between gap-4">

                      <div className="min-w-0">

                        <p className="truncate font-black text-slate-950 dark:text-white">

                          {typedKind ===
                          "events"
                            ? item.title
                            : item.name}

                        </p>

                        <p className="mt-1 text-xs text-slate-500">

                          {typedKind ===
                          "events"
                            ? item.is_published
                              ? "Published"
                              : "Draft"
                            : item.is_active
                              ? "Active"
                              : "Hidden"}

                        </p>
                      </div>


                      <span className="text-xs font-black text-blue-600">
                        Edit
                      </span>
                    </div>
                  </summary>


                  <ManagedForm
                    kind={
                      typedKind
                    }
                    item={
                      item
                    }
                  />


                  <form
                    action={
                      deleteManagedContent
                    }
                    className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800"
                  >

                    <input
                      type="hidden"
                      name="kind"
                      value={
                        typedKind
                      }
                    />

                    <input
                      type="hidden"
                      name="id"
                      value={
                        item.id
                      }
                    />


                    <button className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 dark:bg-red-950/30 dark:text-red-300">

                      <Trash2
                        size={14}
                      />

                      Delete{" "}
                      {
                        config.singular
                      }
                    </button>
                  </form>
                </details>
              ),
            )}


            {items.length ===
              0 && (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900">
                No{" "}
                {config.label.toLowerCase()}{" "}
                created yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


function ManagedForm({
  kind,
  item,
}: {
  kind:
    | "events"
    | "departments"
    | "programs";

  item?: any;
}) {
  return (
    <form
      action={
        saveManagedContent
      }
      className="mt-6 grid gap-4"
    >

      <input
        type="hidden"
        name="kind"
        value={
          kind
        }
      />


      {item?.id && (
        <input
          type="hidden"
          name="id"
          value={
            item.id
          }
        />
      )}


      {kind ===
        "events" ? (
        <>
          <Field
            name="title"
            label="Event Title"
            required
            defaultValue={
              item?.title
            }
          />

          <Field
            name="location"
            label="Location"
            defaultValue={
              item?.location
            }
          />

          <Field
            name="event_date"
            label="Date & Time"
            type="datetime-local"
            defaultValue={
              item?.event_date
                ? new Date(
                    item.event_date,
                  )
                    .toISOString()
                    .slice(
                      0,
                      16,
                    )
                : ""
            }
          />

          <TextArea
            name="summary"
            label="Summary"
            defaultValue={
              item?.summary
            }
          />

          <TextArea
            name="body"
            label="Full Details"
            rows={6}
            defaultValue={
              item?.body
            }
          />

          <Enabled
            label="Published"
            defaultChecked={
              item
                ? Boolean(
                    item.is_published,
                  )
                : false
            }
          />
        </>

      ) : kind ===
        "departments" ? (
        <>
          <Field
            name="name"
            label="Department Name"
            required
            defaultValue={
              item?.name
            }
          />

          <Field
            name="short_name"
            label="Short Name"
            defaultValue={
              item?.short_name
            }
          />

          <Field
            name="href"
            label="Public Link"
            placeholder="/explore/overview"
            defaultValue={
              item?.href
            }
          />

          <TextArea
            name="description"
            label="Description"
            defaultValue={
              item?.description
            }
          />

          <Enabled
            label="Active"
            defaultChecked={
              item
                ? Boolean(
                    item.is_active,
                  )
                : true
            }
          />
        </>

      ) : (
        <>
          <Field
            name="name"
            label="Program Name"
            required
            defaultValue={
              item?.name
            }
          />

          <Field
            name="department_name"
            label="Department"
            defaultValue={
              item?.department_name
            }
          />

          <Field
            name="duration"
            label="Duration"
            placeholder="4 Years"
            defaultValue={
              item?.duration
            }
          />

          <Field
            name="href"
            label="Public Link"
            placeholder="/explore/..."
            defaultValue={
              item?.href
            }
          />

          <TextArea
            name="description"
            label="Description"
            defaultValue={
              item?.description
            }
          />

          <Enabled
            label="Active"
            defaultChecked={
              item
                ? Boolean(
                    item.is_active,
                  )
                : true
            }
          />
        </>
      )}


      <button className="flex items-center justify-center gap-2 rounded-xl bg-[#071f50] px-5 py-3.5 text-sm font-black text-white dark:bg-blue-600">

        <Save
          size={16}
        />

        {item
          ? "Save Changes"
          : "Create"}
      </button>
    </form>
  );
}


function Field({
  name,
  label,
  type = "text",
  required = false,
  defaultValue = "",
  placeholder = "",
}: any) {
  return (
    <div>

      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
        {
          label
        }
      </label>

      <input
        name={
          name
        }
        type={
          type
        }
        required={
          required
        }
        defaultValue={
          defaultValue ??
          ""
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}


function TextArea({
  name,
  label,
  defaultValue = "",
  rows = 4,
}: any) {
  return (
    <div>

      <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
        {
          label
        }
      </label>

      <textarea
        name={
          name
        }
        rows={
          rows
        }
        defaultValue={
          defaultValue ??
          ""
        }
        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </div>
  );
}


function Enabled({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950">

      <input
        name="enabled"
        type="checkbox"
        defaultChecked={
          defaultChecked
        }
        className="h-4 w-4 accent-blue-600"
      />

      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
        {
          label
        }
      </span>
    </label>
  );
}
