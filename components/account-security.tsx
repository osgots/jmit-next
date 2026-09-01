"use client";

import {
  Check,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";


type Enrolment = {
  factorId: string;
  qr: string;
  secret: string;
};


export default function AccountSecurity({
  currentEmail,
}: {
  currentEmail: string;
}) {
  const [
    supabase,
  ] =
    useState(() =>
      createClient(),
    );

  const [
    email,
    setEmail,
  ] =
    useState(
      currentEmail,
    );

  const [
    currentPassword,
    setCurrentPassword,
  ] =
    useState("");

  const [
    newPassword,
    setNewPassword,
  ] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState("");

  const [
    emailMessage,
    setEmailMessage,
  ] =
    useState("");

  const [
    passwordMessage,
    setPasswordMessage,
  ] =
    useState("");

  const [
    securityMessage,
    setSecurityMessage,
  ] =
    useState("");

  const [
    busy,
    setBusy,
  ] =
    useState(false);

  const [
    verifiedFactorId,
    setVerifiedFactorId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    enrolment,
    setEnrolment,
  ] =
    useState<Enrolment | null>(
      null,
    );

  const [
    totpCode,
    setTotpCode,
  ] =
    useState("");


  async function loadFactors() {
    const {
      data,
      error,
    } =
      await supabase.auth.mfa.listFactors();


    if (error) {
      setSecurityMessage(
        error.message,
      );

      return;
    }


    const verified =
      data.totp.find(
        (
          factor,
        ) =>
          factor.status ===
          "verified",
      );


    setVerifiedFactorId(
      verified?.id ??
        null,
    );
  }


  useEffect(() => {
    loadFactors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  async function changeEmail(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setEmailMessage("");


    const normalized =
      email.trim().toLowerCase();


    if (
      !normalized ||
      normalized ===
        currentEmail.toLowerCase()
    ) {
      setEmailMessage(
        "Enter a different email address.",
      );

      setBusy(false);

      return;
    }


    const {
      error,
    } =
      await supabase.auth.updateUser({
        email:
          normalized,
      });


    if (error) {
      setEmailMessage(
        error.message,
      );
    } else {
      setEmailMessage(
        "Email change requested. Check the confirmation emails sent by Supabase.",
      );
    }


    setBusy(false);
  }


  async function changePassword(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setBusy(true);
    setPasswordMessage("");


    if (
      newPassword.length <
      8
    ) {
      setPasswordMessage(
        "New password must contain at least 8 characters.",
      );

      setBusy(false);

      return;
    }


    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordMessage(
        "New passwords do not match.",
      );

      setBusy(false);

      return;
    }


    const {
      error,
    } =
      await supabase.auth.updateUser({
        password:
          newPassword,

        current_password:
          currentPassword,
      });


    if (error) {
      setPasswordMessage(
        error.message,
      );
    } else {
      setPasswordMessage(
        "Password changed successfully.",
      );

      setCurrentPassword(
        "",
      );

      setNewPassword(
        "",
      );

      setConfirmPassword(
        "",
      );
    }


    setBusy(false);
  }


  async function begin2FA() {
    setBusy(true);
    setSecurityMessage("");


    try {
      const factors =
        await supabase.auth.mfa.listFactors();


      if (
        factors.error
      ) {
        throw factors.error;
      }


      for (
        const factor
        of factors.data.totp
      ) {
        if (
          factor.status !==
          "verified"
        ) {
          await supabase.auth.mfa.unenroll({
            factorId:
              factor.id,
          });
        }
      }


      const {
        data,
        error,
      } =
        await supabase.auth.mfa.enroll({
          factorType:
            "totp",

          friendlyName:
            "JMIT Next Authenticator",
        });


      if (error) {
        throw error;
      }


      setEnrolment({
        factorId:
          data.id,

        qr:
          data.totp.qr_code,

        secret:
          data.totp.secret,
      });


      setSecurityMessage(
        "Scan the QR code with an authenticator app, then enter the 6-digit code.",
      );

    } catch (
      caught
    ) {
      setSecurityMessage(
        caught instanceof Error
          ? caught.message
          : "Unable to start 2FA.",
      );
    }


    setBusy(false);
  }


  async function verify2FA() {
    if (
      !enrolment
    ) {
      return;
    }


    if (
      !/^\d{6}$/.test(
        totpCode,
      )
    ) {
      setSecurityMessage(
        "Enter the 6-digit authenticator code.",
      );

      return;
    }


    setBusy(true);
    setSecurityMessage("");


    const {
      error,
    } =
      await supabase.auth.mfa.challengeAndVerify({
        factorId:
          enrolment.factorId,

        code:
          totpCode,
      });


    if (error) {
      setSecurityMessage(
        error.message,
      );

      setBusy(false);

      return;
    }


    setSecurityMessage(
      "Two-factor authentication is now enabled.",
    );

    setEnrolment(
      null,
    );

    setTotpCode(
      "",
    );

    await loadFactors();

    setBusy(false);
  }


  async function disable2FA() {
    if (
      !verifiedFactorId
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "Disable two-factor authentication for this account?",
      );


    if (!confirmed) {
      return;
    }


    setBusy(true);
    setSecurityMessage("");


    const {
      error,
    } =
      await supabase.auth.mfa.unenroll({
        factorId:
          verifiedFactorId,
      });


    if (error) {
      setSecurityMessage(
        error.message,
      );
    } else {
      setVerifiedFactorId(
        null,
      );

      setSecurityMessage(
        "Two-factor authentication has been disabled.",
      );
    }


    setBusy(false);
  }


  return (
    <div className="space-y-6">

      {/* EMAIL */}

      <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <Mail
              size={20}
            />
          </div>

          <div>
            <h2 className="font-black text-slate-950 dark:text-white">
              Change Email
            </h2>

            <p className="text-sm text-slate-500">
              Update the email used to sign in.
            </p>
          </div>
        </div>


        <form
          onSubmit={
            changeEmail
          }
          className="mt-5 space-y-4"
        >
          <input
            type="email"
            required
            value={
              email
            }
            onChange={(
              event,
            ) =>
              setEmail(
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          {emailMessage && (
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {
                emailMessage
              }
            </p>
          )}

          <button
            disabled={
              busy
            }
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            Update Email
          </button>
        </form>
      </section>


      {/* PASSWORD */}

      <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <KeyRound
              size={20}
            />
          </div>

          <div>
            <h2 className="font-black text-slate-950 dark:text-white">
              Change Password
            </h2>

            <p className="text-sm text-slate-500">
              Use a strong, unique password.
            </p>
          </div>
        </div>


        <form
          onSubmit={
            changePassword
          }
          className="mt-5 space-y-4"
        >
          <input
            type="password"
            required
            value={
              currentPassword
            }
            onChange={(
              event,
            ) =>
              setCurrentPassword(
                event.target.value,
              )
            }
            placeholder="Current password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <input
            type="password"
            required
            value={
              newPassword
            }
            onChange={(
              event,
            ) =>
              setNewPassword(
                event.target.value,
              )
            }
            placeholder="New password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <input
            type="password"
            required
            value={
              confirmPassword
            }
            onChange={(
              event,
            ) =>
              setConfirmPassword(
                event.target.value,
              )
            }
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />


          {passwordMessage && (
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {
                passwordMessage
              }
            </p>
          )}


          <button
            disabled={
              busy
            }
            className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            Change Password
          </button>
        </form>
      </section>


      {/* 2FA */}

      <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck
              size={20}
            />
          </div>

          <div className="flex-1">
            <h2 className="font-black text-slate-950 dark:text-white">
              Two-Factor Authentication
            </h2>

            <p className="text-sm text-slate-500">
              Protect sign-in with an authenticator app.
            </p>
          </div>

          {verifiedFactorId && (
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Enabled
            </span>
          )}
        </div>


        {!verifiedFactorId &&
          !enrolment && (
            <button
              type="button"
              disabled={
                busy
              }
              onClick={
                begin2FA
              }
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              {busy ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <ShieldCheck
                  size={16}
                />
              )}

              Enable 2FA
            </button>
          )}


        {enrolment && (
          <div className="mt-6 space-y-5">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-white">
              <img
                src={
                  enrolment.qr
                }
                alt="Authenticator QR code"
                className="mx-auto h-56 w-56"
              />
            </div>


            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Manual Setup Secret
              </p>

              <code className="mt-2 block overflow-x-auto rounded-xl bg-slate-100 p-3 text-sm text-slate-950 dark:bg-slate-950 dark:text-slate-100">
                {
                  enrolment.secret
                }
              </code>
            </div>


            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              value={
                totpCode
              }
              onChange={(
                event,
              ) =>
                setTotpCode(
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
              placeholder="6-digit code"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-center text-xl font-black tracking-[0.3em] text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />


            <button
              type="button"
              onClick={
                verify2FA
              }
              disabled={
                busy
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              <Check
                size={16}
              />

              Verify & Enable
            </button>
          </div>
        )}


        {verifiedFactorId && (
          <button
            type="button"
            onClick={
              disable2FA
            }
            disabled={
              busy
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            <ShieldOff
              size={16}
            />

            Disable 2FA
          </button>
        )}


        {securityMessage && (
          <p className="mt-4 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">
            {
              securityMessage
            }
          </p>
        )}
      </section>
    </div>
  );
}
