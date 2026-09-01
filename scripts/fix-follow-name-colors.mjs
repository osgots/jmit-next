import fs from "node:fs";

for (const file of [
  "app/social-connect/u/[username]/followers/page.tsx",
  "app/social-connect/u/[username]/following/page.tsx",
]) {
  let code =
    fs.readFileSync(
      file,
      "utf8",
    );

  code =
    code.replaceAll(
      `className="truncate font-black"`,
      `className="truncate font-black text-slate-950"`,
    );

  fs.writeFileSync(
    file,
    code,
    "utf8",
  );
}

console.log(
  "✓ Followers/following names made readable.",
);
