import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  hasEnvVars,
} from "../utils";


function copyCookies(
  from:
    NextResponse,
  to:
    NextResponse,
) {
  from.cookies
    .getAll()
    .forEach(
      (
        cookie,
      ) => {
        to.cookies.set(
          cookie,
        );
      },
    );

  return to;
}


export async function updateSession(
  request:
    NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });


  if (!hasEnvVars) {
    return response;
  }


  const supabase =
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) =>
                request.cookies.set(
                  name,
                  value,
                ),
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) =>
                response.cookies.set(
                  name,
                  value,
                  options,
                ),
            );
          },
        },
      },
    );


  /*
   * Refresh / validate the Supabase session.
   * Public JMIT Next routes remain public.
   */
  const {
    data:
      claimsData,
  } =
    await supabase.auth.getClaims();


  const authenticated =
    Boolean(
      claimsData?.claims?.sub,
    );


  if (
    authenticated
  ) {
    const pathname =
      request.nextUrl.pathname;


    const onMfaPage =
      pathname.startsWith(
        "/auth/mfa",
      );


    if (!onMfaPage) {
      const {
        data:
          assurance,
      } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();


      if (
        assurance?.nextLevel ===
          "aal2" &&
        assurance.currentLevel !==
          "aal2"
      ) {
        const url =
          request.nextUrl.clone();

        const original =
          `${request.nextUrl.pathname}${request.nextUrl.search}`;


        url.pathname =
          "/auth/mfa";

        url.search =
          "";

        url.searchParams.set(
          "next",
          original,
        );


        return copyCookies(
          response,
          NextResponse.redirect(
            url,
          ),
        );
      }
    }
  }


  return response;
}
