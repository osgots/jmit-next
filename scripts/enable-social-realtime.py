from pathlib import Path


# ============================================================
# POST PAGE
# ============================================================

post_path = Path(
    "app/social-connect/post/[id]/page.tsx"
)

post = post_path.read_text(
    encoding="utf-8-sig"
)


import_line = (
    'import { PostRealtimeRefresh } '
    'from "@/components/social/realtime-refresh";'
)


if (
    import_line
    not in post
):

    anchor = (
        'import SiteHeader from "@/components/site-header";'
    )


    if anchor not in post:
        raise SystemExit(
            "Post SiteHeader import not found."
        )


    post = post.replace(
        anchor,
        anchor
        + "\n"
        + import_line,
        1,
    )


if (
    "<PostRealtimeRefresh"
    not in post
):

    anchor = "<SiteHeader />"


    if anchor not in post:
        raise SystemExit(
            "Post SiteHeader JSX not found."
        )


    post = post.replace(
        anchor,
        '''<SiteHeader />

      <PostRealtimeRefresh
        postId={
          post.id
        }
      />''',
        1,
    )


post_path.write_text(
    post,
    encoding="utf-8",
    newline="\n",
)


# ============================================================
# PROFILE PAGE
# ============================================================

profile_path = Path(
    "app/social-connect/u/[username]/page.tsx"
)

profile = profile_path.read_text(
    encoding="utf-8-sig"
)


import_line = (
    'import { ProfileRealtimeRefresh } '
    'from "@/components/social/realtime-refresh";'
)


if (
    import_line
    not in profile
):

    anchor = (
        'import SiteHeader from "@/components/site-header";'
    )


    if anchor not in profile:
        raise SystemExit(
            "Profile SiteHeader import not found."
        )


    profile = profile.replace(
        anchor,
        anchor
        + "\n"
        + import_line,
        1,
    )


if (
    "<ProfileRealtimeRefresh"
    not in profile
):

    anchor = "<SiteHeader />"


    if anchor not in profile:
        raise SystemExit(
            "Profile SiteHeader JSX not found."
        )


    profile = profile.replace(
        anchor,
        '''<SiteHeader />

      <ProfileRealtimeRefresh
        userId={
          profile.user_id
        }
      />''',
        1,
    )


profile_path.write_text(
    profile,
    encoding="utf-8",
    newline="\n",
)


print(
    "✓ Post realtime enabled"
)

print(
    "✓ Profile realtime enabled"
)
