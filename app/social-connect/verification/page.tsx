import {
  BadgeCheck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  redirect,
} from "next/navigation";

import Link from "next/link";

import SiteHeader from "@/components/site-header";
import VerificationApplicationForm from "@/components/social/verification-application-form";
import { requireSocialProfile } from "@/lib/social/require-user";

export default async function VerificationPage() {
  const {
    supabase,
    user,
    profile,
  } =
    await requireSocialProfile();

  if (
    profile.account_type !==
    "student"
  ) {
    redirect(
      "/social-connect",
    );
  }

  const {
    data: blue,
  } =
    await supabase
      .from(
        "social_blue_verifications",
      )
      .select(
        "verified_roll_number, approved_at",
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  const {
    data: latest,
  } =
    await supabase
      .from(
        "social_verification_applications",
      )
      .select(
        "status, review_note, submitted_at, reviewed_at",
      )
      .eq(
        "user_id",
        user.id,
      )
      .order(
        "submitted_at",
        {
          ascending:
            false,
        },
      )
      .limit(1)
      .maybeSingle();

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-5 py-14">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
          <ShieldCheck
            size={15}
          />
          Account Verification
        </div>

        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#071a3d]">
          Apply for a blue tick.
        </h1>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          Your current yellow badge
          identifies a student account.
          The blue badge is granted only
          after an administrator reviews
          your identity evidence.
        </p>

        {blue ? (
          <div className="mt-8 rounded-[28px] border border-blue-200 bg-blue-50 p-7">
            <BadgeCheck
              size={30}
              className="text-blue-700"
            />

            <h2 className="mt-4 text-xl font-black text-blue-950">
              Account Verified
            </h2>

            <p className="mt-2 text-sm text-blue-700">
              Verified Roll Number:
              {" "}
              <strong>
                {
                  blue.verified_roll_number
                }
              </strong>
            </p>
          </div>
        ) : latest?.status ===
          "pending" ? (
          <div className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-7">
            <Clock3
              size={28}
              className="text-amber-600"
            />

            <h2 className="mt-4 text-xl font-black text-amber-950">
              Pending Admin Review
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-700">
              Your verification evidence
              has been submitted.
            </p>
          </div>
        ) : (
          <>
            {latest?.status ===
              "rejected" && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-center gap-2 font-black text-red-700">
                  <XCircle
                    size={18}
                  />

                  Application Rejected
                </div>

                {latest.review_note && (
                  <p className="mt-2 text-sm text-red-600">
                    {
                      latest.review_note
                    }
                  </p>
                )}
              </div>
            )}

            {latest?.status ===
              "needs_resubmission" && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 font-black text-amber-700">
                  <CheckCircle2
                    size={18}
                  />

                  New Photo Required
                </div>

                {latest.review_note && (
                  <p className="mt-2 text-sm text-amber-700">
                    {
                      latest.review_note
                    }
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <VerificationApplicationForm
                userId={
                  user.id
                }
              />
            </div>
          </>
        )}

        <Link
          href="/social-connect"
          className="mt-6 block text-center text-sm font-black text-blue-700"
        >
          Back to Social Connect
        </Link>
      </div>
    </main>
  );
}
