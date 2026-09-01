import fs from "node:fs";

const file =
  "components/social/post-composer.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );

code =
  code.replace(
    `"video/webm",`,
    `"video/webm",
  "video/quicktime",`,
  );

code =
  code.replace(
    `"Unsupported format. Use JPG, PNG, WEBP, GIF, MP4 or WEBM.",`,
    `"Unsupported format. Use JPG, PNG, WEBP, GIF, MP4, WEBM or MOV.",`,
  );

code =
  code.replace(
    `<span className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-slate-900">
                Select From Device
              </span>`,
    `<button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  inputRef.current?.click();
                }}
                className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg active:scale-95"
              >
                Select From Device
              </button>`,
  );

code =
  code.replace(
    `accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"`,
    `accept="image/*,video/*"`,
  );

fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Mobile media picker fixed.",
);
