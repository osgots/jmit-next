"use client";

import {
  GraduationCap,
  Mail,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";


const SESSION_KEY =
  "jmit-next-campus-email-advice-seen";


export default function CampusEmailNotice() {
  const [
    showPopup,
    setShowPopup,
  ] =
    useState(false);


  useEffect(() => {
    try {
      const seen =
        sessionStorage.getItem(
          SESSION_KEY,
        );

      if (seen !== "1") {
        setShowPopup(
          true,
        );
      }
    } catch {
      /*
       * If sessionStorage is unavailable,
       * simply show the notice.
       */
      setShowPopup(
        true,
      );
    }
  }, []);


  function closePopup() {
    setShowPopup(
      false,
    );

    try {
      sessionStorage.setItem(
        SESSION_KEY,
        "1",
      );
    } catch {
      // Nothing else needed.
    }
  }


  return (
    <>
      {/* =====================================================
          PERMANENT INLINE REMINDER
          Visible on both mobile and desktop.
          ===================================================== */}

      <div className="mb-5 rounded-2xl border border-cyan-300/70 bg-cyan-50 p-4 shadow-sm dark:border-cyan-500/30 dark:bg-cyan-950/25">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300">
            <GraduationCap
              size={20}
            />
          </div>


          <div className="min-w-0">

            <p className="text-sm font-black text-slate-950 dark:text-white">
              JMIT Campus Student?
            </p>


            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6 dark:text-slate-300">

              Please use your{" "}

              <strong className="font-black text-cyan-800 dark:text-cyan-300">
                official college email
              </strong>

              {" "}when available.

            </p>


            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">

              Visitors and other users may continue with their personal email.

            </p>
          </div>
        </div>
      </div>


      {/* =====================================================
          POPUP
          Shows once per browser session.
          ===================================================== */}

      {showPopup && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="campus-email-notice-title"
          onClick={
            closePopup
          }
        >

          <div
            className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-cyan-300/60 bg-white shadow-2xl dark:border-cyan-500/30 dark:bg-[#0c1425]"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            {/* top accent */}

            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />


            <button
              type="button"
              onClick={
                closePopup
              }
              aria-label="Close campus email notice"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X
                size={19}
              />
            </button>


            <div className="p-6 sm:p-7">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">

                <GraduationCap
                  size={28}
                />

              </div>


              <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-400">
                Campus Account Advice
              </p>


              <h2
                id="campus-email-notice-title"
                className="mt-2 pr-8 text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-[28px] dark:text-white"
              >
                Are you a JMIT student?
              </h2>


              <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-[15px] dark:text-slate-300">

                If you are a campus student, please use your{" "}

                <strong className="font-black text-blue-700 dark:text-cyan-300">
                  official college email
                </strong>

                {" "}when it is available to you.

              </p>


              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">

                <div className="flex items-start gap-3">

                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-600 dark:text-cyan-400"
                  />

                  <div>

                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Not a campus student?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                      Visitors, alumni and other users may use a personal email address.
                    </p>

                  </div>
                </div>
              </div>


              <p className="mt-4 text-[11px] leading-5 text-slate-400 sm:text-xs">
                This is only a recommendation. JMIT Next does not force you to use a specific email provider.
              </p>


              <button
                type="button"
                onClick={
                  closePopup
                }
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition active:scale-[0.99]"
              >
                Got it — Continue
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
