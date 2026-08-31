import {
  ArrowRight,
  BookOpen,
  Search,
} from "lucide-react";

import Link from "next/link";

import { notFound } from "next/navigation";

import SiteHeader from "@/components/site-header";
import { sectionPages } from "@/lib/site-data";

type SectionKey =
  keyof typeof sectionPages;

export default async function SectionPage({
  params,
}: {
  params: Promise<{
    section: string;
  }>;
}) {
  const { section } =
    await params;

  if (!(section in sectionPages)) {
    notFound();
  }

  const data =
    sectionPages[
      section as SectionKey
    ];

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#061633]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,128,255,0.3),transparent_35%),linear-gradient(135deg,#06132c,#08285e_60%,#06152f)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            {data.eyebrow}
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            {data.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
            {data.description}
          </p>

          <Link
            href={`/directory?section=${encodeURIComponent(
              data.eyebrow,
            )}`}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#082357]"
          >
            <Search size={16} />

            Search this section
          </Link>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              QUICK NAVIGATION
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#081a3d]">
              Explore{" "}
              {data.eyebrow.toLowerCase()}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.cards.map(
              (card) => (
                <Link
                  key={card}
                  href={`/directory?q=${encodeURIComponent(
                    card,
                  )}`}
                  className="group rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.05]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <BookOpen
                      size={19}
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-black text-[#081a3d]">
                    {card}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Search all imported
                    JMIT pages, files and
                    resources related to
                    this topic.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                    Explore

                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-blue-100 bg-blue-50 p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            JMIT NEXT DATABASE
          </p>

          <h2 className="mt-3 text-2xl font-black text-[#081a3d]">
            Live imported institutional
            information.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Pages and resources are
            loaded from the JMIT Next
            PostgreSQL content database
            and synchronized from the
            public JMIT website.
          </p>
        </div>
      </section>
    </main>
  );
}
