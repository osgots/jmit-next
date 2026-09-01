"use server";

import {
  randomUUID,
} from "crypto";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requireManager,
} from "@/lib/auth/require-manager";


type Kind =
  | "events"
  | "departments"
  | "programs";


function validKind(
  value: string,
): value is Kind {
  return [
    "events",
    "departments",
    "programs",
  ].includes(
    value,
  );
}


function slugify(
  value: string,
) {
  const base =
    value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      )
      .slice(
        0,
        70,
      );


  return `${base || "item"}-${randomUUID().slice(
    0,
    7,
  )}`;
}


export async function saveManagedContent(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireManager();


  const kind =
    String(
      formData.get(
        "kind",
      ) ?? "",
    );


  if (
    !validKind(
      kind,
    )
  ) {
    redirect(
      "/admin",
    );
  }


  const id =
    String(
      formData.get(
        "id",
      ) ?? "",
    );


  const now =
    new Date()
      .toISOString();


  let payload:
    Record<
      string,
      unknown
    >;


  if (
    kind ===
    "events"
  ) {
    const title =
      String(
        formData.get(
          "title",
        ) ?? "",
      ).trim();


    if (
      title.length <
      2
    ) {
      redirect(
        `/admin/content/${kind}?error=title`,
      );
    }


    const date =
      String(
        formData.get(
          "event_date",
        ) ?? "",
      );


    payload = {
      title,

      summary:
        String(
          formData.get(
            "summary",
          ) ?? "",
        ).trim() ||
        null,

      body:
        String(
          formData.get(
            "body",
          ) ?? "",
        ).trim() ||
        null,

      location:
        String(
          formData.get(
            "location",
          ) ?? "",
        ).trim() ||
        null,

      event_date:
        date
          ? new Date(
              date,
            ).toISOString()
          : null,

      is_published:
        formData.get(
          "enabled",
        ) ===
        "on",

      updated_at:
        now,
    };


    if (!id) {
      payload.slug =
        slugify(
          title,
        );
    }

  } else if (
    kind ===
    "departments"
  ) {
    const name =
      String(
        formData.get(
          "name",
        ) ?? "",
      ).trim();


    if (
      name.length <
      2
    ) {
      redirect(
        `/admin/content/${kind}?error=name`,
      );
    }


    payload = {
      name,

      short_name:
        String(
          formData.get(
            "short_name",
          ) ?? "",
        ).trim() ||
        null,

      description:
        String(
          formData.get(
            "description",
          ) ?? "",
        ).trim() ||
        null,

      href:
        String(
          formData.get(
            "href",
          ) ?? "",
        ).trim() ||
        null,

      is_active:
        formData.get(
          "enabled",
        ) ===
        "on",

      updated_at:
        now,
    };


    if (!id) {
      payload.slug =
        slugify(
          name,
        );
    }

  } else {
    const name =
      String(
        formData.get(
          "name",
        ) ?? "",
      ).trim();


    if (
      name.length <
      2
    ) {
      redirect(
        `/admin/content/${kind}?error=name`,
      );
    }


    payload = {
      name,

      department_name:
        String(
          formData.get(
            "department_name",
          ) ?? "",
        ).trim() ||
        null,

      duration:
        String(
          formData.get(
            "duration",
          ) ?? "",
        ).trim() ||
        null,

      description:
        String(
          formData.get(
            "description",
          ) ?? "",
        ).trim() ||
        null,

      href:
        String(
          formData.get(
            "href",
          ) ?? "",
        ).trim() ||
        null,

      is_active:
        formData.get(
          "enabled",
        ) ===
        "on",

      updated_at:
        now,
    };


    if (!id) {
      payload.slug =
        slugify(
          name,
        );
    }
  }


  if (id) {

    const {
      error,
    } =
      await supabase
        .from(
          kind,
        )
        .update(
          payload,
        )
        .eq(
          "id",
          id,
        );


    if (error) {
      console.error(
        error,
      );

      redirect(
        `/admin/content/${kind}?error=save`,
      );
    }

  } else {

    const {
      error,
    } =
      await supabase
        .from(
          kind,
        )
        .insert({
          ...payload,

          created_by:
            user.id,

          created_at:
            now,
        });


    if (error) {
      console.error(
        error,
      );

      redirect(
        `/admin/content/${kind}?error=create`,
      );
    }
  }


  revalidatePath(
    "/admin",
  );

  revalidatePath(
    `/admin/content/${kind}`,
  );


  redirect(
    `/admin/content/${kind}?status=saved`,
  );
}


export async function deleteManagedContent(
  formData: FormData,
) {
  const {
    supabase,
  } =
    await requireManager();


  const kind =
    String(
      formData.get(
        "kind",
      ) ?? "",
    );


  const id =
    String(
      formData.get(
        "id",
      ) ?? "",
    );


  if (
    !validKind(
      kind,
    ) ||
    !id
  ) {
    redirect(
      "/admin",
    );
  }


  const {
    error,
  } =
    await supabase
      .from(
        kind,
      )
      .delete()
      .eq(
        "id",
        id,
      );


  if (error) {
    console.error(
      error,
    );
  }


  revalidatePath(
    "/admin",
  );

  revalidatePath(
    `/admin/content/${kind}`,
  );


  redirect(
    `/admin/content/${kind}`,
  );
}
