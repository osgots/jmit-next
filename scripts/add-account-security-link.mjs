import fs from "node:fs";

const file =
  "app/account/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );

const target =
`        <div className="mt-5 flex justify-center">`;

const replacement =
`        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/account/security"
            className="rounded-xl bg-[#071f50] px-5 py-3 text-center text-sm font-black text-white dark:bg-blue-600"
          >
            Account Security
          </Link>

          <Link
            href="/social-connect"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-400"
          >
            Open Social Connect
          </Link>
        </div>

        <div className="hidden">`;

if (!code.includes(target)) {
  console.error(
    "Account insertion point not found.",
  );

  process.exit(1);
}

code =
  code.replace(
    target,
    replacement,
  );

fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Account Security link added.",
);
