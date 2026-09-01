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


function safePath(
  value:
    | FormDataEntryValue
    | null,
) {
  const path =
    String(
      value ?? "",
    );

  if (
    path.startsWith("/") &&
    !path.startsWith("//")
  ) {
    return path;
  }

  return "/social-connect";
}


async function notifyUser(
  supabase: any,
  {
    userId,
    actorId,
    type,
    entityId,
    message,
  }: {
    userId: string;
    actorId: string;
    type:
      | "follow"
      | "like"
      | "comment"
      | "mention"
      | "verification"
      | "message"
      | "system";
    entityId?: string;
    message?: string;
  },
) {
  if (
    !userId ||
    userId === actorId
  ) {
    return;
  }

  await supabase
    .from(
      "social_notifications",
    )
    .insert({
      user_id:
        userId,

      actor_id:
        actorId,

      notification_type:
        type,

      entity_id:
        entityId ??
        null,

      message:
        message ??
        null,
    });
}


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
      formData.get(
        "post_id",
      ) ?? "",
    );

  const returnTo =
    safePath(
      formData.get(
        "return_to",
      ),
    );

  if (!postId) {
    return;
  }


  const {
    data: existing,
  } =
    await supabase
      .from(
        "social_likes",
      )
      .select(
        "post_id",
      )
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
      .from(
        "social_likes",
      )
      .delete()
      .eq(
        "post_id",
        postId,
      )
      .eq(
        "user_id",
        user.id,
      );

    await supabase
      .from(
        "social_notifications",
      )
      .delete()
      .eq(
        "actor_id",
        user.id,
      )
      .eq(
        "notification_type",
        "like",
      )
      .eq(
        "entity_id",
        postId,
      );

  } else {
    const {
      data: post,
    } =
      await supabase
        .from(
          "social_posts",
        )
        .select(
          "user_id",
        )
        .eq(
          "id",
          postId,
        )
        .maybeSingle();


    const {
      error,
    } =
      await supabase
        .from(
          "social_likes",
        )
        .insert({
          post_id:
            postId,

          user_id:
            user.id,
        });


    if (
      !error &&
      post?.user_id
    ) {
      await notifyUser(
        supabase,
        {
          userId:
            post.user_id,

          actorId:
            user.id,

          type:
            "like",

          entityId:
            postId,

          message:
            "liked your post",
        },
      );
    }
  }


  revalidatePath(
    returnTo,
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function toggleSave(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const postId =
    String(
      formData.get(
        "post_id",
      ) ?? "",
    );

  const returnTo =
    safePath(
      formData.get(
        "return_to",
      ),
    );


  if (!postId) {
    return;
  }


  const {
    data: existing,
  } =
    await supabase
      .from(
        "social_saved_posts",
      )
      .select(
        "post_id",
      )
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "post_id",
        postId,
      )
      .maybeSingle();


  if (existing) {
    await supabase
      .from(
        "social_saved_posts",
      )
      .delete()
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "post_id",
        postId,
      );

  } else {
    await supabase
      .from(
        "social_saved_posts",
      )
      .insert({
        user_id:
          user.id,

        post_id:
          postId,
      });
  }


  revalidatePath(
    returnTo,
  );

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
      formData.get(
        "post_id",
      ) ?? "",
    );

  const body =
    String(
      formData.get(
        "body",
      ) ?? "",
    ).trim();

  const returnTo =
    safePath(
      formData.get(
        "return_to",
      ),
    );


  if (
    !postId ||
    body.length < 1 ||
    body.length > 1000
  ) {
    return;
  }


  const {
    data: post,
  } =
    await supabase
      .from(
        "social_posts",
      )
      .select(
        "user_id",
      )
      .eq(
        "id",
        postId,
      )
      .maybeSingle();


  const {
    data: comment,
    error,
  } =
    await supabase
      .from(
        "social_comments",
      )
      .insert({
        post_id:
          postId,

        user_id:
          user.id,

        body,
      })
      .select(
        "id",
      )
      .single();


  if (
    !error &&
    post?.user_id
  ) {
    await notifyUser(
      supabase,
      {
        userId:
          post.user_id,

        actorId:
          user.id,

        type:
          "comment",

        entityId:
          postId,

        message:
          "commented on your post",
      },
    );
  }


  /*
   * Mention notifications.
   * Username format is lowercase,
   * numbers, periods and underscores.
   */
  if (
    !error &&
    comment
  ) {
    const mentions =
      Array.from(
        new Set(
          (
            body.match(
              /@([a-z0-9._]{3,30})/g,
            ) ?? []
          ).map(
            (value) =>
              value
                .slice(1)
                .toLowerCase(),
          ),
        ),
      );


    if (
      mentions.length
    ) {
      const {
        data:
          mentionedProfiles,
      } =
        await supabase
          .from(
            "social_profiles",
          )
          .select(
            "user_id, username",
          )
          .in(
            "username",
            mentions,
          );


      for (
        const profile
        of mentionedProfiles ??
        []
      ) {
        await notifyUser(
          supabase,
          {
            userId:
              profile.user_id,

            actorId:
              user.id,

            type:
              "mention",

            entityId:
              postId,

            message:
              "mentioned you in a comment",
          },
        );
      }
    }
  }


  revalidatePath(
    returnTo,
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function editComment(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const commentId =
    String(
      formData.get(
        "comment_id",
      ) ?? "",
    );

  const body =
    String(
      formData.get(
        "body",
      ) ?? "",
    ).trim();

  const returnTo =
    safePath(
      formData.get(
        "return_to",
      ),
    );


  if (
    !commentId ||
    body.length < 1 ||
    body.length > 1000
  ) {
    return;
  }


  await supabase
    .from(
      "social_comments",
    )
    .update({
      body,

      updated_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "id",
      commentId,
    )
    .eq(
      "user_id",
      user.id,
    );


  revalidatePath(
    returnTo,
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function deleteComment(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const commentId =
    String(
      formData.get(
        "comment_id",
      ) ?? "",
    );

  const returnTo =
    safePath(
      formData.get(
        "return_to",
      ),
    );


  if (!commentId) {
    return;
  }


  await supabase
    .from(
      "social_comments",
    )
    .delete()
    .eq(
      "id",
      commentId,
    )
    .eq(
      "user_id",
      user.id,
    );


  revalidatePath(
    returnTo,
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function deletePost(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const postId =
    String(
      formData.get(
        "post_id",
      ) ?? "",
    );


  if (!postId) {
    return;
  }


  const {
    data: post,
  } =
    await supabase
      .from(
        "social_posts",
      )
      .select(
        "id, user_id, media_path",
      )
      .eq(
        "id",
        postId,
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();


  if (!post) {
    return;
  }


  const {
    error,
  } =
    await supabase
      .from(
        "social_posts",
      )
      .delete()
      .eq(
        "id",
        postId,
      )
      .eq(
        "user_id",
        user.id,
      );


  if (
    !error &&
    post.media_path
  ) {
    await supabase.storage
      .from(
        "social-media",
      )
      .remove([
        post.media_path,
      ]);
  }


  redirect(
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
      formData.get(
        "username",
      ) ?? "",
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
      .from(
        "social_follows",
      )
      .select(
        "follower_id",
      )
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
      .from(
        "social_follows",
      )
      .delete()
      .eq(
        "follower_id",
        user.id,
      )
      .eq(
        "following_id",
        target,
      );


    await supabase
      .from(
        "social_notifications",
      )
      .delete()
      .eq(
        "actor_id",
        user.id,
      )
      .eq(
        "user_id",
        target,
      )
      .eq(
        "notification_type",
        "follow",
      );

  } else {
    const {
      error,
    } =
      await supabase
        .from(
          "social_follows",
        )
        .insert({
          follower_id:
            user.id,

          following_id:
            target,
        });


    if (!error) {
      await notifyUser(
        supabase,
        {
          userId:
            target,

          actorId:
            user.id,

          type:
            "follow",

          message:
            "started following you",
        },
      );
    }
  }


  revalidatePath(
    `/social-connect/u/${username}`,
  );

  revalidatePath(
    "/social-connect",
  );
}


export async function markNotificationRead(
  formData: FormData,
) {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();

  const id =
    String(
      formData.get("id") ??
        "",
    );


  if (!id) {
    return;
  }


  await supabase
    .from(
      "social_notifications",
    )
    .update({
      is_read:
        true,
    })
    .eq(
      "id",
      id,
    )
    .eq(
      "user_id",
      user.id,
    );


  revalidatePath(
    "/social-connect/notifications",
  );
}


export async function markAllNotificationsRead() {
  const {
    supabase,
    user,
  } =
    await requireSocialProfile();


  await supabase
    .from(
      "social_notifications",
    )
    .update({
      is_read:
        true,
    })
    .eq(
      "user_id",
      user.id,
    )
    .eq(
      "is_read",
      false,
    );


  revalidatePath(
    "/social-connect/notifications",
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
