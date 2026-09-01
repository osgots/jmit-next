import fs from "node:fs";

const file =
  "app/layout.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


if (
  !code.includes(
    "metadataBase:",
  )
) {
  code =
    code.replace(
      `export const metadata: Metadata = {`,
      `export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),`,
    );
}


fs.writeFileSync(
  file,
  code,
  "utf8",
);


console.log(
  "✓ metadataBase configured.",
);
