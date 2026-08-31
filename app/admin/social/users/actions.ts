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

import {
  createAdminClient,
} from "@/lib/supabase/admin";

const PRIMARY_ADMIN_EMAIL =
  process.env.PRIMARY_ADMIN_EMAIL
    ?.trim()
    .toLowerCase();

async function getTargetUser(
  userId: string,
) {
  const admin =
    createAdminClient();

  const {
    data,
  } =
    await admin.auth.admin
      .getUserById(
        userId,
      );

  return (
    data.user ??
    null
  );
}

function isPrimaryAdmin(
  email?:
    | string
    | null,
) {
  return Boolean(
    email &&
      PRIMARY_ADMIN_EMAIL &&
      email.toLowerCase() ===
        PRIMARY_ADMIN_EMAIL,
  );
}

export async function setAccountStatus(
  formData: FormData,
) {
  const {
    user,
  } =
    await requireManager();

  const admin =
    createAdminClient();

  const userId =
    String(
      formData.get(
        "user_id",
      ) ?? "",
    );

  const status =
    String(
      formData.get(
        "status",
      ) ?? "",
    );

  if (
    !userId ||
    ![
      "active",
      "suspended",
      "banned",
    ].includes(
      status,
    )
  ) {
    return;
  }

  const target =
    await getTargetUser(
      userId,
    );

  if (
    !target ||
    isPrimaryAdmin(
      target.email,
    )
  ) {
    return;
  }

  const {
    data: role,
  } =
    await admin
      .from("profiles")
      .select("role")
      .eq(
        "id",
        userId,
      )
      .maybeSingle();

  if (
    role?.role ===
    "admin"
  ) {
    return;
  }

  await admin
    .from(
      "social_account_controls",
    )
    .upsert({
      user_id:
        userId,

      status,

      updated_by:
        user.id,

      updated_at:
        new Date()
          .toISOString(),
    });

  revalidatePath(
    "/admin/social/users",
  );

  revalidatePath(
    "/social-connect",
  );
}

export async function revokeBlueTick(
  formData: FormData,
) {
  await requireManager();

  const admin =
    createAdminClient();

  const userId =
    String(
      formData.get(
        "user_id",
      ) ?? "",
    );

  if (!userId) {
    return;
  }

  const target =
    await getTargetUser(
      userId,
    );

  if (
    !target ||
    isPrimaryAdmin(
      target.email,
    )
  ) {
    return;
  }

  await admin
    .from(
      "social_blue_verifications",
    )
    .delete()
    .eq(
      "user_id",
      userId,
    );

  revalidatePath(
    "/admin/social/users",
  );

  revalidatePath(
    "/social-connect",
  );
}

export async function deleteSocialUser(
  formData: FormData,
) {
  const {
    user,
  } =
    await requireManager();

  const admin =
    createAdminClient();

  const userId =
    String(
      formData.get(
        "user_id",
      ) ?? "",
    );

  if (
    !userId ||
    userId === user.id
  ) {
    return;
  }

  const target =
    await getTargetUser(
      userId,
    );

  if (
    !target ||
    isPrimaryAdmin(
      target.email,
    )
  ) {
    return;
  }

  const {
    data: role,
  } =
    await admin
      .from("profiles")
      .select("role")
      .eq(
        "id",
        userId,
      )
      .maybeSingle();

  if (
    role?.role ===
    "admin"
  ) {
    return;
  }

  await admin.auth.admin
    .deleteUser(
      userId,
    );

  revalidatePath(
    "/admin/social/users",
  );

  redirect(
    "/admin/social/users?deleted=1",
  );
}
