"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireManager,
} from "@/lib/auth/require-manager";


export async function markMessageRead(
  formData: FormData,
) {
  const {
    supabase,
  } =
    await requireManager();


  const id =
    String(
      formData.get(
        "id",
      ) ?? "",
    );


  if (!id) {
    return;
  }


  await supabase
    .from(
      "contact_messages",
    )
    .update({
      is_read:
        true,
    })
    .eq(
      "id",
      id,
    );


  revalidatePath(
    "/admin/messages",
  );

  revalidatePath(
    "/admin",
  );
}


export async function deleteMessage(
  formData: FormData,
) {
  const {
    supabase,
  } =
    await requireManager();


  const id =
    String(
      formData.get(
        "id",
      ) ?? "",
    );


  if (!id) {
    return;
  }


  await supabase
    .from(
      "contact_messages",
    )
    .delete()
    .eq(
      "id",
      id,
    );


  revalidatePath(
    "/admin/messages",
  );

  revalidatePath(
    "/admin",
  );
}
