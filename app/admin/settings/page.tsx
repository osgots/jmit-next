import {
  ArrowLeft,
  Save,
  Settings,
  UserRound,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  getAdminDisplayName,
} from "@/lib/site-settings";

import {
  updateAdminIdentity,
} from "./actions";


export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
}) {
  const params =
    await searchParams;


  const {
    supabase,
    profile,
  } =
    await requireManager();


  const name =
    await getAdminDisplayName(
      supabase,
      "osgots",
    );


  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 dark:bg-slate-950">

      <div className="mx-auto max-w-2xl">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-black text-blue-700 dark:text-blue-400"
        >
          <ArrowLeft
            size={16}
          />

          Dashboard
        </Link>


        <div className="mt-7">

          <div className="flex items-center gap-3">

            <Settings
              size={27}
              className="text-blue-600"
            />

            <h1 className="text-4xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Admin Settings
            </h1>
          </div>


          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Change the normal portal administrator identity without changing your Social Connect profile name or username.
          </p>
        </div>


        {params.status ===
          "saved" && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
            Administrator identity updated.
          </div>
        )}


        {params.error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            Unable to save administrator identity.
          </div>
        )}


        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <UserRound
                size={20}
              />
            </div>

            <div>

              <p className="font-black text-slate-950 dark:text-white">
                Administrator Display Name
              </p>

              <p className="text-xs text-slate-500">
                Current database identity
              </p>
            </div>
          </div>


          <form
            action={
              updateAdminIdentity
            }
            className="mt-7 space-y-5"
          >

            <div>

              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                Display Name
              </label>

              <input
                name="admin_display_name"
                required
                minLength={2}
                maxLength={60}
                defaultValue={
                  name
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>


            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-800 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300">

              Your Social Connect identity is separate and will not be modified.

            </div>


            <button
              disabled={
                profile.role !==
                "admin"
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-black text-white disabled:opacity-40"
            >

              <Save
                size={17}
              />

              Save Administrator Name
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
