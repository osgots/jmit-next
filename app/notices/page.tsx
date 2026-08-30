import {
  ArrowRight,
  Bell,
  CalendarDays,
  Pin,
  Search,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";

import {
  createClient,
} from "@/lib/supabase/server";

const categories = [
  "All",
  "General",
  "Academic",
  "Admissions",
  "Examination",
  "Placement",
  "Hostel",
  "Events",
];

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}) {
  const params =
    await searchParams;

  const query =
    params.q?.trim().toLowerCase() ??
    "";

  const category =
    params.category ?? "All";

  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("notices")
      .select(
        `
        id,
        title,
        slug,
        summary,
        category,
        is_pinned,
        published_at,
        created_at,
        expires_at
        `,
      )
      .eq(
        "is_published",
        true,
      )
      .order("is_pinned", {
        ascending: false,
      })
      .order("published_at", {
        ascending: false,
      });

  const now =
    new Date();

  const notices =
    (data ?? []).filter(
      (notice) => {
        if (
          notice.expires_at &&
          new Date(
            notice.expires_at,
          ) < now
        ) {
          return false;
        }

        if (
          category !== "All" &&
          notice.category !==
            category
        ) {
          return false;
        }

        if (query) {
          const haystack = [
            notice.title,
            notice.summary,
            notice.category,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (
            !haystack.includes(
              query,
            )
          ) {
            return false;
          }
        }

        return true;
      },
    );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#061633]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(37,128,255,0.30),transparent_35%),linear-gradient(135deg,#06132c,#08285e_55%,#06152f)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <Bell size={14} />

            Notice Board
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Important updates.
            <br />

            <span className="text-cyan-300">
              Without the clutter.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Search and browse
            published academic,
            admission, examination,
            placement and campus
            announcements.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl">
          <form className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                name="q"
                defaultValue={
                  params.q ?? ""
                }
                placeholder="Search notices..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              name="category"
              defaultValue={
                category
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none"
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>

            <button className="rounded-xl bg-[#071f50] px-6 py-3 text-sm font-black text-white">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
                Latest Updates
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#071a3d]">
                Published Notices
              </h2>
            </div>

            <span className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-500 shadow-sm">
              {notices.length} found
            </span>
          </div>

          {notices.length ===
          0 ? (
            <div className="rounded-[26px] border border-dashed border-slate-200 bg-white py-20 text-center">
              <Bell
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-700">
                No notices found
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Try changing your
                search or category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map(
                (notice) => (
                  <Link
                    key={notice.id}
                    href={`/notices/${notice.slug}`}
                    className="group block rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.05]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        {notice.is_pinned ? (
                          <Pin
                            size={19}
                          />
                        ) : (
                          <Bell
                            size={19}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                            {notice.category ||
                              "General"}
                          </span>

                          {notice.is_pinned && (
                            <span className="rounded-md bg-purple-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-purple-700">
                              Important
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 text-lg font-black text-[#071a3d]">
                          {
                            notice.title
                          }
                        </h3>

                        {notice.summary && (
                          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                            {
                              notice.summary
                            }
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays
                            size={13}
                          />

                          {new Date(
                            notice.published_at ||
                              notice.created_at,
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700"
                      />
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
