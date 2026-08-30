"use server";

import { randomUUID } from "crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireManager } from "@/lib/auth/require-manager";

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${base || "notice"}-${randomUUID().slice(0, 8)}`;
}

function parseExpiry(value: string) {
  if (!value) {
    return null;
  }

  return new Date(
    `${value}T23:59:59.999Z`,
  ).toISOString();
}

export async function createNotice(formData: FormData) {
  const {
    supabase,
    user,
  } = await requireManager();

  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const category = String(
    formData.get("category") ?? "General",
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
    formData.get("is_published") === "on";

  const isPinned =
    formData.get("is_pinned") === "on";

  if (
    title.length < 3 ||
    title.length > 200
  ) {
    redirect("/admin/notices?error=title");
  }

  const { error } = await supabase
    .from("notices")
    .insert({
      title,
      slug: makeSlug(title),
      category,
      summary: summary || null,
      body: body || null,
      file_url: fileUrl || null,
      expires_at: parseExpiry(expiresAt),
      is_published: isPublished,
      is_pinned: isPinned,
      published_at: isPublished
        ? new Date().toISOString()
        : null,
      created_by: user.id,
    });

  if (error) {
    console.error(
      "Notice creation error:",
      error,
    );

    redirect(
      "/admin/notices?error=create",
    );
  }

  revalidatePath("/");
  revalidatePath("/notices");
  revalidatePath("/admin");
  revalidatePath("/admin/notices");

  redirect(
    "/admin/notices?status=created",
  );
}

export async function deleteNotice(formData: FormData) {
  const { supabase } =
    await requireManager();

  const id = String(
    formData.get("id") ?? "",
  );

  if (!id) {
    redirect("/admin/notices");
  }

  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Notice delete error:",
      error,
    );

    redirect(
      "/admin/notices?error=delete",
    );
  }

  revalidatePath("/");
  revalidatePath("/notices");
  revalidatePath("/admin");
  revalidatePath("/admin/notices");

  redirect(
    "/admin/notices?status=deleted",
  );
}

export async function togglePublish(
  formData: FormData,
) {
  const { supabase } =
    await requireManager();

  const id = String(
    formData.get("id") ?? "",
  );

  if (!id) {
    redirect("/admin/notices");
  }

  const { data: notice } =
    await supabase
      .from("notices")
      .select(
        "is_published, published_at",
      )
      .eq("id", id)
      .single();

  if (!notice) {
    redirect("/admin/notices");
  }

  const nextPublished =
    !notice.is_published;

  const { error } = await supabase
    .from("notices")
    .update({
      is_published: nextPublished,

      published_at: nextPublished
        ? notice.published_at ||
          new Date().toISOString()
        : notice.published_at,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Notice publish error:",
      error,
    );

    redirect(
      "/admin/notices?error=update",
    );
  }

  revalidatePath("/");
  revalidatePath("/notices");
  revalidatePath("/admin");
  revalidatePath("/admin/notices");

  redirect("/admin/notices");
}

export async function togglePin(
  formData: FormData,
) {
  const { supabase } =
    await requireManager();

  const id = String(
    formData.get("id") ?? "",
  );

  if (!id) {
    redirect("/admin/notices");
  }

  const { data: notice } =
    await supabase
      .from("notices")
      .select("is_pinned")
      .eq("id", id)
      .single();

  if (!notice) {
    redirect("/admin/notices");
  }

  const { error } = await supabase
    .from("notices")
    .update({
      is_pinned:
        !notice.is_pinned,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Notice pin error:",
      error,
    );

    redirect(
      "/admin/notices?error=update",
    );
  }

  revalidatePath("/");
  revalidatePath("/notices");
  revalidatePath("/admin");
  revalidatePath("/admin/notices");

  redirect("/admin/notices");
}
