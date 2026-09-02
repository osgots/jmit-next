from pathlib import Path
import re


path = Path(
    "app/social-connect/u/[username]/page.tsx"
)

code = path.read_text(
    encoding="utf-8-sig"
)


start_marker = '''  const {
    data: posts,
  } =
    await supabase'''


end_marker = '''  const isOwnProfile =
    user?.id ===
    profile.user_id;'''


start = code.find(
    start_marker
)

end = code.find(
    end_marker,
    start,
)


if (
    start == -1
    or
    end == -1
):
    print(
        "INFO: Profile queries already optimized or anchors changed."
    )

else:

    replacement = '''  const [
    postsResult,
    followersResult,
    followingResult,
  ] =
    await Promise.all([

      supabase
        .from(
          "social_posts",
        )
        .select("*")
        .eq(
          "user_id",
          profile.user_id,
        )
        .eq(
          "status",
          "active",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        ),


      supabase
        .from(
          "social_follows",
        )
        .select("*", {
          count:
            "exact",

          head:
            true,
        })
        .eq(
          "following_id",
          profile.user_id,
        ),


      supabase
        .from(
          "social_follows",
        )
        .select("*", {
          count:
            "exact",

          head:
            true,
        })
        .eq(
          "follower_id",
          profile.user_id,
        ),
    ]);


  const posts =
    postsResult.data ??
    [];


  const followers =
    followersResult.count ??
    0;


  const following =
    followingResult.count ??
    0;


'''

    code = (
        code[:start]
        + replacement
        + code[end:]
    )


    path.write_text(
        code,
        encoding="utf-8",
        newline="\n",
    )


    print(
        "✓ Profile API queries now run in parallel."
    )
