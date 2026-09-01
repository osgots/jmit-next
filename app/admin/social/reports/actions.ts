"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireManager,
} from "@/lib/auth/require-manager";


const allowedStatuses =
  new Set([
    "reviewed",
    "actioned",
    "dismissed",
  ]);


export async function updateReportStatus(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireManager();


  const reportId =
    String(
      formData.get(
        "report_id",
      ) ?? "",
    );


  const status =
    String(
      formData.get(
        "status",
      ) ?? "",
    );


  if (
    !reportId ||
    !allowedStatuses.has(
      status,
    )
  ) {
    return;
  }


  await supabase
    .from(
      "social_moderation_reports",
    )
    .update({
      status,

      reviewed_by:
        user.id,

      reviewed_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "id",
      reportId,
    );


  revalidatePath(
    "/admin/social/reports",
  );

  revalidatePath(
    "/admin/social",
  );
}
