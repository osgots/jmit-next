import {
  redirect,
} from "next/navigation";

import MfaChallengeForm from "@/components/mfa-challenge-form";
import { createClient } from "@/lib/supabase/server";


export default async function MfaPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const params =
    await searchParams;

  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    redirect(
      "/auth/login",
    );
  }


  const {
    data:
      assurance,
  } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();


  const nextPath =
    params.next &&
    params.next.startsWith(
      "/",
    ) &&
    !params.next.startsWith(
      "//",
    )
      ? params.next
      : "/";


  if (
    assurance?.currentLevel ===
    "aal2"
  ) {
    redirect(
      nextPath,
    );
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
      <MfaChallengeForm
        nextPath={
          nextPath
        }
      />
    </main>
  );
}
