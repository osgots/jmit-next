import fs from "node:fs";

const file = "app/social-connect/page.tsx";
let code = fs.readFileSync(file, "utf8");

const regex =
  /import\s*\{([\s\S]*?)\}\s*from\s*"lucide-react";/;

const match = code.match(regex);

if (!match) {
  console.error("lucide-react import block not found.");
  process.exit(1);
}

const imports = match[1];

if (!/\bSearch\b/.test(imports)) {
  const replacement =
    `import {\n  Search,${imports}\n} from "lucide-react";`;

  code = code.replace(
    match[0],
    replacement,
  );

  fs.writeFileSync(
    file,
    code,
    "utf8",
  );

  console.log("✓ Search icon import added.");
} else {
  console.log("✓ Search is already imported.");
}
