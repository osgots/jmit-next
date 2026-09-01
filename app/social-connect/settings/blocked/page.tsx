import {
  Ban,
} from "lucide-react";

import AppBackButton from "@/components/app-back-button";
import SiteHeader from "@/components/site-header";
import UnblockButton from "@/components/social/unblock-button";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";


export default async function BlockedAccountsPage() {
  const {
    supabase,
  } =
    await requireSocialProfile();


  const {
    data:
      blocked,
  } =
    await supabase.rpc(
      "social_list_my_blocks",
    );


  return (
    <main className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <SiteHeader />


      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-5 sm:py-12">

        <AppBackButton
          fallback="/social-connect/settings"
          label="Back to Settings"
        />


        <div className="mt-6">

          <div className="flex items-center gap-3">

            <Ban
              size={27}
              className="text-red-500"
            />

            <h1 className="text-3xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Blocked Accounts
            </h1>
          </div>


          <p className="mt-3 text-sm leading-6 text-slate-500">
            Blocked accounts cannot follow, message or interact with you. Unblocking does not automatically restore follows.
          </p>
        </div>


        <div className="mt-8 space-y-3">

          {(blocked ??
            []).map(
            (
              person: any,
            ) => (
              <div
                key={
                  person.blocked_id
                }
                className="flex items-center gap-4 rounded-[20px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >

                {person.avatar_url ? (
                  <img
                    src={
                      person.avatar_url
                    }
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />

                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {(
                      person.display_name ??
                      "?"
                    )
                      .slice(
                        0,
                        1,
                      )
                      .toUpperCase()}
                  </div>
                )}


                <div className="min-w-0 flex-1">

                  <p className="truncate font-black text-slate-950 dark:text-white">
                    {person.display_name ??
                      "Social Connect User"}
                  </p>

                  {person.username && (
                    <p className="truncate text-xs text-slate-500">
                      @
                      {
                        person.username
                      }
                    </p>
                  )}
                </div>


                <UnblockButton
                  targetUserId={
                    person.blocked_id
                  }
                />
              </div>
            ),
          )}


          {(blocked ??
            []).length ===
            0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">

              <Ban
                size={36}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-950 dark:text-white">
                No blocked accounts
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Accounts you block will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
