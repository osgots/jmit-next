import fs from "node:fs";

const file = "app/page.tsx";

let source =
  fs.readFileSync(
    file,
    "utf8",
  );

function replaceOnce(
  oldValue,
  newValue,
  label,
) {
  if (!source.includes(oldValue)) {
    throw new Error(
      `Patch failed: ${label}`,
    );
  }

  source = source.replace(
    oldValue,
    newValue,
  );
}


/* ==========================================================
   ROUTER
========================================================== */

replaceOnce(
  'import SiteHeader from "@/components/site-header";',
  'import SiteHeader from "@/components/site-header";\nimport { useRouter } from "next/navigation";',
  "router import",
);


replaceOnce(
  `export default function Home() {

  return (`,
  `export default function Home() {
  const router = useRouter();

  return (`,
  "router initialization",
);


/* ==========================================================
   QUICK LINKS
========================================================== */

const quickMap = [
  [
    `title: "Notices",
    text: "Latest announcements",
    icon: Bell,`,
    `title: "Notices",
    text: "Latest announcements",
    icon: Bell,
    href: "/notices",`,
  ],

  [
    `title: "Time Table",
    text: "Class schedules",
    icon: CalendarDays,`,
    `title: "Time Table",
    text: "Class schedules",
    icon: CalendarDays,
    href: "/directory?q=Time%20Table",`,
  ],

  [
    `title: "Syllabus",
    text: "Course curriculum",
    icon: BookOpen,`,
    `title: "Syllabus",
    text: "Course curriculum",
    icon: BookOpen,
    href: "/directory?q=Syllabus",`,
  ],

  [
    `title: "Library",
    text: "Academic resources",
    icon: Library,`,
    `title: "Library",
    text: "Academic resources",
    icon: Library,
    href: "/directory?q=Library",`,
  ],

  [
    `title: "Placements",
    text: "Career opportunities",
    icon: BriefcaseBusiness,`,
    `title: "Placements",
    text: "Career opportunities",
    icon: BriefcaseBusiness,
    href: "/placements",`,
  ],

  [
    `title: "Departments",
    text: "Explore academics",
    icon: Building2,`,
    `title: "Departments",
    text: "Explore academics",
    icon: Building2,
    href: "/departments",`,
  ],
];

for (
  const [
    before,
    after,
  ] of quickMap
) {
  replaceOnce(
    before,
    after,
    "quick link",
  );
}


/* ==========================================================
   AUDIENCES
========================================================== */

const audienceMap = [
  [
    `title: "Students",
    text: "Syllabus, timetable, notices, forms and placements.",
    icon: GraduationCap,`,
    `title: "Students",
    text: "Syllabus, timetable, notices, forms and placements.",
    icon: GraduationCap,
    href: "/directory?section=Academics",`,
  ],

  [
    `title: "Applicants",
    text: "Programs, admission information and eligibility.",
    icon: BookOpen,`,
    `title: "Applicants",
    text: "Programs, admission information and eligibility.",
    icon: BookOpen,
    href: "/admissions",`,
  ],

  [
    `title: "Parents",
    text: "Facilities, academics, contacts and college information.",
    icon: Users,`,
    `title: "Parents",
    text: "Facilities, academics, contacts and college information.",
    icon: Users,
    href: "/directory?q=Facilities",`,
  ],

  [
    `title: "Alumni",
    text: "Community, achievements, events and institute updates.",
    icon: Sparkles,`,
    `title: "Alumni",
    text: "Community, achievements, events and institute updates.",
    icon: Sparkles,
    href: "/directory?q=Alumni",`,
  ],
];

for (
  const [
    before,
    after,
  ] of audienceMap
) {
  replaceOnce(
    before,
    after,
    "audience link",
  );
}


/* ==========================================================
   PROGRAMS
========================================================== */

const programMap = [
  [
    `title: "Computer Science & Engineering",
    text: "Software engineering, computing, AI and emerging technologies.",`,
    `title: "Computer Science & Engineering",
    text: "Software engineering, computing, AI and emerging technologies.",
    href: "/explore/overview",`,
  ],

  [
    `title: "Information Technology",
    text: "Modern information systems, software, networking and infrastructure.",`,
    `title: "Information Technology",
    text: "Modern information systems, software, networking and infrastructure.",
    href: "/directory?q=Information%20Technology",`,
  ],

  [
    `title: "Electrical & Computer Engineering",
    text: "Electrical systems combined with modern computing technologies.",`,
    `title: "Electrical & Computer Engineering",
    text: "Electrical systems combined with modern computing technologies.",
    href: "/explore/overview114",`,
  ],

  [
    `title: "Mechanical Engineering",
    text: "Engineering design, automation, manufacturing and mechanics.",`,
    `title: "Mechanical Engineering",
    text: "Engineering design, automation, manufacturing and mechanics.",
    href: "/explore/overview98",`,
  ],

  [
    `title: "Bachelor of Computer Applications",
    text: "Programming, computer applications and information systems.",`,
    `title: "Bachelor of Computer Applications",
    text: "Programming, computer applications and information systems.",
    href: "/explore/overview174",`,
  ],

  [
    `title: "Master of Business Administration",
    text: "Management, entrepreneurship, strategy and leadership.",`,
    `title: "Master of Business Administration",
    text: "Management, entrepreneurship, strategy and leadership.",
    href: "/explore/overview122",`,
  ],
];

for (
  const [
    before,
    after,
  ] of programMap
) {
  replaceOnce(
    before,
    after,
    "program link",
  );
}


/* ==========================================================
   CLICK HANDLERS
========================================================== */

replaceOnce(
  `<button className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15">`,
  `<button
                onClick={() => router.push("/directory")}
                className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
              >`,
  "hero search",
);


replaceOnce(
  `<button
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                  >`,
  `<button
                    key={title}
                    onClick={() =>
                      router.push(
                        title === "Notices"
                          ? "/notices"
                          : \`/directory?q=\${encodeURIComponent(title)}\`
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                  >`,
  "hero shortcuts",
);


replaceOnce(
  `whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"`,
  `whileHover={{ y: -5 }}
                  onClick={() => router.push(item.href)}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"`,
  "quick links click",
);


replaceOnce(
  `whileHover={{ y: -6 }}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"`,
  `whileHover={{ y: -6 }}
                  onClick={() => router.push(item.href)}
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"`,
  "audience links click",
);


replaceOnce(
  `<button className="flex items-center gap-2 text-sm font-black text-blue-700">`,
  `<button
              onClick={() => router.push("/directory?section=Academics")}
              className="flex items-center gap-2 text-sm font-black text-blue-700"
            >`,
  "all programs",
);


replaceOnce(
  `whileHover={{ y: -5 }}
                className="group rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-xl"`,
  `whileHover={{ y: -5 }}
                onClick={() => router.push(program.href)}
                role="link"
                tabIndex={0}
                className="group cursor-pointer rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-xl"`,
  "program links click",
);


fs.writeFileSync(
  file,
  source,
  "utf8",
);

console.log(
  "Homepage redirects patched successfully.",
);
