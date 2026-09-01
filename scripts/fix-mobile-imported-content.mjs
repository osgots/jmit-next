import fs from "node:fs";

const file =
  "app/explore/[slug]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );

code =
  code.replace(
    `className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-9"`,
    `className="min-w-0 overflow-x-auto rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-9"`,
  );

code =
  code.replace(
    `[&_table]:w-full`,
    `[&_table]:min-w-max
                [&_table]:max-w-none`,
  );

code =
  code.replace(
    `[&_table]:overflow-hidden`,
    `[&_table]:text-sm`,
  );

fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Imported JMIT tables are now horizontally scrollable on phones.",
);
