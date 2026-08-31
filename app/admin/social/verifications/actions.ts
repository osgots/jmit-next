"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireManager,
} from "@/lib/auth/require-manager";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

async function removeEvidence(
  path: string,
) {
  const admin =
    createAdminClient();

  await admin.storage
    .from(
      "social-verification",
    )
    .remove([
      path,
    ]);
}

export async function approveVerification(
  formData: FormData,
) {
  const {
    user,
  } =
    await requireManager();

  const admin =
    createAdminClient();

  const applicationId =
    String(
      formData.get(
        "application_id",
      ) ?? "",
    );

  const rollNumber =
    String(
      formData.get(
        "verified_roll_number",
      ) ?? "",
    ).trim();

  const note =
    String(
      formData.get(
        "review_note",
      ) ?? "",
    ).trim();

  if (
    !applicationId ||
    !rollNumber
  ) {
    return;
  }

  const {
    data: application,
  } =
    await admin
      .from(
        "social_verification_applications",
      )
      .select(
        "user_id, evidence_path, status",
      )
      .eq(
        "id",
        applicationId,
      )
      .single();

  if (
    !application ||
    application.status !==
      "pending"
  ) {
    return;
  }

  await admin
    .from(
      "social_blue_verifications",
    )
    .upsert({
      user_id:
        application.user_id,

      verified_roll_number:
        rollNumber,

      approved_by:
        user.id,

      note:
        note || null,

      approved_at:
        new Date()
          .toISOString(),
    });

  await admin
    .from(
      "social_verification_applications",
    )
    .update({
      status:
        "approved",

      review_note:
        note || null,

      reviewed_by:
        user.id,

      reviewed_at:
        new Date()
          .toISOString(),

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "id",
      applicationId,
    );

  /*
   * Sensitive identity selfie is no
   * longer required after final review.
   */
  await removeEvidence(
    application.evidence_path,
  );

  revalidatePath(
    "/admin/social/verifications",
  );

  revalidatePath(
    "/admin/social/users",
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function rejectVerification(
  formData: FormData,
) {
  const {
    user,
  } =
    await requireManager();

  const admin =
    createAdminClient();

  const applicationId =
    String(
      formData.get(
        "application_id",
      ) ?? "",
    );

  const decision =
    String(
      formData.get(
        "decision",
      ) ?? "",
    );

  const note =
    String(
      formData.get(
        "review_note",
      ) ?? "",
    ).trim();

  if (
    !applicationId ||
    ![
      "rejected",
      "needs_resubmission",
    ].includes(
      decision,
    )
  ) {
    return;
  }

  const {
    data: application,
  } =
    await admin
      .from(
        "social_verification_applications",
      )
      .select(
        "evidence_path",
      )
      .eq(
        "id",
        applicationId,
      )
      .single();

  await admin
    .from(
      "social_verification_applications",
    )
    .update({
      status:
        decision,

      review_note:
        note || null,

      reviewed_by:
        user.id,

      reviewed_at:
        new Date()
          .toISOString(),

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "id",
      applicationId,
    );

  if (
    application?.evidence_path
  ) {
    await removeEvidence(
      application.evidence_path,
    );
  }

  revalidatePath(
    "/admin/social/verifications",
  );
}
