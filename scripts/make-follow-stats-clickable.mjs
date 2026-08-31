import fs from "node:fs";

const file =
  "app/social-connect/u/[username]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


const followerTarget =
`              <div className="flex-1 border-x border-slate-100 text-center sm:flex-none sm:px-7">
                <p className="text-xl font-black text-[#071a3d]">
                  {followers ??
                    0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Followers
                </p>
              </div>`;

const followerReplacement =
`              <Link
                href={\`/social-connect/u/\${profile.username}/followers\`}
                className="flex-1 border-x border-slate-100 text-center transition hover:bg-slate-50 sm:flex-none sm:px-7"
              >
                <p className="text-xl font-black text-[#071a3d]">
                  {followers ?? 0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Followers
                </p>
              </Link>`;


const followingTarget =
`              <div className="flex-1 text-center sm:flex-none sm:px-7">
                <p className="text-xl font-black text-[#071a3d]">
                  {following ??
                    0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Following
                </p>
              </div>`;

const followingReplacement =
`              <Link
                href={\`/social-connect/u/\${profile.username}/following\`}
                className="flex-1 text-center transition hover:bg-slate-50 sm:flex-none sm:px-7"
              >
                <p className="text-xl font-black text-[#071a3d]">
                  {following ?? 0}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  Following
                </p>
              </Link>`;


if (
  !code.includes(
    followerTarget,
  )
) {
  console.error(
    "Followers block not found.",
  );

  process.exit(1);
}


if (
  !code.includes(
    followingTarget,
  )
) {
  console.error(
    "Following block not found.",
  );

  process.exit(1);
}


code =
  code.replace(
    followerTarget,
    followerReplacement,
  );


code =
  code.replace(
    followingTarget,
    followingReplacement,
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "Followers and Following are now clickable."
);
