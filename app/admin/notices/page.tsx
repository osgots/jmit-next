import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  GraduationCap,
  Pin,
  Plus,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  createNotice,
  deleteNotice,
  togglePin,
  togglePublish,
} from "./actions";

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
}) {
  const params =
    await searchParams;

  const { supabase } =
    await requireManager();

  const { data } = await supabase
    .from("notices")
    .select(
      `
      id,
      title,
      slug,
      category,
      summary,
      is_published,
      is_pinned,
      expires_at,
      created_at,
      published_at
      `,
    )
    .order("is_pinned", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  const notices =
    data ?? [];

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071f50] text-white">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="font-black text-[#071a3d]">
                JMIT NEXT
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                Notice Manager
              </p>
            </div>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft size={15} />

            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Content Management
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#071a3d] sm:text-4xl">
              Notices
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Create, publish, edit,
              pin and expire institute
              notices.
            </p>
          </div>

          <Link
            href="/notices"
            target="_blank"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 md:self-auto"
          >
            <Eye size={16} />

            Public Notices
          </Link>
        </div>

        {params.status ===
          "created" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2
              size={18}
            />

            Notice created
            successfully.
          </div>
        )}

        {params.status ===
          "deleted" && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2
              size={18}
            />

            Notice deleted
            successfully.
          </div>
        )}

        {params.error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            Something went wrong
            while processing the
            notice.
          </div>
        )}

        <div className="mt-10 grid gap-7 lg:grid-cols-[0.78fr_1.22fr]">

          {/* CREATE FORM */}
          <section className="self-start rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Plus size={19} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  New Content
                </p>

                <h2 className="text-xl font-black text-[#071a3d]">
                  Create Notice
                </h2>
              </div>
            </div>

            <form
              action={createNotice}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Notice Title
                </label>

                <input
                  id="title"
                  name="title"
                  required
                  minLength={3}
                  maxLength={200}
                  placeholder="Enter notice title"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  defaultValue="General"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                >
                  <option>
                    General
                  </option>

                  <option>
                    Academic
                  </option>

                  <option>
                    Admissions
                  </option>

                  <option>
                    Examination
                  </option>

                  <option>
                    Placement
                  </option>

                  <option>
                    Hostel
                  </option>

                  <option>
                    Events
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="summary"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Summary
                </label>

                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  maxLength={500}
                  placeholder="Short description..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="body"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Full Content
                </label>

                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  maxLength={10000}
                  placeholder="Enter complete notice content..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="file_url"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  External File URL
                </label>

                <input
                  id="file_url"
                  name="file_url"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="expires_at"
                  className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500"
                >
                  Expiry Date
                </label>

                <input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Optional. After this
                  date the notice
                  automatically disappears
                  from the public portal.
                </p>
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    name="is_published"
                    type="checkbox"
                    className="h-4 w-4 accent-blue-700"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Publish immediately
                    </p>

                    <p className="text-xs text-slate-400">
                      Makes this publicly
                      visible.
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    name="is_pinned"
                    type="checkbox"
                    className="h-4 w-4 accent-blue-700"
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Pin this notice
                    </p>

                    <p className="text-xs text-slate-400">
                      Prioritizes this
                      notice.
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#071f50] px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
              >
                <Plus size={16} />

                Create Notice
              </button>
            </form>
          </section>

          {/* NOTICE LIST */}
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                  PostgreSQL Database
                </p>

                <h2 className="mt-1 text-xl font-black text-[#071a3d]">
                  All Notices
                </h2>
              </div>

              <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500">
                {notices.length} total
              </span>
            </div>

            <div className="mt-6">
              {notices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-16 text-center">
                  <Bell
                    size={30}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 font-black text-slate-700">
                    No notices created
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Create your first
                    database-backed notice.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map(
                    (notice) => {
                      const expired =
                        notice.expires_at &&
                        new Date(
                          notice.expires_at,
                        ) < new Date();

                      return (
                        <article
                          key={notice.id}
                          className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200"
                        >
                          <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                              <Bell
                                size={18}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                                  {notice.category ||
                                    "General"}
                                </span>

                                <span
                                  className={`rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                                    notice.is_published
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {notice.is_published
                                    ? "Published"
                                    : "Draft"}
                                </span>

                                {notice.is_pinned && (
                                  <span className="rounded-md bg-purple-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-purple-700">
                                    Pinned
                                  </span>
                                )}

                                {expired && (
                                  <span className="rounded-md bg-red-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-600">
                                    Expired
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-2 font-black text-slate-800">
                                {
                                  notice.title
                                }
                              </h3>

                              {notice.summary && (
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                  {
                                    notice.summary
                                  }
                                </p>
                              )}

                              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Created{" "}
                                {new Date(
                                  notice.created_at,
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                            <Link
                              href={`/admin/notices/${notice.id}/edit`}
                              className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
                            >
                              <Edit3
                                size={14}
                              />

                              Edit
                            </Link>

                            <form
                              action={
                                togglePublish
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={
                                  notice.id
                                }
                              />

                              <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                              >
                                {notice.is_published ? (
                                  <>
                                    <EyeOff
                                      size={
                                        14
                                      }
                                    />

                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye
                                      size={
                                        14
                                      }
                                    />

                                    Publish
                                  </>
                                )}
                              </button>
                            </form>

                            <form
                              action={
                                togglePin
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={
                                  notice.id
                                }
                              />

                              <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-50"
                              >
                                <Pin
                                  size={14}
                                />

                                {notice.is_pinned
                                  ? "Unpin"
                                  : "Pin"}
                              </button>
                            </form>

                            <form
                              action={
                                deleteNotice
                              }
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={
                                  notice.id
                                }
                              />

                              <button
                                type="submit"
                                className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2
                                  size={14}
                                />

                                Delete
                              </button>
                            </form>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
