import fs from "node:fs";

const file =
  "app/social-connect/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


const anchor =
`  const {
    data: blueData,
  } =`;


if (
  !code.includes(
    anchor,
  )
) {
  console.error(
    "Feed anchor not found.",
  );

  process.exit(1);
}


const roleBlock =
`  const {
    data: roleData,
  } =
    authorIds.length
      ? await supabase
          .from("profiles")
          .select("id, role")
          .in("id", authorIds)
      : { data: [] };

`;


code =
  code.replace(
    anchor,
    roleBlock +
      anchor,
  );


const mapAnchor =
`  const blueMap =
    new Map(`;


const roleMap =
`  const roleMap =
    new Map(
      (
        roleData ??
        []
      ).map(
        (row) => [
          row.id,
          row.role,
        ],
      ),
    );

`;


code =
  code.replace(
    mapAnchor,
    roleMap +
      mapAnchor,
  );


code =
  code.replace(
`    if (
      profile.account_type ===
      "admin"
    ) {
      return "admin" as const;
    }`,
`    if (
      roleMap.get(
        profile.user_id,
      ) === "admin"
    ) {
      return "admin" as const;
    }`,
  );


code =
  code.replaceAll(
`author?.account_type ===
                              "admin"`,
`roleMap.get(
                              author?.user_id,
                            ) === "admin"`,
  );


fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Feed admin badges now use profiles.role.",
);
