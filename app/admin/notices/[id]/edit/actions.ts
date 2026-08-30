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

function parseExpiry(
  value: string,
) {
  if (!value) {
    return null;
  }

  return new Date(
    `${value}T23:59:59.999Z`,
  ).toISOString();
}

export async function updateNotice(
  formData: FormData,
) {
  const { supabase } =
    await requireManager();

  const id = String(
    formData.get("id") ?? "",
  );

  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const category = String(
    formData.get("category") ??
      "General",
  ).trim();

  const summary = String(
    formData.get("summary") ?? "",
  ).trim();

  const body = String(
    formData.get("body") ?? "",
  ).trim();

  const fileUrl = String(
    formData.get("file_url") ?? "",
  ).trim();

  const expiresAt = String(
    formData.get("expires_at") ?? "",
  ).trim();

  const isPublished =
    formData.get("is_published") ===
    "on";

  const isPinned =
    formData.get("is_pinned") ===
    "on";

  if (
    !id ||
    title.length < 3 ||
    title.length > 200
  ) {
    redirect(
      `/admin/notices/${id}/edit?error=validation`,
    );
  }

  const {
    data: existing,
  } = await supabase
    .from("notices")
    .select(
      "published_at",
    )
    .eq("id", id)
    .single();

  if (!existing) {
    redirect(
      "/admin/notices",
    );
  }

  const { error } =
    await supabase
      .from("notices")
      .update({
        title,
        category,
        summary:
          summary || null,
        body:
          body || null,
        file_url:
          fileUrl || null,
        expires_at:
          parseExpiry(
            expiresAt,
          ),
        is_published:
          isPublished,
        is_pinned:
          isPinned,

        published_at:
          isPublished
            ? existing.published_at ||
              new Date().toISOString()
            : existing.published_at,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    console.error(
      "Notice update error:",
      error,
    );

    redirect(
      `/admin/notices/${id}/edit?error=update`,
    );
  }

  revalidatePath("/");
  revalidatePath("/notices");
  revalidatePath(
    "/admin/notices",
  );
  revalidatePath("/admin");

  redirect(
    "/admin/notices?status=updated",
  );
}
