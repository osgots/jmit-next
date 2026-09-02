import {
  createClient,
} from "@supabase/supabase-js";


export const dynamic =
  "force-dynamic";


export const runtime =
  "nodejs";


export async function GET(
  request: Request,
) {
  const expected =
    process.env
      .STORY_CLEANUP_SECRET;


  const authorization =
    request.headers.get(
      "authorization",
    );


  if (
    !expected ||
    authorization !==
      `Bearer ${expected}`
  ) {
    return Response.json(
      {
        error:
          "Unauthorized",
      },
      {
        status:
          401,
      },
    );
  }


  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;


  const serviceKey =
    process.env
      .SUPABASE_SERVICE_ROLE_KEY;


  if (
    !url ||
    !serviceKey
  ) {
    return Response.json(
      {
        error:
          "Server configuration missing.",
      },
      {
        status:
          500,
      },
    );
  }


  const supabase =
    createClient(
      url,
      serviceKey,
      {
        auth: {
          persistSession:
            false,

          autoRefreshToken:
            false,
        },
      },
    );


  let deleted =
    0;


  for (
    let batch =
      0;
    batch <
      10;
    batch++
  ) {

    const {
      data:
        expired,
      error,
    } =
      await supabase
        .from(
          "social_stories",
        )
        .select(
          "id, media_path",
        )
        .lte(
          "expires_at",
          new Date()
            .toISOString(),
        )
        .limit(
          100,
        );


    if (error) {
      return Response.json(
        {
          error:
            error.message,
        },
        {
          status:
            500,
        },
      );
    }


    if (
      !expired?.length
    ) {
      break;
    }


    const paths =
      expired
        .map(
          (
            story,
          ) =>
            story.media_path,
        )
        .filter(
          Boolean,
        );


    if (
      paths.length
    ) {
      await supabase.storage
        .from(
          "social-stories",
        )
        .remove(
          paths,
        );
    }


    const ids =
      expired.map(
        (
          story,
        ) =>
          story.id,
      );


    const {
      error:
        deleteError,
    } =
      await supabase
        .from(
          "social_stories",
        )
        .delete()
        .in(
          "id",
          ids,
        );


    if (
      deleteError
    ) {
      return Response.json(
        {
          error:
            deleteError.message,
        },
        {
          status:
            500,
        },
      );
    }


    deleted +=
      ids.length;


    if (
      expired.length <
      100
    ) {
      break;
    }

  }


  return Response.json({
    ok:
      true,

    deleted,
  });
}
