from pathlib import Path
import re


path = Path(
    "app/social-connect/u/[username]/page.tsx"
)

code = path.read_text(
    encoding="utf-8-sig"
)


# ============================================================
# Replace direct public blue-verification query.
# ============================================================

pattern = re.compile(
    r'''  const \{
    data: blue,
  \} =
    !isAdmin
      \? await supabase
          \.from\(
            "social_blue_verifications",
          \)
          \.select\(
            "verified_roll_number, approved_at",
          \)
          \.eq\(
            "user_id",
            profile\.user_id,
          \)
          \.maybeSingle\(\)
      : \{
          data: null,
        \};''',
    re.MULTILINE,
)


replacement = '''  const blue =
    !isAdmin &&
    publicIdentity?.is_blue_verified
      ? {
          verified_roll_number:
            publicIdentity.verified_roll_number,

          approved_at:
            publicIdentity.approved_at,
        }
      : null;'''


code, count = pattern.subn(
    replacement,
    code,
    count=1,
)


if count:
    print(
        "✓ Public roll now uses privacy-aware identity RPC."
    )
else:
    print(
        "INFO: direct blue query already changed or formatted differently."
    )


# ============================================================
# Replace blue badge block.
# ============================================================

old = '''                {blue && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700">
                    <BadgeCheck
                      size={17}
                    />

                    Verified Student

                    <span className="text-blue-300">
                      •
                    </span>
                    Roll No.
                    <strong>
                      {
                        blue.verified_roll_number
                      }
                    </strong>
                  </div>
                )}'''


new = '''                {blue && (
                  <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300">

                    <BadgeCheck
                      size={17}
                    />

                    <strong>
                      Verified Student
                    </strong>


                    {blue.verified_roll_number && (
                      <>
                        <span className="text-blue-300 dark:text-blue-700">
                          •
                        </span>

                        <span>
                          Roll No.{" "}

                          <strong>
                            {
                              blue.verified_roll_number
                            }
                          </strong>
                        </span>
                      </>
                    )}
                  </div>
                )}'''


if old in code:

    code = code.replace(
        old,
        new,
        1,
    )

    print(
        "✓ Roll number now appears only when user allows it."
    )


# ============================================================
# Remaining profile dark-mode contrast.
# ============================================================

code = code.replace(
    'className="text-xl font-black text-[#071a3d]"',
    'className="text-xl font-black text-[#071a3d] dark:text-white"',
)


code = code.replace(
    'className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700"',
    'className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700 dark:text-slate-300"',
)


code = code.replace(
    'className="mt-6 bg-white sm:rounded-[28px] sm:border sm:border-slate-200"',
    'className="mt-6 bg-white sm:rounded-[28px] sm:border sm:border-slate-200 dark:border-slate-800 dark:bg-slate-900"',
)


code = code.replace(
    'className="mt-5 text-xl font-black text-[#071a3d]"',
    'className="mt-5 text-xl font-black text-[#071a3d] dark:text-white"',
)


code = code.replace(
    'hover:bg-slate-50 sm:flex-none',
    'hover:bg-slate-50 dark:hover:bg-slate-800 sm:flex-none',
)


path.write_text(
    code,
    encoding="utf-8",
    newline="\n",
)


print(
    "✓ Profile dark-mode contrast strengthened."
)
