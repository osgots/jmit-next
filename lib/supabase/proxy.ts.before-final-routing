import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) =>
              request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({
              name,
              value,
              options,
            }) =>
              supabaseResponse.cookies.set(
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
   * Refresh/verify the Supabase session.
   *
   * IMPORTANT:
   * Public JMIT pages must NOT require login.
   * Individual protected areas such as /admin
   * and Campus Connect private actions perform
   * their own authorization checks.
   */
  await supabase.auth.getClaims();

  return supabaseResponse;
}
