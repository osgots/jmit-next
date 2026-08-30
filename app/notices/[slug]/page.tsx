import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Download,
  Pin,
} from "lucide-react";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import SiteHeader from "@/components/site-header";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const supabase =
    await createClient();

  const { data: notice } =
    await supabase
      .from("notices")
      .select(
        `
        id,
        title,
        slug,
        summary,
        body,
        category,
        file_url,
        is_pinned,
        is_published,
        published_at,
        created_at,
        expires_at
        `,
      )
      .eq("slug", slug)
      .eq(
        "is_published",
        true,
      )
      .single();

  if (!notice) {
    notFound();
  }

  if (
    notice.expires_at &&
    new Date(
      notice.expires_at,
    ) < new Date()
  ) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <SiteHeader />

      <section className="bg-[#061633]">
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300"
          >
            <ArrowLeft
              size={16}
            />

            All Notices
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
              {notice.category ||
                "General"}
            </span>

            {notice.is_pinned && (
              <span className="flex items-center gap-1 rounded-lg bg-purple-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-purple-200">
                <Pin size={11} />
                Important
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {notice.title}
          </h1>

          <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <CalendarDays
              size={15}
            />

            Published{" "}
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
      </section>

      <section className="px-5 py-12 lg:px-8">
        <article className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Bell size={20} />
          </div>

          {notice.summary && (
            <p className="mt-6 text-lg font-semibold leading-8 text-slate-700">
              {notice.summary}
            </p>
          )}

          {notice.body && (
            <div className="mt-8 whitespace-pre-wrap border-t border-slate-100 pt-8 text-[15px] leading-8 text-slate-600">
              {notice.body}
            </div>
          )}

          {notice.file_url && (
            <a
              href={
                notice.file_url
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#071f50] px-5 py-3 text-sm font-black text-white"
            >
              <Download
                size={16}
              />

              Open Attachment
            </a>
          )}
        </article>
      </section>
    </main>
  );
}
