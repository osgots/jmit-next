import {
  ArrowRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ExternalLink,
  Flag,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  getAdminDisplayName,
} from "@/lib/site-settings";

import ThemeToggle from "@/components/theme-toggle";

import {
  adminLogout,
} from "./actions";


export default async function AdminDashboardPage() {
  const {
    supabase,
    profile,
  } =
    await requireManager();


  const [
    adminName,
    noticesResult,
    eventsResult,
    departmentsResult,
    programsResult,
    messagesResult,
    reportsResult,
    recentNoticesResult,
  ] =
    await Promise.all([

      getAdminDisplayName(
        supabase,
        profile.full_name ||
          "osgots",
      ),

      supabase
        .from("notices")
        .select("*", {
          count:
            "exact",
          head:
            true,
        }),

      supabase
        .from("events")
        .select("*", {
          count:
            "exact",
          head:
            true,
        }),

      supabase
        .from("departments")
        .select("*", {
          count:
            "exact",
          head:
            true,
        }),

      supabase
        .from("programs")
        .select("*", {
          count:
            "exact",
          head:
            true,
        }),

      supabase
        .from(
          "contact_messages",
        )
        .select("*", {
          count:
            "exact",
          head:
            true,
        }),

      supabase
        .from(
          "social_moderation_reports",
        )
        .select("*", {
          count:
            "exact",
          head:
            true,
        })
        .eq(
          "status",
          "pending",
        ),

      supabase
        .from("notices")
        .select(
          "id, title, category, is_published, is_pinned, created_at",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        )
        .limit(5),
    ]);


  const stats = [
    {
      title:
        "Notices",

      value:
        noticesResult.count ??
        0,

      icon:
        Bell,

      href:
        "/admin/notices",
    },

    {
      title:
        "Events",

      value:
        eventsResult.count ??
        0,

      icon:
        CalendarDays,

      href:
        "/admin/content/events",
    },

    {
      title:
        "Departments",

      value:
        departmentsResult.count ??
        0,

      icon:
        Building2,

      href:
        "/admin/content/departments",
    },

    {
      title:
        "Programs",

      value:
        programsResult.count ??
        0,

      icon:
        BookOpen,

      href:
        "/admin/content/programs",
    },

    {
      title:
        "Messages",

      value:
        messagesResult.count ??
        0,

      icon:
        Mail,

      href:
        "/admin/messages",
    },
  ];


  const recentNotices =
    recentNoticesResult.data ??
    [];


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">

      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link
            href="/admin"
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071f50] text-white">
              <GraduationCap
                size={22}
              />
            </div>


            <div>

              <p className="font-black tracking-tight text-[#071a3d] dark:text-white">
                JMIT NEXT
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                Administration
              </p>
            </div>
          </Link>


          <div className="flex items-center gap-2">

            <ThemeToggle />


            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 sm:flex dark:border-slate-700 dark:text-slate-300"
            >
              View Site

              <ExternalLink
                size={15}
              />
            </Link>


            <form
              action={
                adminLogout
              }
            >
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-bold text-white dark:bg-blue-600"
              >
                <LogOut
                  size={15}
                />

                Logout
              </button>
            </form>
          </div>
        </div>
      </header>


      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.17em] text-blue-600">
              <LayoutDashboard
                size={14}
              />

              Dashboard
            </div>


            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white sm:text-4xl">
              Welcome back,{" "}
              {
                adminName
              }.
            </h1>


            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Manage JMIT Next content and monitor the portal from one place.
            </p>
          </div>


          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 md:self-auto dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">

            <ShieldCheck
              size={15}
            />

            {
              profile.role
            }
          </div>
        </div>


        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {stats.map(
            (
              stat,
            ) => {
              const Icon =
                stat.icon;


              return (
                <Link
                  key={
                    stat.title
                  }
                  href={
                    stat.href
                  }
                  className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">

                      <Icon
                        size={19}
                      />
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>


                  <p className="mt-5 text-3xl font-black tracking-tight text-[#071a3d] dark:text-white">
                    {
                      stat.value
                    }
                  </p>


                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {
                      stat.title
                    }
                  </p>
                </Link>
              );
            },
          )}
        </div>


        <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_.55fr]">

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
                  Content
                </p>

                <h2 className="mt-2 text-xl font-black text-[#071a3d] dark:text-white">
                  Recent Notices
                </h2>
              </div>


              <Link
                href="/admin/notices"
                className="text-sm font-black text-blue-700 dark:text-blue-400"
              >
                Manage all
              </Link>
            </div>


            <div className="mt-6">

              {recentNotices.length ===
              0 ? (
                <p className="py-12 text-center text-sm text-slate-400">
                  No notices yet.
                </p>

              ) : (
                <div className="space-y-2">

                  {recentNotices.map(
                    (
                      notice,
                    ) => (
                      <div
                        key={
                          notice.id
                        }
                        className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                      >

                        <p className="font-black text-slate-900 dark:text-white">
                          {
                            notice.title
                          }
                        </p>


                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                          {notice.category ||
                            "General"}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </section>


          <aside className="rounded-[28px] bg-[#071a3d] p-6 text-white">

            <p className="text-xs font-black uppercase tracking-[0.17em] text-cyan-300">
              Quick Actions
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Content Manager
            </h2>


            <div className="mt-6 space-y-2">

              <Quick
                href="/admin/notices"
                icon={
                  Bell
                }
                title="Manage Notices"
              />

              <Quick
                href="/admin/content/events"
                icon={
                  CalendarDays
                }
                title="Manage Events"
              />

              <Quick
                href="/admin/content/departments"
                icon={
                  Building2
                }
                title="Manage Departments"
              />

              <Quick
                href="/admin/content/programs"
                icon={
                  BookOpen
                }
                title="Manage Programs"
              />

              <Quick
                href="/admin/messages"
                icon={
                  Mail
                }
                title="Messages"
              />

              <Quick
                href="/admin/social"
                icon={
                  Users
                }
                title="Social Management"
              />

              <Quick
                href="/admin/social/reports"
                icon={
                  Flag
                }
                title={`Reports (${reportsResult.count ?? 0})`}
              />

              <Quick
                href="/admin/settings"
                icon={
                  Settings
                }
                title="Admin Settings"
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


function Quick({
  href,
  icon:
    Icon,
  title,
}: any) {
  return (
    <Link
      href={
        href
      }
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
    >

      <Icon
        size={18}
        className="text-cyan-300"
      />

      <p className="text-sm font-black text-white">
        {
          title
        }
      </p>
    </Link>
  );
}
