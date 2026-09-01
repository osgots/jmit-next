from pathlib import Path
import re


files = [
    Path("components/login-form.tsx"),
    Path("components/sign-up-form.tsx"),
]


IMPORT = (
    'import CampusEmailNotice '
    'from "@/components/campus-email-notice";'
)


for path in files:

    if not path.exists():
        print(
            f"WARN: {path} not found"
        )
        continue


    code = path.read_text(
        encoding="utf-8-sig"
    )


    # -----------------------------------------
    # Add import
    # -----------------------------------------

    if IMPORT not in code:

        if '"use client";' in code:

            code = code.replace(
                '"use client";',
                '"use client";\n\n' + IMPORT,
                1,
            )

        else:

            code = (
                IMPORT
                + "\n"
                + code
            )


    # -----------------------------------------
    # Add component immediately inside
    # first <form ...>
    # -----------------------------------------

    if "<CampusEmailNotice />" not in code:

        match = re.search(
            r"<form\b[^>]*>",
            code,
        )


        if not match:

            print(
                f"ERROR: form not found in {path}"
            )

            continue


        insertion_point = (
            match.end()
        )


        code = (
            code[
                :insertion_point
            ]
            + """

            <CampusEmailNotice />
"""
            + code[
                insertion_point:
            ]
        )


    path.write_text(
        code,
        encoding="utf-8",
        newline="\n",
    )


    print(
        f"✓ Campus email advisory added to {path}"
    )
