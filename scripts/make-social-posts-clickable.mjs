import fs from "node:fs";

const file =
  "app/social-connect/u/[username]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


const oldStart =
`                  <div
                    key={
                      post.id
                    }
                    className="group relative aspect-square overflow-hidden bg-slate-100 sm:rounded-xl"
                  >`;


const newStart =
`                  <Link
                    key={
                      post.id
                    }
                    href={\`/social-connect/post/\${post.id}\`}
                    className="group relative aspect-square overflow-hidden bg-slate-100 sm:rounded-xl"
                  >`;


if (
  !code.includes(
    oldStart,
  )
) {
  console.error(
    "Profile post-grid block was not found. No file was changed.",
  );

  process.exit(1);
}


code =
  code.replace(
    oldStart,
    newStart,
  );


const oldEnd =
`                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                  </div>`;


const newEnd =
`                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                  </Link>`;


if (
  !code.includes(
    oldEnd,
  )
) {
  console.error(
    "Profile post-grid closing block was not found. No file was changed.",
  );

  process.exit(1);
}


code =
  code.replace(
    oldEnd,
    newEnd,
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ Profile posts now open like Instagram posts."
);
