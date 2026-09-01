"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requireManager,
} from "@/lib/auth/require-manager";


export async function updateAdminIdentity(
  formData: FormData,
) {
  const {
    supabase,
    user,
    profile,
  } =
    await requireManager();


  if (
    profile.role !==
    "admin"
  ) {
    redirect(
      "/admin/settings?error=permission",
    );
  }


  const name =
    String(
      formData.get(
        "admin_display_name",
      ) ?? "",
    ).trim();


  if (
    name.length < 2 ||
    name.length > 60
  ) {
    redirect(
      "/admin/settings?error=name",
    );
  }


  const {
    error,
  } =
    await supabase
      .from(
        "site_settings",
      )
      .upsert({
        key:
          "admin_display_name",

        value:
          name,

        updated_at:
          new Date()
            .toISOString(),

        updated_by:
          user.id,
      });


  if (error) {
    console.error(
      error,
    );

    redirect(
      "/admin/settings?error=database",
    );
  }


  /*
   * Keep the normal application identity synchronized.
   *
   * IMPORTANT:
   * social_profiles is intentionally NOT updated.
   */

  await supabase
    .from(
      "profiles",
    )
    .update({
      full_name:
        name,
    })
    .eq(
      "id",
      user.id,
    );


  await supabase
    .from(
      "site_profiles",
    )
    .update({
      display_name:
        name,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "user_id",
      user.id,
    );


  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/settings",
  );

  revalidatePath(
    "/account",
  );


  redirect(
    "/admin/settings?status=saved",
  );
}
