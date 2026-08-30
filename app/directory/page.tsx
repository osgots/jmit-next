import {
  ArrowRight,
  BookOpen,
  Database,
  Search,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

type ImportedContent = {
  section?: string;
  text?: string;
  source_url?: string;
  documents?: {
    title: string;
    url: string;
    type: string;
  }[];
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    section?: string;
  }>;
}) {
  const params =
    await searchParams;

  const q =
    params.q?.trim().toLowerCase() ||
    "";

  const selectedSection =
    params.section || "All";

  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("pages")
      .select(
        "id, title, slug, seo_description, content",
      )
      .eq("is_published", true)
      .order("title");

  const allPages =
    (data ?? []).map((page) => ({
      ...page,

      content:
        (page.content ??
          {}) as ImportedContent,
    }));

  const sections = [
    "All",
    ...Array.from(
      new Set(
        allPages
          .map(
            (page) =>
              page.content.section,
          )
          .filter(
            (value): value is string =>
              Boolean(value),
          ),
      ),
    ).sort(),
  ];

  const pages =
    allPages.filter(
      (page) => {
        if (
          selectedSection !==
            "All" &&
          page.content.section !==
            selectedSection
        ) {
          return false;
        }

        if (!q) {
          return true;
        }

        const haystack = [
          page.title,
          page.seo_description,
          page.content.section,
          page.content.text,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(
          q,
        );
      },
    );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#061633]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(37,128,255,0.30),transparent_35%),linear-gradient(135deg,#06132c,#08285e_55%,#06152f)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <Database size={14} />
            JMIT Knowledge Directory
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            The entire institute.
            <br />

            <span className="text-cyan-300">
              Easier to navigate.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Browse imported institutional information, academics,
            departments, admissions, placements, facilities and
            resources from one structured directory.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-5 lg:px-8">
        <form className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search all JMIT information..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <select
            name="section"
            defaultValue={selectedSection}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none"
          >
            {sections.map((section) => (
              <option
                key={section}
                value={section}
              >
                {section}
              </option>
            ))}
          </select>

          <button className="rounded-xl bg-[#071f50] px-6 py-3 text-sm font-black text-white">
            Search
          </button>
        </form>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                CONTENT DATABASE
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#071a3d]">
                Institute Directory
              </h2>
            </div>

            <span className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-500 shadow-sm">
              {pages.length} pages
            </span>
          </div>

          {pages.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-slate-200 bg-white py-20 text-center">
              <BookOpen
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-700">
                No imported pages found
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Run the JMIT importer first.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  href={`/explore/${page.slug}`}
                  className="group rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.05]"
                >
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-blue-700">
                    {page.content.section ||
                      "General"}
                  </span>

                  <h3 className="mt-5 text-lg font-black leading-6 text-[#071a3d]">
                    {page.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {page.seo_description ||
                      "JMIT institutional information."}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                    Open
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
