"use client";

import { motion } from "motion/react";

import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  Library,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import Link from "next/link";

import SiteHeader from "@/components/site-header";

const quickLinks = [
  {
    title: "Notices",
    text: "Latest announcements",
    icon: Bell,
    href: "/notices",
  },
  {
    title: "Time Table",
    text: "Class schedules",
    icon: CalendarDays,
    href: "/directory?q=Time%20Table",
  },
  {
    title: "Syllabus",
    text: "Course curriculum",
    icon: BookOpen,
    href: "/directory?q=Syllabus",
  },
  {
    title: "Library",
    text: "Academic resources",
    icon: Library,
    href: "/explore/library",
  },
  {
    title: "Placements",
    text: "Career opportunities",
    icon: BriefcaseBusiness,
    href: "/explore/placementcell-and-record",
  },
  {
    title: "Departments",
    text: "Explore academics",
    icon: Building2,
    href: "/departments",
  },
];

const audiences = [
  {
    title: "Students",
    text: "Syllabus, timetable, notices, forms and placements.",
    icon: GraduationCap,
    href: "/directory?section=Academics",
  },
  {
    title: "Applicants",
    text: "Programs, admission information and eligibility.",
    icon: BookOpen,
    href: "/admissions",
  },
  {
    title: "Parents",
    text: "Facilities, academics, contacts and college information.",
    icon: Users,
    href: "/campus-life",
  },
  {
    title: "Alumni",
    text: "Community, achievements, events and institute updates.",
    icon: Sparkles,
    href: "/directory?section=Alumni",
  },
];

const programs = [
  {
    badge: "B.TECH",
    title:
      "Computer Science & Engineering",
    text:
      "Software engineering, computing, AI and emerging technologies.",
    href: "/explore/overview",
  },
  {
    badge: "B.TECH",
    title:
      "Information Technology",
    text:
      "Modern information systems, software, networking and infrastructure.",
    href: "/explore/overview90",
  },
  {
    badge: "B.TECH",
    title:
      "Electrical & Computer Engineering",
    text:
      "Electrical systems combined with modern computing technologies.",
    href: "/explore/overview114",
  },
  {
    badge: "B.TECH",
    title:
      "Mechanical Engineering",
    text:
      "Engineering design, automation, manufacturing and mechanics.",
    href: "/explore/overview98",
  },
  {
    badge: "UG",
    title:
      "Bachelor of Computer Applications",
    text:
      "Programming, computer applications and information systems.",
    href: "/explore/overview174",
  },
  {
    badge: "PG",
    title:
      "Master of Business Administration",
    text:
      "Management, entrepreneurship, strategy and leadership.",
    href: "/explore/overview122",
  },
];

const updates = [
  {
    category: "ACADEMIC",
    title:
      "Academic notices and important student information",
    href:
      "/notices?category=Academic",
  },
  {
    category: "ADMISSIONS",
    title:
      "Admission and counselling information",
    href:
      "/notices?category=Admissions",
  },
  {
    category: "PLACEMENT",
    title:
      "Placement drives and career opportunities",
    href:
      "/notices?category=Placement",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <SiteHeader />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#061633]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_25%,rgba(37,128,255,0.35),transparent_35%),radial-gradient(circle_at_20%_85%,rgba(0,225,255,0.15),transparent_25%),linear-gradient(135deg,#06132c,#08285e_55%,#06152f_100%)]" />

        <div className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles size={14} />
              Reimagining the JMIT
              digital experience
            </div>

            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[74px]">
              Education.
              <br />
              Information.
              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-white bg-clip-text text-transparent">
                Simplified.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              A faster, clearer and
              modern digital gateway for
              JMIT — with institute
              information and a new
              student community.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/directory"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-[#082357]"
              >
                Explore JMIT
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/social-connect"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-3.5 text-sm font-black text-cyan-200"
              >
                <Users size={17} />
                Social Connect
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-7 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-cyan-300"
                />
                Secure architecture
              </span>

              <span className="flex items-center gap-2">
                <Search
                  size={15}
                  className="text-cyan-300"
                />
                Universal search
              </span>

              <span className="flex items-center gap-2">
                <MessageCircle
                  size={15}
                  className="text-cyan-300"
                />
                Campus community
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            className="rounded-[32px] border border-white/15 bg-white/[0.075] p-7 shadow-2xl backdrop-blur-2xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Smart Navigation
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              What are you looking for?
            </h2>

            <Link
              href="/directory"
              className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/15"
            >
              <Search
                size={20}
                className="text-cyan-300"
              />

              <span className="flex-1 text-sm text-slate-300">
                Search all JMIT
                information...
              </span>
            </Link>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                [
                  "Syllabus",
                  "/directory?q=Syllabus",
                ],
                [
                  "Time Table",
                  "/directory?q=Time%20Table",
                ],
                [
                  "Notices",
                  "/notices",
                ],
                [
                  "Placements",
                  "/explore/placementcell-and-record",
                ],
              ].map(
                ([title, href]) => (
                  <Link
                    key={title}
                    href={href}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    <span className="block text-sm font-bold text-white">
                      {title}
                    </span>
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section
        id="quick-access"
        className="relative z-10 -mt-9 px-5 lg:px-8"
      >
        <div className="mx-auto max-w-7xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Quick Access
          </p>

          <h2 className="mt-2 text-2xl font-black text-[#081a3d]">
            Everything important.
            One click away.
          </h2>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {quickLinks.map(
              (item, index) => {
                const Icon =
                  item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index * 0.04,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="group block h-full rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                        <Icon
                          size={19}
                        />
                      </div>

                      <h3 className="text-sm font-black">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {item.text}
                      </p>
                    </Link>
                  </motion.div>
                );
              },
            )}
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
              Find information based
              on who you are.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map(
              (item, index) => {
                const Icon =
                  item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay:
                        index * 0.07,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="group block h-full rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#081f4e] text-white">
                        <Icon
                          size={21}
                        />
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
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="border-y border-slate-200 bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Academics
              </p>

              <h2 className="mt-3 text-3xl font-black text-[#081a3d]">
                Explore academic programs.
              </h2>
            </div>

            <Link
              href="/departments"
              className="hidden items-center gap-2 font-black text-blue-700 sm:flex"
            >
              View all programs
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map(
              (program) => (
                <Link
                  key={program.title}
                  href={program.href}
                  className="group rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
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
                    />
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* SOCIAL CONNECT PROMO */}
      <section className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-[#071a3d] via-blue-900 to-cyan-800 p-8 text-white md:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                <Users size={15} />
                Social Connect
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em]">
                The JMIT community,
                connected.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-blue-100">
                Create a profile, upload
                photos and videos, follow
                people, like posts,
                comment and discover
                campus life.
              </p>

              <Link
                href="/social-connect"
                className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-blue-900"
              >
                Open Social Connect
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Photo & Video Posts",
                "User Profiles",
                "Likes & Comments",
                "JMIT Verified ✓",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/10 p-5 font-bold backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UPDATES */}
      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
            Campus Updates
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#081a3d]">
            Latest information.
          </h2>

          <div className="mt-8 space-y-3">
            {updates.map((item) => (
              <Link
                key={item.category}
                href={item.href}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
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
                  className="text-blue-700"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 text-xs text-slate-500 lg:px-8">
          JMIT NEXT — Unofficial
          educational redesign and
          community project.
        </div>
      </footer>
    </main>
  );
}
