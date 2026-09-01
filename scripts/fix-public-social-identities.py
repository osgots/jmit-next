from pathlib import Path
import re


def read(path):
    return Path(path).read_text(
        encoding="utf-8-sig"
    )


def write(path, value):
    Path(path).write_text(
        value,
        encoding="utf-8",
        newline="\n",
    )


def add_import(
    code,
    import_line,
    anchor,
):
    if (
        import_line
        in code
    ):
        return code


    if (
        anchor
        not in code
    ):
        print(
            "WARN import anchor missing:",
            anchor,
        )

        return code


    return code.replace(
        anchor,
        anchor
        + "\n"
        + import_line,
        1,
    )


HELPER_IMPORT = (
    'import { getPublicSocialIdentityMap, identityKind } '
    'from "@/lib/social/public-identity";'
)

PILL_IMPORT = (
    'import SocialRolePill '
    'from "@/components/social/social-role-pill";'
)


# ============================================================
# 1. PROFILE
# ============================================================

path = Path(
    "app/social-connect/u/[username]/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import { createClient } from "@/lib/supabase/server";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


profile_not_found = '''  if (!profile) {
    notFound();
  }'''


if (
    "const publicIdentity =" not in code
    and
    profile_not_found in code
):
    code = code.replace(
        profile_not_found,
        profile_not_found
        + '''


  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      [
        profile.user_id,
      ],
    );


  const publicIdentity =
    publicIdentityMap.get(
      profile.user_id,
    );''',
        1,
    )


code = re.sub(
    r'''const isAdmin\s*=\s*targetAppProfile\?\.role\s*===\s*"admin";''',
    '''const isAdmin =
    publicIdentity?.is_admin ===
      true ||
    targetAppProfile?.role ===
      "admin";''',
    code,
    count=1,
)


badge_pattern = re.compile(
    r'''  const badge =\s*
    isAdmin[\s\S]*?
          : null;''',
    re.MULTILINE,
)


badge_replacement = '''  const badge =
    publicIdentity?.badge_kind ??
    (
      isAdmin
        ? "admin"
        : blue
          ? "blue"
          : profile.account_type ===
              "student"
            ? "student"
            : null
    );'''


code = badge_pattern.sub(
    badge_replacement,
    code,
    count=1,
)


title_pattern = re.compile(
    r'''  const accountTitle =\s*
    isAdmin[\s\S]*?
          : "Visitor";''',
    re.MULTILINE,
)


code = title_pattern.sub(
    '''  const accountTitle =
    publicIdentity?.account_title ??
    (
      isAdmin
        ? "Administrator"
        : blue
          ? "Verified Student"
          : profile.account_type ===
              "student"
            ? "Student"
            : "Visitor"
    );''',
    code,
    count=1,
)


# Replace old hand-built account tag with universal tag.
role_span = re.compile(
    r'''                  <span
                    className=\{`rounded-lg px-3 py-1\.5 text-\[10px\] font-black uppercase tracking-\[0\.13em\] \$\{[\s\S]*?
                  </span>''',
    re.MULTILINE,
)


if (
    "<SocialRolePill"
    not in code
):
    code = role_span.sub(
        '''                  <SocialRolePill
                    kind={
                      badge ??
                      "visitor"
                    }
                  />''',
        code,
        count=1,
    )


# Explicit dark visibility instead of depending on globals.
code = code.replace(
    'className="min-h-screen bg-[#f5f7fb]"',
    'className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950"',
    1,
)

code = code.replace(
    'className="overflow-hidden border-y border-slate-200 bg-white shadow-sm sm:rounded-[30px] sm:border"',
    'className="overflow-hidden border-y border-slate-200 bg-white shadow-sm sm:rounded-[30px] sm:border dark:border-slate-800 dark:bg-slate-900"',
    1,
)

code = code.replace(
    'text-[#071a3d] sm:text-4xl"',
    'text-[#071a3d] dark:text-white sm:text-4xl"',
)


write(
    path,
    code,
)

print(
    "✓ Profile identity fixed"
)


# ============================================================
# 2. FEED
# ============================================================

path = Path(
    "app/social-connect/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import { createClient } from "@/lib/supabase/server";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


likes_anchor = '''  const likes =
    likesData ?? [];'''


if (
    "const publicIdentityMap =" not in code
    and
    likes_anchor in code
):
    code = code.replace(
        likes_anchor,
        '''  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      profiles.map(
        (
          item,
        ) =>
          item.user_id,
      ),
    );


'''
        + likes_anchor,
        1,
    )


get_badge_pattern = re.compile(
    r'''  function getBadge\(
[\s\S]*?
  \}

  const \{
    data: savedRows,''',
    re.MULTILINE,
)


get_badge_replacement = '''  function getBadge(
    profile:
      | any
      | undefined,
  ) {
    if (!profile) {
      return null;
    }


    const identity =
      publicIdentityMap.get(
        profile.user_id,
      );


    const kind =
      identityKind(
        identity,
        profile.account_type,
      );


    return kind ===
      "visitor"
      ? null
      : kind;
  }


  const {
    data: savedRows,'''


code = get_badge_pattern.sub(
    get_badge_replacement,
    code,
    count=1,
)


# Replace unreliable old text identity under feed username.
old_feed_identity = re.compile(
    r'''                            \{roleMap\.get\([\s\S]*?
                            \)\}''',
    re.MULTILINE,
)


# Safer insertion: add the pill just after the username row.
username_end = '''                            </p>
'''


# Only add once around author identity section.
needle = '''                            <p className="text-xs text-slate-400">
                              @
                              {author?.username ??
                                "unknown"}
                            </p>'''


if (
    needle in code
    and
    "identityKind(\n                                  publicIdentityMap.get(\n                                    author?.user_id" not in code
):
    code = code.replace(
        needle,
        needle
        + '''

                            {badge && (
                              <div className="mt-1">
                                <SocialRolePill
                                  kind={
                                    badge
                                  }
                                  compact
                                />
                              </div>
                            )}''',
        1,
    )


code = code.replace(
    'className="truncate text-sm font-black text-slate-900"',
    'className="truncate text-sm font-black text-slate-900 dark:text-white"',
)


write(
    path,
    code,
)

print(
    "✓ Feed identity fixed"
)


# ============================================================
# 3. SEARCH
# ============================================================

path = Path(
    "app/social-connect/search/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import { createClient } from "@/lib/supabase/server";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


follow_anchor = '''  const followingSet =
    new Set('''


if (
    "const publicIdentityMap =" not in code
    and
    follow_anchor in code
):
    code = code.replace(
        follow_anchor,
        '''  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      userIds,
    );


'''
        + follow_anchor,
        1,
    )


code = re.sub(
    r'''              const isAdmin =\s*
                roleMap\.get\(\s*
                  profile\.user_id,\s*
                \) ===\s*
                "admin";''',
    '''              const publicIdentity =
                publicIdentityMap.get(
                  profile.user_id,
                );


              const isAdmin =
                publicIdentity?.is_admin ===
                  true;''',
    code,
    count=1,
)


code = re.sub(
    r'''              const blue =\s*
                blueSet\.has\(\s*
                  profile\.user_id,\s*
                \);''',
    '''              const blue =
                publicIdentity?.is_blue_verified ===
                  true;''',
    code,
    count=1,
)


search_badge = re.compile(
    r'''              const badge =\s*
                isAdmin[\s\S]*?
                      : null;''',
    re.MULTILINE,
)


code = search_badge.sub(
    '''              const resolvedKind =
                identityKind(
                  publicIdentity,
                  profile.account_type,
                );


              const badge =
                resolvedKind ===
                  "visitor"
                  ? null
                  : resolvedKind;''',
    code,
    count=1,
)


old_role_text = re.compile(
    r'''                      <p className="mt-1 text-\[10px\] font-black uppercase tracking-wider text-slate-400">
[\s\S]*?
                      </p>''',
    re.MULTILINE,
)


code = old_role_text.sub(
    '''                      <div className="mt-1">
                        <SocialRolePill
                          kind={
                            identityKind(
                              publicIdentity,
                              profile.account_type,
                            )
                          }
                          compact
                        />
                      </div>''',
    code,
    count=1,
)


code = code.replace(
    'className="truncate font-black text-slate-900"',
    'className="truncate font-black text-slate-900 dark:text-white"',
)


write(
    path,
    code,
)

print(
    "✓ Search identity fixed"
)


# ============================================================
# 4/5. FOLLOWERS + FOLLOWING
# ============================================================

for filename in [
    "app/social-connect/u/[username]/followers/page.tsx",
    "app/social-connect/u/[username]/following/page.tsx",
]:

    path = Path(
        filename
    )

    code = read(
        path
    )


    code = add_import(
        code,
        HELPER_IMPORT,
        'import { createClient } from "@/lib/supabase/server";',
    )

    code = add_import(
        code,
        PILL_IMPORT,
        'import SocialBadge from "@/components/social/social-badge";',
    )


    anchor = '''  const followingSet =
    new Set('''


    if (
        "const publicIdentityMap =" not in code
        and
        anchor in code
    ):
        code = code.replace(
            anchor,
            '''  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      ids,
    );


'''
            + anchor,
            1,
        )


    identity_block = re.compile(
        r'''              const isAdmin =[\s\S]*?
                      : null;

              const isMe =''',
        re.MULTILINE,
    )


    code = identity_block.sub(
        '''              const publicIdentity =
                publicIdentityMap.get(
                  person.user_id,
                );


              const resolvedKind =
                identityKind(
                  publicIdentity,
                  person.account_type,
                );


              const badge =
                resolvedKind ===
                  "visitor"
                  ? null
                  : resolvedKind;


              const isMe =''',
        code,
        count=1,
    )


    username_block = '''                      <p className="text-xs text-slate-400">
                        @
                        {
                          person.username
                        }
                      </p>'''


    if (
        username_block in code
        and
        "<SocialRolePill" not in code
    ):
        code = code.replace(
            username_block,
            username_block
            + '''

                      <div className="mt-1">
                        <SocialRolePill
                          kind={
                            resolvedKind
                          }
                          compact
                        />
                      </div>''',
            1,
        )


    code = code.replace(
        'className="truncate font-black text-slate-950"',
        'className="truncate font-black text-slate-950 dark:text-white"',
    )


    write(
        path,
        code,
    )


print(
    "✓ Followers/following identity fixed"
)


# ============================================================
# 6. POST VIEWER + COMMENT IDENTITIES
# ============================================================

path = Path(
    "app/social-connect/post/[id]/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import { createClient,\n} from "@/lib/supabase/server";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


author_not_found = '''  if (!author) {
    notFound();
  }'''


if (
    "const authorPublicIdentity =" not in code
    and
    author_not_found in code
):
    code = code.replace(
        author_not_found,
        author_not_found
        + '''


  const authorIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      [
        author.user_id,
      ],
    );


  const authorPublicIdentity =
    authorIdentityMap.get(
      author.user_id,
    );''',
        1,
    )


code = re.sub(
    r'''  const authorAdmin =\s*
    authorAppProfile\?\.role ===\s*
    "admin";''',
    '''  const authorAdmin =
    authorPublicIdentity?.is_admin ===
      true ||
    authorAppProfile?.role ===
      "admin";''',
    code,
    count=1,
)


author_badge = re.compile(
    r'''  const authorBadge =\s*
    authorAdmin[\s\S]*?
          : null;''',
    re.MULTILINE,
)


code = author_badge.sub(
    '''  const authorResolvedKind =
    identityKind(
      authorPublicIdentity,
      author.account_type,
    );


  const authorBadge =
    authorResolvedKind ===
      "visitor"
      ? null
      : authorResolvedKind;''',
    code,
    count=1,
)


comment_ids_anchor = '''  const {
    data:
      commentProfiles,'''


if (
    "const commentIdentityMap =" not in code
    and
    comment_ids_anchor in code
):
    code = code.replace(
        comment_ids_anchor,
        '''  const commentIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      commentAuthorIds,
    );


'''
        + comment_ids_anchor,
        1,
    )


comment_badge = re.compile(
    r'''                      const badge =
                        commentRoleMap\.get\([\s\S]*?
                              : null;''',
    re.MULTILINE,
)


code = comment_badge.sub(
    '''                      const commentIdentity =
                        commentIdentityMap.get(
                          person.user_id,
                        );


                      const resolvedKind =
                        identityKind(
                          commentIdentity,
                          person.account_type,
                        );


                      const badge =
                        resolvedKind ===
                          "visitor"
                          ? null
                          : resolvedKind;''',
    code,
    count=1,
)


author_username = '''                  <p className="text-xs text-slate-500">
                    @
                    {
                      author.username
                    }
                  </p>'''


if (
    author_username in code
    and
    "kind={\n                        authorResolvedKind" not in code
):
    code = code.replace(
        author_username,
        author_username
        + '''

                  <div className="mt-1">
                    <SocialRolePill
                      kind={
                        authorResolvedKind
                      }
                      compact
                    />
                  </div>''',
        1,
    )


# Add compact role tag to comments beside badge.
comment_badge_end = '''                              {badge && (
                                <SocialBadge
                                  kind={
                                    badge
                                  }
                                  size={
                                    15
                                  }
                                />
                              )}'''


if (
    comment_badge_end in code
):
    code = code.replace(
        comment_badge_end,
        comment_badge_end
        + '''

                              <SocialRolePill
                                kind={
                                  resolvedKind
                                }
                                compact
                              />''',
        1,
    )


write(
    path,
    code,
)

print(
    "✓ Post/comment identity fixed"
)


# ============================================================
# 7. NOTIFICATIONS
# ============================================================

path = Path(
    "app/social-connect/notifications/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


unread_anchor = '''  const unread =
    ('''


if (
    "const publicIdentityMap =" not in code
    and
    unread_anchor in code
):
    code = code.replace(
        unread_anchor,
        '''  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      actors,
    );


'''
        + unread_anchor,
        1,
    )


notification_badge = re.compile(
    r'''              const badge =
                !actor[\s\S]*?
                        : null;''',
    re.MULTILINE,
)


code = notification_badge.sub(
    '''              const publicIdentity =
                actor
                  ? publicIdentityMap.get(
                      actor.user_id,
                    )
                  : undefined;


              const resolvedKind =
                identityKind(
                  publicIdentity,
                  actor?.account_type,
                );


              const badge =
                !actor ||
                resolvedKind ===
                  "visitor"
                  ? null
                  : resolvedKind;''',
    code,
    count=1,
)


notification_badge_end = '''                        {badge && (
                          <SocialBadge
                            kind={
                              badge
                            }
                            size={
                              16
                            }
                          />
                        )}'''


if (
    notification_badge_end in code
):
    code = code.replace(
        notification_badge_end,
        notification_badge_end
        + '''

                        {actor && (
                          <SocialRolePill
                            kind={
                              resolvedKind
                            }
                            compact
                          />
                        )}''',
        1,
    )


write(
    path,
    code,
)

print(
    "✓ Notification identities fixed"
)


# ============================================================
# 8. CHATS INBOX
# ============================================================

path = Path(
    "app/social-connect/chats/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


can_post_anchor = '''  const canPost =
    isAdmin ||'''


if (
    "const publicIdentityMap =" not in code
    and
    can_post_anchor in code
):
    code = code.replace(
        can_post_anchor,
        '''  const publicIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      Array.from(
        new Set([
          ...otherIds,
          ...searchResults.map(
            (
              item,
            ) =>
              item.user_id,
          ),
        ]),
      ),
    );


'''
        + can_post_anchor,
        1,
    )


badge_for = re.compile(
    r'''  function badgeFor\(
    person: any,
  \) \{[\s\S]*?
    return null;
  \}''',
    re.MULTILINE,
)


code = badge_for.sub(
    '''  function badgeFor(
    person: any,
  ) {
    const kind =
      identityKind(
        publicIdentityMap.get(
          person.user_id,
        ),
        person.account_type,
      );


    return kind ===
      "visitor"
      ? null
      : kind;
  }''',
    code,
    count=1,
)


write(
    path,
    code,
)

print(
    "✓ Chats inbox identity fixed"
)


# ============================================================
# 9. CHAT HEADER
# ============================================================

path = Path(
    "app/social-connect/chats/[id]/page.tsx"
)

code = read(
    path
)


code = add_import(
    code,
    HELPER_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)

code = add_import(
    code,
    PILL_IMPORT,
    'import SocialBadge from "@/components/social/social-badge";',
)


other_not_found = '''  if (!otherProfile) {
    notFound();
  }'''


if (
    "const otherPublicIdentity =" not in code
    and
    other_not_found in code
):
    code = code.replace(
        other_not_found,
        other_not_found
        + '''


  const otherIdentityMap =
    await getPublicSocialIdentityMap(
      supabase,
      [
        otherId,
      ],
    );


  const otherPublicIdentity =
    otherIdentityMap.get(
      otherId,
    );''',
        1,
    )


code = re.sub(
    r'''  const isAdmin =\s*
    appProfile\?\.role ===\s*
    "admin";''',
    '''  const isAdmin =
    otherPublicIdentity?.is_admin ===
      true ||
    appProfile?.role ===
      "admin";''',
    code,
    count=1,
)


chat_badge = re.compile(
    r'''  const badge =\s*
    isAdmin[\s\S]*?
          : null;''',
    re.MULTILINE,
)


code = chat_badge.sub(
    '''  const resolvedKind =
    identityKind(
      otherPublicIdentity,
      otherProfile.account_type,
    );


  const badge =
    resolvedKind ===
      "visitor"
      ? null
      : resolvedKind;''',
    code,
    count=1,
)


chat_username = '''              <p className="truncate text-xs text-slate-500">
                @
                {
                  otherProfile.username
                }
              </p>'''


if (
    chat_username in code
):
    code = code.replace(
        chat_username,
        chat_username
        + '''

              <div className="mt-1">
                <SocialRolePill
                  kind={
                    resolvedKind
                  }
                  compact
                />
              </div>''',
        1,
    )


write(
    path,
    code,
)

print(
    "✓ Chat header identity fixed"
)


print()
print(
    "=============================================="
)
print(
    "PUBLIC IDENTITY PATCH COMPLETE"
)
print(
    "=============================================="
)
