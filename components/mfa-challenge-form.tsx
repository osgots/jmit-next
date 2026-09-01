"use client";

import {
  Loader2,
  LockKeyhole,
  LogOut,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


export default function MfaChallengeForm({
  nextPath = "/",
}: {
  nextPath?: string;
}) {
  const router =
    useRouter();

  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    code,
    setCode,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    busy,
    setBusy,
  ] =
    useState(false);


  async function verify(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setError("");


    const factors =
      await supabase.auth.mfa.listFactors();


    if (
      factors.error
    ) {
      setError(
        factors.error.message,
      );

      setBusy(false);

      return;
    }


    const factor =
      factors.data.totp.find(
        (
          item,
        ) =>
          item.status ===
          "verified",
      );


    if (!factor) {
      setError(
        "No verified authenticator is configured.",
      );

      setBusy(false);

      return;
    }


    const {
      error:
        verifyError,
    } =
      await supabase.auth.mfa.challengeAndVerify({
        factorId:
          factor.id,

        code,
      });


    if (
      verifyError
    ) {
      setError(
        verifyError.message,
      );

      setBusy(false);

      return;
    }


    const safeNext =
      nextPath.startsWith(
        "/",
      ) &&
      !nextPath.startsWith(
        "//",
      )
        ? nextPath
        : "/";


    router.replace(
      safeNext,
    );

    router.refresh();
  }


  async function logout() {
    await supabase.auth.signOut();

    window.location.href =
      "/auth/login";
  }


  return (
    <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        <LockKeyhole
          size={26}
        />
      </div>


      <h1 className="mt-5 text-center text-2xl font-black text-slate-950 dark:text-white">
        Two-Factor Authentication
      </h1>

      <p className="mt-2 text-center text-sm leading-6 text-slate-500">
        Enter the 6-digit code from your authenticator app.
      </p>


      <form
        onSubmit={
          verify
        }
        className="mt-6 space-y-4"
      >
        <input
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          value={
            code
          }
          onChange={(
            event,
          ) =>
            setCode(
              event.target.value
                .replace(
                  /\D/g,
                  "",
                )
                .slice(
                  0,
                  6,
                ),
            )
          }
          placeholder="000000"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-center text-2xl font-black tracking-[0.4em] text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />


        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {
              error
            }
          </p>
        )}


        <button
          disabled={
            busy ||
            code.length !==
              6
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-black text-white disabled:opacity-50"
        >
          {busy && (
            <Loader2
              size={17}
              className="animate-spin"
            />
          )}

          Verify Login
        </button>
      </form>


      <button
        type="button"
        onClick={
          logout
        }
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 dark:border-slate-700 dark:text-slate-300"
      >
        <LogOut
          size={15}
        />

        Sign Out
      </button>
    </div>
  );
}
