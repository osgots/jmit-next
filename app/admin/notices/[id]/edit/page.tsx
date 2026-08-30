import {
  ArrowLeft,
  Edit3,
  GraduationCap,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  updateNotice,
} from "./actions";

export default async function EditNoticePage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    error?: string;
  }>;
}) {
  const { id } =
    await params;

  const query =
    await searchParams;

  const { supabase } =
    await requireManager();

  const { data: notice } =
    await supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .single();

  if (!notice) {
    notFound();
  }

  const expiryDate =
    notice.expires_at
      ? new Date(
          notice.expires_at,
        )
          .toISOString()
          .slice(0, 10)
      : "";

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071f50] text-white">
              <GraduationCap
                size={22}
              />
            </div>

            <div>
              <p className="font-black text-[#071a3d]">
                JMIT NEXT
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                Edit Notice
              </p>
            </div>
          </div>

          <Link
            href="/admin/notices"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600"
          >
            <ArrowLeft
              size={15}
            />

            Notices
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm md:p-9">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Edit3
                size={19}
              />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                Content Editor
              </p>

              <h1 className="text-2xl font-black text-[#071a3d]">
                Edit Notice
              </h1>
            </div>
          </div>

          {query.error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              Unable to update
              this notice.
            </div>
          )}

          <form
            action={
              updateNotice
            }
            className="mt-8 space-y-5"
          >
            <input
              type="hidden"
              name="id"
              value={notice.id}
            />

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Title
              </label>

              <input
                name="title"
                defaultValue={
                  notice.title
                }
                required
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Category
              </label>

              <select
                name="category"
                defaultValue={
                  notice.category ||
                  "General"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
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
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Summary
              </label>

              <textarea
                name="summary"
                rows={3}
                maxLength={500}
                defaultValue={
                  notice.summary ||
                  ""
                }
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Full Content
              </label>

              <textarea
                name="body"
                rows={9}
                maxLength={10000}
                defaultValue={
                  notice.body || ""
                }
                className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                File URL
              </label>

              <input
                name="file_url"
                type="url"
                defaultValue={
                  notice.file_url ||
                  ""
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Expiry Date
              </label>

              <input
                name="expires_at"
                type="date"
                defaultValue={
                  expiryDate
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div className="grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
              <label className="flex items-center gap-3">
                <input
                  name="is_published"
                  type="checkbox"
                  defaultChecked={
                    notice.is_published
                  }
                  className="h-4 w-4 accent-blue-700"
                />

                <span className="text-sm font-bold text-slate-700">
                  Published
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  name="is_pinned"
                  type="checkbox"
                  defaultChecked={
                    notice.is_pinned
                  }
                  className="h-4 w-4 accent-blue-700"
                />

                <span className="text-sm font-bold text-slate-700">
                  Pinned
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#071f50] px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-800"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
