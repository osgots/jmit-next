import fs from "node:fs";

const file =
  "app/social-connect/u/[username]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


/* Add Eye icon */

code =
  code.replace(
    `  Grid3X3,`,
    `  Grid3X3,
  Eye,`,
  );


/* Better Posts section header */

const oldHeader =
`          <div className="flex items-center justify-center gap-2 border-b border-slate-200 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#071a3d]">
            <Grid3X3
              size={16}
            />

            Posts
          </div>`;


const newHeader =
`          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#071a3d] dark:text-white">
              <Grid3X3
                size={16}
              />

              Posts
            </div>


            {isOwnProfile &&
              canPost && (
              <Link
                href="/social-connect/new"
                className="flex items-center gap-2 rounded-xl bg-[#071f50] px-4 py-2.5 text-xs font-black text-white dark:bg-blue-600"
              >
                <Plus
                  size={15}
                />

                Add Post
              </Link>
            )}
          </div>`;


if (
  code.includes(
    oldHeader,
  )
) {
  code =
    code.replace(
      oldHeader,
      newHeader,
    );
} else {
  console.error(
    "Posts section header anchor not found.",
  );

  process.exit(1);
}


/* Profile post -> logical return to profile */

code =
  code.replaceAll(
    'href={`/social-connect/post/${post.id}`}',
    'href={`/social-connect/post/${post.id}?from=${encodeURIComponent(`/social-connect/u/${profile.username}`)}`}',
  );


/* View overlay */

const overlay =
`                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />`;


const overlayReplacement =
`                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black text-white backdrop-blur">
                      <Eye
                        size={12}
                      />

                      {Number(
                        post.view_count ??
                        0,
                      ).toLocaleString()}
                    </div>`;


if (
  code.includes(
    overlay,
  )
) {
  code =
    code.replaceAll(
      overlay,
      overlayReplacement,
    );
}


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ Add Post button added to profile posts section."
);

console.log(
  "✓ Post views shown on profile grid."
);

console.log(
  "✓ Profile posts remember their logical parent."
);
