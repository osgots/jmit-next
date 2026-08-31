import {
  ArrowRight,
  GraduationCap,
  Users,
} from "lucide-react";

import Link from "next/link";
import { notFound } from "next/navigation";

import SiteHeader from "@/components/site-header";

const hubs = {
  students: {
    title: "Student Hub",

    description:
      "Everything students commonly need from academics to placements.",

    links: [
      ["Time Tables", "/resources/timetable"],
      ["Syllabus", "/resources/syllabus"],
      ["Academic Calendar", "/explore/academic-calendar"],
      ["Notices", "/notices"],
      ["Library", "/explore/library"],
      ["Placements", "/explore/placementcell-and-record"],
      ["Hostel", "/explore/hostel-accommodation"],
      ["Clubs & Societies", "/explore/clubssocieties"],
    ],
  },

  applicants: {
    title: "Applicant Hub",

    description:
      "Admission information arranged in one simple place.",

    links: [
      ["Admission Procedure", "/explore/admission-procedure"],
      ["Courses & Intake", "/directory?q=Courses%20and%20Intake"],
      ["Fee Structure", "/explore/fee-structure"],
      ["Admission Counselling", "/explore/admission-counselling"],
      ["Scholarships", "/explore/scholarships"],
      ["Admission Notices", "/notices?category=Admissions"],
      ["Hostel Accommodation", "/explore/hostel-accommodation"],
      ["Contact JMIT", "/explore/contact-address"],
    ],
  },

  parents: {
    title: "Parent Hub",

    description:
      "Important academic, campus and contact information for parents.",

    links: [
      ["Admission Information", "/explore/admission-procedure"],
      ["Fee Structure", "/explore/fee-structure"],
      ["Hostel Accommodation", "/explore/hostel-accommodation"],
      ["Library", "/explore/library"],
      ["Placements", "/explore/placementcell-and-record"],
      ["Campus Facilities", "/campus-life"],
      ["Notices", "/notices"],
      ["Contact JMIT", "/explore/contact-address"],
    ],
  },

  alumni: {
    title: "Alumni Hub",

    description:
      "Alumni information, registration, interaction and achievements.",

    links: [
      ["Alumni List", "/explore/alumni-list"],
      ["Registration Form", "/explore/registration-form"],
      ["Alumni Meet", "/directory?q=Alumni%20Meet"],
      ["Alumni Chapters", "/directory?q=Alumni%20Chapters"],
      ["Distinguished Alumni", "/directory?q=Distinguished%20Alumni"],
      ["Alumni Entrepreneurs", "/directory?q=Alumni%20Entrepreneurs"],
      ["Placement Activities", "/directory?q=Alumni%20Placement%20Activities"],
      ["JMIT Directory", "/directory?section=Alumni"],
    ],
  },
} as const;

export default async function AudienceHub({
  params,
}: {
  params: Promise<{
    kind: string;
  }>;
}) {
  const { kind } = await params;

  if (!(kind in hubs)) {
    notFound();
  }

  const data =
    hubs[kind as keyof typeof hubs];

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="bg-[#061633]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <Users
            size={28}
            className="text-cyan-300"
          />

          <h1 className="mt-5 text-4xl font-black tracking-[-.05em] text-white sm:text-5xl">
            {data.title}
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-slate-300">
            {data.description}
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.links.map(
            ([label, href]) => (
              <Link
                key={label}
                href={href}
                className="group rounded-[22px] border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <GraduationCap
                  size={20}
                  className="text-blue-700"
                />

                <h2 className="mt-5 font-black text-[#071a3d]">
                  {label}
                </h2>

                <div className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                  Open

                  <ArrowRight
                    size={13}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
