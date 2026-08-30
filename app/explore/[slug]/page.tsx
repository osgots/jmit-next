import {
  ArrowLeft,
  ExternalLink,
  FileText,
} from "lucide-react";

import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import SiteHeader from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

type ImportedDocument = {
  title: string;
  url: string;
  type: string;
};

type ImportedContent = {
  format?: string;
  section?: string;
  html?: string;
  text?: string;
  source_url?: string;
  imported_at?: string;
  documents?: ImportedDocument[];
};

async function getPage(
  slug: string,
) {
  const supabase =
    await createClient();

  const { data } =
    await supabase
      .from("pages")
      .select(
        "title, slug, seo_title, seo_description, content",
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } =
    await params;

  const page =
    await getPage(slug);

  if (!page) {
    return {};
  }

  return {
    title:
      page.seo_title ||
      `${page.title} | JMIT Next`,

    description:
      page.seo_description ||
      undefined,
  };
}

export default async function ImportedPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const page =
    await getPage(slug);

  if (!page) {
    notFound();
  }

  const content =
    (page.content ??
      {}) as ImportedContent;

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <SiteHeader />

      <section className="bg-[#061633]">
        <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300"
          >
            <ArrowLeft size={16} />
            JMIT Directory
          </Link>

          <span className="mt-7 block text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            {content.section ||
              "JMIT Information"}
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            {page.title}
          </h1>

          {page.seo_description && (
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              {page.seo_description}
            </p>
          )}
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_260px]">

          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
            <div
              className="
                jmit-imported-content
                text-[15px]
                leading-8
                text-slate-600

                [&_h1]:mt-8
                [&_h1]:text-3xl
                [&_h1]:font-black
                [&_h1]:text-[#071a3d]

                [&_h2]:mt-8
                [&_h2]:text-2xl
                [&_h2]:font-black
                [&_h2]:text-[#071a3d]

                [&_h3]:mt-7
                [&_h3]:text-xl
                [&_h3]:font-black
                [&_h3]:text-[#071a3d]

                [&_p]:my-4

                [&_a]:font-bold
                [&_a]:text-blue-700
                [&_a]:underline
                [&_a]:decoration-blue-200
                [&_a]:underline-offset-4

                [&_ul]:my-4
                [&_ul]:list-disc
                [&_ul]:pl-6

                [&_ol]:my-4
                [&_ol]:list-decimal
                [&_ol]:pl-6

                [&_li]:my-2

                [&_table]:my-7
                [&_table]:w-full
                [&_table]:border-collapse
                [&_table]:overflow-hidden

                [&_td]:border
                [&_td]:border-slate-200
                [&_td]:p-3

                [&_th]:border
                [&_th]:border-slate-200
                [&_th]:bg-slate-50
                [&_th]:p-3
                [&_th]:text-left
                [&_th]:font-black

                [&_img]:my-7
                [&_img]:h-auto
                [&_img]:max-w-full
                [&_img]:rounded-2xl
              "
              dangerouslySetInnerHTML={{
                __html:
                  content.html ||
                  "<p>Content unavailable.</p>",
              }}
            />
          </article>

          <aside className="space-y-4">
            {content.source_url && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  SOURCE
                </p>

                <p className="mt-2 text-sm font-black text-[#071a3d]">
                  JMIT Official Website
                </p>

                <a
                  href={content.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-xs font-black text-blue-700"
                >
                  Original Page
                  <ExternalLink size={13} />
                </a>
              </div>
            )}

            {content.documents &&
              content.documents.length >
                0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    DOCUMENTS
                  </p>

                  <div className="mt-4 space-y-2">
                    {content.documents.map(
                      (document) => (
                        <a
                          key={document.url}
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-blue-50"
                        >
                          <FileText
                            size={16}
                            className="mt-0.5 shrink-0 text-blue-700"
                          />

                          <span className="min-w-0">
                            <span className="block text-xs font-bold leading-5 text-slate-700">
                              {document.title}
                            </span>

                            <span className="mt-1 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                              {document.type}
                            </span>
                          </span>
                        </a>
                      ),
                    )}
                  </div>
                </div>
              )}
          </aside>
        </div>
      </section>
    </main>
  );
}
