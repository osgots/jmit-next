import {
  ArrowRight,
  BookOpen,
  CalendarDays,
} from "lucide-react";

import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/site-header";

const timeTables = [
  {
    name: "Computer Science & Engineering",
    href: "/explore/time-table",
  },
  {
    name: "Information Technology",
    href: "/explore/time-table94",
  },
  {
    name: "Mechanical Engineering",
    href: "/explore/time-table102",
  },
  {
    name: "Electrical & Computer Engineering",
    href: "/explore/time-table118",
  },
  {
    name: "Applied Science & Humanity",
    href: "/explore/time-table204",
  },
  {
    name: "MBA",
    href: "/explore/time-table126",
  },
  {
    name: "BBA",
    href: "/explore/time-table157",
  },
  {
    name: "BCA",
    href: "/explore/time-table178",
  },
];

const syllabi = [
  {
    name: "Computer Science & Engineering",
    href: "/explore/syllabus",
  },
  {
    name: "Information Technology",
    href: "/explore/syllabus95",
  },
  {
    name: "Mechanical Engineering",
    href: "/explore/syllabus103",
  },
  {
    name: "Electrical & Computer Engineering",
    href: "/explore/syllabus119",
  },
  {
    name: "Applied Science & Humanity",
    href: "/explore/syllabus205",
  },
  {
    name: "MBA",
    href: "/explore/syllabus160",
  },
  {
    name: "BBA",
    href: "/explore/syllabus163",
  },
  {
    name: "BCA",
    href: "/explore/syllabus179",
  },
];

export default async function ResourceHub({
  params,
}: {
  params: Promise<{
    kind: string;
  }>;
}) {
  const { kind } = await params;

  if (
    kind !== "timetable" &&
    kind !== "syllabus"
  ) {
    notFound();
  }

  const timetable =
    kind === "timetable";

  const items =
    timetable
      ? timeTables
      : syllabi;

  const Icon =
    timetable
      ? CalendarDays
      : BookOpen;

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#061633]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(37,128,255,.3),transparent_35%),linear-gradient(135deg,#06132c,#08285e_60%,#06152f)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <Icon
            size={28}
            className="text-cyan-300"
          />

          <p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-cyan-300">
            Academic Resources
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-.05em] text-white sm:text-5xl">
            {timetable
              ? "Department Time Tables"
              : "Department Syllabi"}
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            Select your department to open
            the same resource section provided
            on the official JMIT website,
            displayed inside JMIT Next.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon size={19} />
              </div>

              <h2 className="mt-5 text-lg font-black text-[#071a3d]">
                {item.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Open {timetable
                  ? "Time Table"
                  : "Syllabus"}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                Open Resource

                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
