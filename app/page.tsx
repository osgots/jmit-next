"use client";

import { motion } from "motion/react";
import SiteHeader from "@/components/site-header";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const navigation = [
  "Home",
  "Academics",
  "Admissions",
  "Departments",
  "Placements",
  "Campus Life",
];

const quickLinks = [
  {
    title: "Notices",
    text: "Latest announcements",
    icon: Bell,
  },
  {
    title: "Time Table",
    text: "Class schedules",
    icon: CalendarDays,
  },
  {
    title: "Syllabus",
    text: "Course curriculum",
    icon: BookOpen,
  },
  {
    title: "Library",
    text: "Academic resources",
    icon: Library,
  },
  {
    title: "Placements",
    text: "Career opportunities",
    icon: BriefcaseBusiness,
  },
  {
    title: "Departments",
    text: "Explore academics",
    icon: Building2,
  },
];

const audiences = [
  {
    title: "Students",
    text: "Syllabus, timetable, notices, forms and placements.",
    icon: GraduationCap,
  },
  {
    title: "Applicants",
    text: "Programs, admission information and eligibility.",
    icon: BookOpen,
  },
  {
    title: "Parents",
    text: "Facilities, academics, contacts and college information.",
    icon: Users,
  },
  {
    title: "Alumni",
    text: "Community, achievements, events and institute updates.",
    icon: Sparkles,
  },
];

const programs = [
  {
    badge: "B.TECH",
    title: "Computer Science & Engineering",
    text: "Software engineering, computing, AI and emerging technologies.",
  },
  {
    badge: "B.TECH",
    title: "Information Technology",
    text: "Modern information systems, software, networking and infrastructure.",
  },
  {
    badge: "B.TECH",
    title: "Electrical & Computer Engineering",
    text: "Electrical systems combined with modern computing technologies.",
  },
  {
    badge: "B.TECH",
    title: "Mechanical Engineering",
    text: "Engineering design, automation, manufacturing and mechanics.",
  },
  {
    badge: "UG",
    title: "Bachelor of Computer Applications",
    text: "Programming, computer applications and information systems.",
  },
  {
    badge: "PG",
    title: "Master of Business Administration",
    text: "Management, entrepreneurship, strategy and leadership.",
  },
];

const updates = [
  {
    category: "ACADEMIC",
    title: "Academic notices and important student information",
  },
  {
    category: "ADMISSIONS",
    title: "Admission and counselling information",
  },
  {
    category: "PLACEMENT",
    title: "Placement drives and career opportunities",
  },
];

export default function Home() {

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <SiteHeader />

      {/* HERO */}
      <section
        id="home"
        className="relative isolate overflow-hidden bg-[#061633]"
      >
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_25%,rgba(37,128,255,0.35),transparent_35%),radial-gradient(circle_at_20%_85%,rgba(0,225,255,0.15),transparent_25%),linear-gradient(135deg,#06132c,#08285e_55%,#06152f)]" />

        <div className="absolute -left-20 top-20 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -right-20 bottom-10 -z-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles size={14} />

              Reimagining the JMIT digital experience
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[74px]">
              Education.
              <br />

              Information.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A faster, clearer and modern digital gateway for JMIT — designed
              around students, applicants, parents and alumni.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quick-access"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#082357] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Explore JMIT

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </a>

              <a
                href="#academics"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                View Programs
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-cyan-300" />
                Secure architecture
              </span>

              <span className="flex items-center gap-2">
                <Search size={15} className="text-cyan-300" />
                Universal search
              </span>

              <span className="flex items-center gap-2">
                <Sparkles size={15} className="text-cyan-300" />
                Modern interface
              </span>
            </div>
          </motion.div>

          {/* SEARCH PANEL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -inset-5 rounded-[40px] bg-blue-400/10 blur-2xl" />

            <div className="relative rounded-[32px] border border-white/15 bg-white/[0.075] p-6 shadow-2xl backdrop-blur-2xl sm:p-7">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Smart Navigation
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                What are you looking for?
              </h2>

              <button className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15">
                <Search size={20} className="text-cyan-300" />

                <span className="flex-1 text-sm text-slate-300">
                  Search syllabus, faculty, notices...
                </span>

                <span className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-slate-400">
                  Ctrl K
                </span>
              </button>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Syllabus", "Academic"],
                  ["Time Table", "Students"],
                  ["Notices", "Updates"],
                  ["Placements", "Career"],
                ].map(([title, type]) => (
                  <button
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <span className="block text-sm font-bold text-white">
                      {title}
                    </span>

                    <span className="mt-1 block text-[11px] text-slate-400">
                      {type}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-xs leading-6 text-slate-300">
                  Search will soon understand queries such as{" "}
                  <strong className="text-white">
                    “CSE third semester syllabus”
                  </strong>{" "}
                  and take users directly to the correct resource.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section id="quick-access" className="relative z-10 -mt-9 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/[0.07]">

          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Quick Access
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#081a3d]">
              Everything important. One click away.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                    <Icon size={19} />
                  </div>

                  <h3 className="text-sm font-black">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.text}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Personalized Experience
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#081a3d] sm:text-4xl">
              Find information based on who you are.
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              JMIT Next will organize resources around the visitor instead of
              forcing everyone through the same navigation structure.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ y: -6 }}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081f4e] text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                    Explore

                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section
        id="academics"
        className="border-y border-slate-200 bg-white px-5 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Academics
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#081a3d] sm:text-4xl">
                Explore academic programs.
              </h2>
            </div>

            <button className="flex items-center gap-2 text-sm font-black text-blue-700">
              View all programs
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.06 }}
                whileHover={{ y: -5 }}
                className="group rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-xl"
              >
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-black tracking-widest text-blue-700">
                  {program.badge}
                </span>

                <h3 className="mt-5 text-xl font-black text-[#081a3d]">
                  {program.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {program.text}
                </p>

                <div className="mt-7 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
                  Program Details

                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Campus Updates
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#081a3d]">
              Stay informed without searching everywhere.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
              Notices, events, academics and placement information will be
              managed from our database-backed administration system.
            </p>
          </div>

          <div className="space-y-3">
            {updates.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Bell size={18} />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-black tracking-widest text-blue-600">
                    {item.category}
                  </p>

                  <h3 className="mt-1 font-bold text-slate-800">
                    {item.title}
                  </h3>
                </div>

                <ArrowRight
                  size={17}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION */}
      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#061a3e]">

          <div className="grid gap-10 px-7 py-12 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-16">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-cyan-300">
                <ShieldCheck size={14} />
                Built differently
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                More than a visual redesign.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                The final portal will combine responsive interfaces, structured
                data, powerful search, administrator controls and protected
                database access.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Next.js 16",
                "PostgreSQL",
                "Supabase",
                "Protected Admin",
                "Global Search",
                "Row Level Security",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />

                  <span className="text-sm font-bold text-white">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-10 md:flex-row md:items-center lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081f4e] text-white">
              <GraduationCap size={20} />
            </div>

            <div>
              <p className="font-black text-[#081a3d]">
                JMIT NEXT
              </p>

              <p className="text-xs text-slate-500">
                Modern information portal prototype
              </p>
            </div>
          </div>

          <p className="max-w-xl text-xs leading-6 text-slate-500 md:text-right">
            Unofficial educational redesign prototype inspired by JMIT.
            Developed as a B.Tech CSE portfolio project.
          </p>
        </div>
      </footer>
    </main>
  );
}

