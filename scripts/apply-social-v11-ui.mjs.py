from pathlib import Path
import re


def load(path):
    return Path(path).read_text(encoding="utf-8-sig")


def save(path, text):
    Path(path).write_text(
        text,
        encoding="utf-8",
        newline="\n",
    )


# ============================================================
# PROFILE PAGE
# ============================================================

profile_path = Path(
    "app/social-connect/u/[username]/page.tsx"
)

profile = load(profile_path)


if (
    'import PresenceLabel from "@/components/social/presence-label";'
    not in profile
):
    anchor = (
        'import SocialBadge from '
        '"@/components/social/social-badge";'
    )

    if anchor in profile:
        profile = profile.replace(
            anchor,
            anchor
            + '\nimport PresenceLabel from "@/components/social/presence-label";'
            + '\nimport UserActionsMenu from "@/components/social/user-actions-menu";',
            1,
        )


username_block = '''                <p className="mt-1 text-sm font-semibold text-slate-500">
                  @
                  {
                    profile.username
                  }
                </p>'''

if (
    username_block in profile
    and
    "<PresenceLabel" not in profile
):
    profile = profile.replace(
        username_block,
        username_block
        + '''

                <PresenceLabel
                  userId={
                    profile.user_id
                  }
                />''',
        1,
    )


message_block = '''                {!isOwnProfile && user && (
                  <MessageUserButton
                    targetUserId={profile.user_id}
                  />
                )}'''

if (
    message_block in profile
    and
    "<UserActionsMenu" not in profile
):
    profile = profile.replace(
        message_block,
        message_block
        + '''

                {!isOwnProfile && user && (
                  <UserActionsMenu
                    targetUserId={
                      profile.user_id
                    }
                  />
                )}''',
        1,
    )

elif (
    "<UserActionsMenu" not in profile
):
    action_anchor = '''                {isOwnProfile ? ('''

    if action_anchor in profile:
        profile = profile.replace(
            action_anchor,
            '''                {!isOwnProfile && user && (
                  <UserActionsMenu
                    targetUserId={
                      profile.user_id
                    }
                  />
                )}

''' + action_anchor,
            1,
        )


save(
    profile_path,
    profile,
)


# ============================================================
# SOCIAL SETTINGS -> BLOCKED ACCOUNTS
# ============================================================

settings_path = Path(
    "app/social-connect/settings/page.tsx"
)

settings = load(
    settings_path
)


if (
    "/social-connect/settings/blocked"
    not in settings
):
    back_anchor = '''        <Link
          href={`/social-connect/u/${profile.username}`}'''

    blocked_link = '''        <Link
          href="/social-connect/settings/blocked"
          className="mt-5 flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-red-950/20"
        >
          Manage Blocked Accounts
        </Link>

'''

    if back_anchor in settings:
        settings = settings.replace(
            back_anchor,
            blocked_link
            + back_anchor,
            1,
        )


save(
    settings_path,
    settings,
)


# ============================================================
# CHAT CONVERSATION HEADER -> PRESENCE
# ============================================================

chat_page_path = Path(
    "app/social-connect/chats/[id]/page.tsx"
)

chat_page = load(
    chat_page_path
)


if (
    'import PresenceLabel from "@/components/social/presence-label";'
    not in chat_page
):
    anchor = (
        'import SocialBadge from '
        '"@/components/social/social-badge";'
    )

    if anchor in chat_page:
        chat_page = chat_page.replace(
            anchor,
            anchor
            + '\nimport PresenceLabel from "@/components/social/presence-label";',
            1,
        )


username_chat = '''              <p className="truncate text-xs text-slate-500">
                @
                {
                  otherProfile.username
                }
              </p>'''

if (
    username_chat in chat_page
    and
    "<PresenceLabel" not in chat_page
):
    chat_page = chat_page.replace(
        username_chat,
        username_chat
        + '''

              <PresenceLabel
                userId={
                  otherProfile.user_id
                }
              />''',
        1,
    )


save(
    chat_page_path,
    chat_page,
)


# ============================================================
# REMOVE OLD PER-PAGE SOCIAL NAV
#
# Layout now controls it globally.
# ============================================================

for file_name in [
    "app/social-connect/page.tsx",
    "app/social-connect/chats/page.tsx",
]:
    path = Path(
        file_name
    )

    if not path.exists():
        continue

    code = load(
        path
    )

    code = re.sub(
        r'\nimport SocialNav from "@/components/social/social-nav";\n',
        "\n",
        code,
        count=1,
    )

    code = re.sub(
        r'\n\s*<SocialNav\b[\s\S]*?/>\s*',
        "\n",
        code,
        count=1,
    )

    save(
        path,
        code,
    )


print("✓ Social profile menu patched")
print("✓ Presence labels added")
print("✓ Blocked Accounts link added")
print("✓ Duplicate page-level SocialNav removed")
