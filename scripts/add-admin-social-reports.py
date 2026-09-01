from pathlib import Path

path = Path(
    "app/admin/social/page.tsx"
)

code = path.read_text(
    encoding="utf-8-sig"
)


# Add Flag icon.

code = code.replace(
    "  BadgeCheck,\n",
    "  BadgeCheck,\n  Flag,\n",
    1,
)


# Pending report count.

anchor = '''  const userIds =
    (socialProfiles ?? [])'''


insert = '''  const {
    count:
      pendingReports,
  } =
    await supabase
      .from(
        "social_moderation_reports",
      )
      .select("*", {
        count:
          "exact",

        head:
          true,
      })
      .eq(
        "status",
        "pending",
      );


''' + anchor


if (
    "pendingReports" not in code
    and
    anchor in code
):
    code = code.replace(
        anchor,
        insert,
        1,
    )


# Replace Dashboard-only control with Reports + Dashboard.

old = '''          <Link
            href="/admin"
            className="font-black text-blue-700"
          >
            ← Dashboard
          </Link>'''


new = '''          <div className="flex flex-wrap items-center gap-3">

            <Link
              href="/admin/social/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-black text-red-700 transition hover:bg-red-100"
            >
              <Flag
                size={15}
              />

              Reports

              {(pendingReports ?? 0) > 0 && (
                <span className="flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] leading-5 text-white">
                  {pendingReports}
                </span>
              )}
            </Link>


            <Link
              href="/admin"
              className="font-black text-blue-700"
            >
              ← Dashboard
            </Link>
          </div>'''


if old not in code:
    raise SystemExit(
        "Admin Social header anchor not found."
    )


code = code.replace(
    old,
    new,
    1,
)


path.write_text(
    code,
    encoding="utf-8",
    newline="\n",
)


print(
    "✓ Admin Social Reports link added."
)
