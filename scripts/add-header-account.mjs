import fs from "node:fs";

const file =
  "components/site-header.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );

if (
  !code.includes(
    `import HeaderAccount from "@/components/header-account";`,
  )
) {
  code =
    code.replace(
      `import CommandSearch from "@/components/command-search";`,
      `import CommandSearch from "@/components/command-search";
import HeaderAccount from "@/components/header-account";`,
    );
}

const target =
`          <button
            onClick={() =>
              setMobileOpen(
                (value) => !value,
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
            aria-label="Open navigation"
          >`;

const replacement =
`          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <HeaderAccount />

            <button
              onClick={() =>
                setMobileOpen(
                  (value) => !value,
                )
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
              aria-label="Open navigation"
            >`;

if (
  code.includes(
    target,
  )
) {
  code =
    code.replace(
      target,
      replacement,
    );

  code =
    code.replace(
      `          </button>
        </div>
        {activeMenu &&`,
      `            </button>
          </div>
        </div>
        {activeMenu &&`,
    );
}

fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Header account controls added.",
);
