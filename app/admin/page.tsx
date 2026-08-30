import {
  ArrowRight,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { requireManager } from "@/lib/auth/require-manager";

import { adminLogout } from "./actions";

export default async function AdminDashboardPage() {
  const {
    supabase,
    profile,
  } = await requireManager();

  const [
    noticesResult,
    eventsResult,
    departmentsResult,
    programsResult,
    messagesResult,
    recentNoticesResult,
  ] = await Promise.all([
    supabase
      .from("notices")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("departments")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("programs")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("contact_messages")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("notices")
      .select(
        "id, title, category, is_published, is_pinned, created_at"
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  const stats = [
    {
      title: "Notices",
      value: noticesResult.count ?? 0,
      icon: Bell,
      href: "/admin/notices",
    },
    {
      title: "Events",
      value: eventsResult.count ?? 0,
      icon: CalendarDays,
      href: "#",
    },
    {
      title: "Departments",
      value: departmentsResult.count ?? 0,
      icon: Building2,
      href: "#",
    },
    {
      title: "Programs",
      value: programsResult.count ?? 0,
      icon: BookOpen,
      href: "#",
    },
    {
      title: "Messages",
      value: messagesResult.count ?? 0,
      icon: Mail,
      href: "#",
    },
  ];

  const recentNotices =
    recentNoticesResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#071f50] text-white">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="font-black tracking-tight text-[#071a3d]">
                JMIT NEXT
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
                Administration
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:flex"
            >
              View Site
              <ExternalLink size={15} />
            </Link>

            <form action={adminLogout}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                <LogOut size={15} />
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
              <LayoutDashboard size={14} />
              Dashboard
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#071a3d] sm:text-4xl">
              Welcome back, {profile.full_name || "Administrator"}.
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Manage JMIT Next content and monitor the portal from one
              place.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-700 md:self-auto">
            <ShieldCheck size={15} />
            {profile.role}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={19} />
                  </div>

                  <ArrowRight
                    size={16}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-[#071a3d]">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_.55fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-600">
                  Content
                </p>

                <h2 className="mt-2 text-xl font-black text-[#071a3d]">
                  Recent Notices
                </h2>
              </div>

              <Link
                href="/admin/notices"
                className="text-sm font-black text-blue-700"
              >
                Manage all
              </Link>
            </div>

            <div className="mt-6">
              {recentNotices.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <Bell
                    size={26}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-4 font-black text-slate-700">
                    No notices yet
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Create your first notice from the Notices manager.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <Bell size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-slate-800">
                          {notice.title}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                            {notice.category || "General"}
                          </span>

                          <span className="text-[10px] text-slate-300">
                            •
                          </span>

                          <span
                            className={`text-[10px] font-black uppercase tracking-wider ${
                              notice.is_published
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {notice.is_published
                              ? "Published"
                              : "Draft"}
                          </span>

                          {notice.is_pinned && (
                            <>
                              <span className="text-[10px] text-slate-300">
                                •
                              </span>

                              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                                Pinned
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-[28px] bg-[#071a3d] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.17em] text-cyan-300">
              Quick Actions
            </p>

            <h2 className="mt-2 text-xl font-black">
              Content Manager
            </h2>

            <div className="mt-6 space-y-2">
              <Link
                href="/admin/notices"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
              >
                <Bell size={18} className="text-cyan-300" />

                <div>
                  <p className="text-sm font-black">
                    Manage Notices
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Create and publish announcements
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 opacity-60">
                <CalendarDays size={18} className="text-cyan-300" />

                <div>
                  <p className="text-sm font-black">
                    Manage Events
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Coming in the next phase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 opacity-60">
                <Users size={18} className="text-cyan-300" />

                <div>
                  <p className="text-sm font-black">
                    Faculty Management
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
