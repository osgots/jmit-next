import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Flag,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import Link from "next/link";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  updateReportStatus,
} from "./actions";


function statusClasses(
  status: string,
) {
  switch (
    status
  ) {
    case "actioned":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900";

    case "dismissed":
      return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

    case "reviewed":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900";

    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900";
  }
}


export default async function AdminSocialReportsPage() {
  const {
    supabase,
  } =
    await requireManager();


  const {
    data:
      reportRows,
  } =
    await supabase
      .from(
        "social_moderation_reports",
      )
      .select("*")
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(
        250,
      );


  const reports =
    [
      ...(reportRows ??
        []),
    ].sort(
      (
        a,
        b,
      ) => {
        if (
          a.status ===
            "pending" &&
          b.status !==
            "pending"
        ) {
          return -1;
        }

        if (
          b.status ===
            "pending" &&
          a.status !==
            "pending"
        ) {
          return 1;
        }

        return (
          new Date(
            b.created_at,
          ).getTime() -
          new Date(
            a.created_at,
          ).getTime()
        );
      },
    );


  const reporterIds =
    Array.from(
      new Set(
        reports.map(
          (
            report,
          ) =>
            report.reporter_id,
        ),
      ),
    );


  const targetUserIds =
    Array.from(
      new Set(
        reports
          .filter(
            (
              report,
            ) =>
              report.target_type ===
              "user",
          )
          .map(
            (
              report,
            ) =>
              report.target_id,
          ),
      ),
    );


  const {
    data:
      reporters,
  } =
    reporterIds.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name, avatar_url",
          )
          .in(
            "user_id",
            reporterIds,
          )
      : {
          data: [],
        };


  const {
    data:
      targetUsers,
  } =
    targetUserIds.length
      ? await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username, display_name",
          )
          .in(
            "user_id",
            targetUserIds,
          )
      : {
          data: [],
        };


  const reporterMap =
    new Map(
      (
        reporters ??
        []
      ).map(
        (
          person,
        ) => [
          person.user_id,
          person,
        ],
      ),
    );


  const targetUserMap =
    new Map(
      (
        targetUsers ??
        []
      ).map(
        (
          person,
        ) => [
          person.user_id,
          person,
        ],
      ),
    );


  const pending =
    reports.filter(
      (
        report,
      ) =>
        report.status ===
        "pending",
    ).length;


  function targetHref(
    report: any,
  ) {
    if (
      report.target_type ===
      "post"
    ) {
      return `/social-connect/post/${report.target_id}`;
    }


    if (
      report.target_type ===
      "user"
    ) {
      const person =
        targetUserMap.get(
          report.target_id,
        );


      if (
        person?.username
      ) {
        return `/social-connect/u/${person.username}`;
      }
    }


    return null;
  }


  return (
    <main className="min-h-screen bg-[#f5f7fb] p-4 text-slate-950 sm:p-6 md:p-10 dark:bg-slate-950 dark:text-white">

      <div className="mx-auto max-w-5xl">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
              <ShieldCheck
                size={15}
              />

              Social Moderation
            </div>


            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d] dark:text-white">
              Reports
            </h1>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Review reports submitted by Social Connect users. Reporting does not automatically delete content or punish an account.
            </p>
          </div>


          <Link
            href="/admin/social"
            className="inline-flex items-center gap-2 font-black text-blue-700 dark:text-blue-400"
          >
            <ArrowLeft
              size={16}
            />

            Social Admin
          </Link>
        </div>


        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">

            <p className="text-3xl font-black text-amber-700 dark:text-amber-300">
              {
                pending
              }
            </p>

            <p className="mt-1 text-xs font-black uppercase tracking-wider text-amber-600">
              Pending
            </p>
          </div>


          <div className="rounded-[22px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

            <p className="text-3xl font-black text-slate-950 dark:text-white">
              {
                reports.length
              }
            </p>

            <p className="mt-1 text-xs font-black uppercase tracking-wider text-slate-400">
              Total Reports
            </p>
          </div>


          <div className="rounded-[22px] border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">

            <p className="text-3xl font-black text-blue-700 dark:text-blue-300">
              {
                reports.filter(
                  (
                    report,
                  ) =>
                    report.status !==
                    "pending",
                ).length
              }
            </p>

            <p className="mt-1 text-xs font-black uppercase tracking-wider text-blue-500">
              Processed
            </p>
          </div>
        </div>


        <div className="mt-8 space-y-4">

          {reports.map(
            (
              report,
            ) => {
              const reporter =
                reporterMap.get(
                  report.reporter_id,
                );


              const href =
                targetHref(
                  report,
                );


              return (
                <article
                  key={
                    report.id
                  }
                  className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600 dark:bg-red-950/30 dark:text-red-300">
                          <Flag
                            size={12}
                          />

                          {
                            report.target_type
                          }
                        </span>


                        <span
                          className={`rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusClasses(
                            report.status,
                          )}`}
                        >
                          {
                            report.status
                          }
                        </span>
                      </div>


                      <h2 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                        {
                          report.reason
                            .replaceAll(
                              "_",
                              " ",
                            )
                        }
                      </h2>


                      <p className="mt-2 text-sm text-slate-500">
                        Reported by{" "}

                        <span className="font-black text-slate-700 dark:text-slate-200">
                          {reporter?.display_name ??
                            reporter?.username ??
                            "Social Connect user"}
                        </span>

                        {reporter?.username &&
                          ` (@${reporter.username})`}
                      </p>


                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          report.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>


                    {href && (
                      <Link
                        href={
                          href
                        }
                        target="_blank"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-blue-700 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-slate-800"
                      >
                        Open Target

                        <ExternalLink
                          size={14}
                        />
                      </Link>
                    )}
                  </div>


                  {report.details && (
                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Reporter Details
                      </p>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {
                          report.details
                        }
                      </p>
                    </div>
                  )}


                  <div className="mt-5 break-all rounded-xl bg-slate-50 px-3 py-2 text-[10px] text-slate-400 dark:bg-slate-950">
                    Target ID:{" "}
                    {
                      report.target_id
                    }
                  </div>


                  <div className="mt-5 flex flex-wrap gap-2">

                    <form
                      action={
                        updateReportStatus
                      }
                    >
                      <input
                        type="hidden"
                        name="report_id"
                        value={
                          report.id
                        }
                      />

                      <button
                        name="status"
                        value="reviewed"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        <CheckCircle2
                          size={14}
                        />

                        Mark Reviewed
                      </button>
                    </form>


                    <form
                      action={
                        updateReportStatus
                      }
                    >
                      <input
                        type="hidden"
                        name="report_id"
                        value={
                          report.id
                        }
                      />

                      <button
                        name="status"
                        value="actioned"
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      >
                        <AlertTriangle
                          size={14}
                        />

                        Action Taken
                      </button>
                    </form>


                    <form
                      action={
                        updateReportStatus
                      }
                    >
                      <input
                        type="hidden"
                        name="report_id"
                        value={
                          report.id
                        }
                      />

                      <button
                        name="status"
                        value="dismissed"
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <XCircle
                          size={14}
                        />

                        Dismiss
                      </button>
                    </form>
                  </div>


                  {report.reviewed_at && (
                    <p className="mt-4 text-[10px] font-semibold text-slate-400">
                      Last reviewed{" "}
                      {new Date(
                        report.reviewed_at,
                      ).toLocaleString()}
                    </p>
                  )}
                </article>
              );
            },
          )}


          {reports.length ===
            0 && (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900">

              <Flag
                size={38}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-black text-slate-950 dark:text-white">
                No reports
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                User reports will appear here when submitted.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
