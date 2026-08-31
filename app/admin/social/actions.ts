"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireManager,
} from "@/lib/auth/require-manager";

export async function setVerification(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireManager();

  const userId =
    String(
      formData.get("user_id") ??
        "",
    );

  const badgeType =
    String(
      formData.get(
        "badge_type",
      ) ?? "verified",
    );

  if (!userId) {
    return;
  }

  if (
    badgeType === "remove"
  ) {
    await supabase
      .from(
        "social_verifications",
      )
      .delete()
      .eq(
        "user_id",
        userId,
      );
  } else if (
    [
      "verified",
      "official",
      "admin",
    ].includes(
      badgeType,
    )
  ) {
    await supabase
      .from(
        "social_verifications",
      )
      .upsert({
        user_id:
          userId,

        badge_type:
          badgeType,

        verified_by:
          user.id,

        verified_at:
          new Date()
            .toISOString(),
      });
  }

  revalidatePath(
    "/admin/social",
  );

  revalidatePath(
    "/social-connect",
  );
}
