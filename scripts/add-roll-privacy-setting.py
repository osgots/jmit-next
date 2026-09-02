from pathlib import Path


path = Path(
    "app/social-connect/settings/page.tsx"
)

code = path.read_text(
    encoding="utf-8-sig"
)


IMPORT = (
    'import RollVisibilityToggle '
    'from "@/components/social/roll-visibility-toggle";'
)


if IMPORT not in code:

    anchor = (
        'import ProfileEditor from '
        '"@/components/social/profile-editor";'
    )

    code = code.replace(
        anchor,
        anchor
        + "\n"
        + IMPORT,
        1,
    )


code = code.replace(
    '"username, display_name, bio, avatar_url, account_type"',
    '"username, display_name, bio, avatar_url, account_type, show_verified_roll_number"',
)


identity_anchor = '''  const isAdmin =
    appProfile?.role ===
    "admin";'''


if (
    "data: verification" not in code
):
    code = code.replace(
        identity_anchor,
        identity_anchor
        + '''


  const {
    data:
      verification,
  } =
    !isAdmin
      ? await supabase
          .from(
            "social_blue_verifications",
          )
          .select(
            "verified_roll_number",
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle()
      : {
          data:
            null,
        };''',
        1,
    )


editor_end = '''          />
        </div>'''


replacement = '''          />
        </div>


        {verification?.verified_roll_number && (
          <div className="mt-6">
            <RollVisibilityToggle
              initialVisible={
                Boolean(
                  profile.show_verified_roll_number,
                )
              }
              rollNumber={
                verification.verified_roll_number
              }
            />
          </div>
        )}'''


if (
    "<RollVisibilityToggle" not in code
):
    code = code.replace(
        editor_end,
        replacement,
        1,
    )


code = code.replace(
    'className="min-h-screen bg-[#f5f7fb]"',
    'className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950"',
)


code = code.replace(
    'text-[#071a3d]">',
    'text-[#071a3d] dark:text-white">',
)


code = code.replace(
    'text-slate-600">',
    'text-slate-600 dark:text-slate-300">',
)


code = code.replace(
    'bg-white p-6 shadow-lg',
    'bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900',
)


path.write_text(
    code,
    encoding="utf-8",
    newline="\n",
)


print(
    "✓ Verified roll privacy added to Social Settings."
)
