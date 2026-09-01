import fs from "node:fs";

const file =
  "app/social-connect/u/[username]/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


if (
  !code.includes(
    `import MessageUserButton from "@/components/social/message-user-button";`,
  )
) {
  code =
    code.replace(
      `import SocialBadge from "@/components/social/social-badge";`,
      `import SocialBadge from "@/components/social/social-badge";
import MessageUserButton from "@/components/social/message-user-button";`,
    );
}


const anchor =
`              <div className="flex flex-wrap gap-2 sm:pb-3">
                {isOwnProfile ? (`;


const replacement =
`              <div className="flex flex-wrap gap-2 sm:pb-3">

                {!isOwnProfile && user && (
                  <MessageUserButton
                    targetUserId={profile.user_id}
                  />
                )}

                {isOwnProfile ? (`;


if (
  !code.includes(
    anchor,
  )
) {
  console.error(
    "Profile actions anchor not found.",
  );

  process.exit(1);
}


code =
  code.replace(
    anchor,
    replacement,
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ Message button added to Social profiles.",
);
