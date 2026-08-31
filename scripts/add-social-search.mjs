import fs from "node:fs";

const file =
  "app/social-connect/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );

const target =
`      <section className="mx-auto max-w-2xl px-4 py-8">`;

const replacement =
`      <section className="mx-auto max-w-2xl px-4 pt-6">
        <form
          action="/social-connect/search"
          className="relative"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="q"
            placeholder="Search people on Social Connect..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-24 text-sm font-semibold text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#071f50] px-4 py-2 text-xs font-black text-white">
            Search
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8">`;

if (!code.includes(target)) {
  console.error(
    "Could not locate Social Connect feed insertion point.",
  );

  process.exit(1);
}

code =
  code.replace(
    target,
    replacement,
  );

fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "Social user search added to feed."
);
