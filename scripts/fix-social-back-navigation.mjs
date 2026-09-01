import fs from "node:fs";


const files = [
  "app/social-connect/u/[username]/followers/page.tsx",
  "app/social-connect/u/[username]/following/page.tsx",
  "app/social-connect/settings/page.tsx",
  "app/social-connect/chats/[id]/page.tsx",
];


for (
  const file
  of files
) {
  if (
    !fs.existsSync(
      file,
    )
  ) {
    continue;
  }


  let code =
    fs.readFileSync(
      file,
      "utf8",
    );


  /*
   * Add replace to links explicitly labelled as
   * Back / Back to Profile / Chats.
   */
  code =
    code.replace(
      /<Link(\s+)(href=\{?`?["']?\/social-connect\/chats)/g,
      `<Link$1replace$1$2`,
    );


  code =
    code.replace(
      /<Link(\s+)(href=\{`\/social-connect\/u\/\$\{[^}]+\}`\})/g,
      `<Link$1replace$1$2`,
    );


  fs.writeFileSync(
    file,
    code,
    "utf8",
  );
}


console.log(
  "✓ Nested Social back navigation updated."
);
