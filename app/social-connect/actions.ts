"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  requireSocialProfile,
} from "@/lib/social/require-user";

export async function toggleLike(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const postId =
    String(
      formData.get("post_id") ??
        "",
    );

  if (!postId) {
    return;
  }

  const {
    data: existing,
  } =
    await supabase
      .from("social_likes")
      .select("post_id")
      .eq(
        "post_id",
        postId,
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (existing) {
    await supabase
      .from("social_likes")
      .delete()
      .eq(
        "post_id",
        postId,
      )
      .eq(
        "user_id",
        user.id,
      );
  } else {
    await supabase
      .from("social_likes")
      .insert({
        post_id:
          postId,

        user_id:
          user.id,
      });
  }

  revalidatePath(
    "/social-connect",
  );
}


export async function addComment(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const postId =
    String(
      formData.get("post_id") ??
        "",
    );

  const body =
    String(
      formData.get("body") ??
        "",
    ).trim();

  if (
    !postId ||
    body.length < 1 ||
    body.length > 1000
  ) {
    return;
  }

  await supabase
    .from("social_comments")
    .insert({
      post_id:
        postId,

      user_id:
        user.id,

      body,
    });

  revalidatePath(
    "/social-connect",
  );
}


export async function toggleFollow(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const target =
    String(
      formData.get(
        "target_user_id",
      ) ?? "",
    );

  const username =
    String(
      formData.get("username") ??
        "",
    );

  if (
    !target ||
    target === user.id
  ) {
    return;
  }

  const {
    data: existing,
  } =
    await supabase
      .from("social_follows")
      .select("follower_id")
      .eq(
        "follower_id",
        user.id,
      )
      .eq(
        "following_id",
        target,
      )
      .maybeSingle();

  if (existing) {
    await supabase
      .from("social_follows")
      .delete()
      .eq(
        "follower_id",
        user.id,
      )
      .eq(
        "following_id",
        target,
      );
  } else {
    await supabase
      .from("social_follows")
      .insert({
        follower_id:
          user.id,

        following_id:
          target,
      });
  }

  revalidatePath(
    `/social-connect/u/${username}`,
  );
}


export async function socialLogout() {
  const {
    supabase,
  } =
    await requireSocialProfile();

  await supabase.auth.signOut();

  redirect(
    "/social-connect",
  );
}
