import fs from "node:fs";

const file =
  "app/page.tsx";

let code =
  fs.readFileSync(
    file,
    "utf8",
  );


function replaceOrFail(
  oldValue,
  newValue,
  label,
) {
  if (
    !code.includes(
      oldValue,
    )
  ) {
    console.error(
      `Could not patch: ${label}`,
    );

    process.exit(1);
  }

  code =
    code.replace(
      oldValue,
      newValue,
    );
}


// IMPORT ROUTER + ROUTE MAP

replaceOrFail(
  `import SiteHeader from "@/components/site-header";`,
  `import SiteHeader from "@/components/site-header";
import { useRouter } from "next/navigation";
import { routeForLabel } from "@/lib/jmit-routes";`,
  "imports",
);


// CREATE ROUTER

replaceOrFail(
  `export default function Home() {

  return (`,
  `export default function Home() {
  const router = useRouter();

  return (`,
  "router",
);


// HERO SEARCH

replaceOrFail(
  `<button className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15">`,
  `<button
                onClick={() => router.push("/directory")}
                className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
              >`,
  "hero search",
);


// HERO SHORTCUTS

replaceOrFail(
  `<button
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                  >`,
  `<button
                    key={title}
                    onClick={() =>
                      router.push(
                        routeForLabel(title)
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-left transition hover:-translate-y-1 hover:bg-white/10"
                  >`,
  "hero shortcut cards",
);


// QUICK ACCESS CARDS

replaceOrFail(
  `whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"`,
  `whileHover={{ y: -5 }}
                  onClick={() =>
                    router.push(
                      routeForLabel(item.title)
                    )
                  }
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"`,
  "quick access cards",
);


// AUDIENCE CARDS

replaceOrFail(
  `whileHover={{ y: -6 }}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"`,
  `whileHover={{ y: -6 }}
                  onClick={() =>
                    router.push(
                      routeForLabel(item.title)
                    )
                  }
                  role="link"
                  tabIndex={0}
                  className="group cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-xl"`,
  "audience cards",
);


// VIEW ALL PROGRAMS

replaceOrFail(
  `<button className="flex items-center gap-2 text-sm font-black text-blue-700">`,
  `<button
              onClick={() =>
                router.push("/academics")
              }
              className="flex items-center gap-2 text-sm font-black text-blue-700"
            >`,
  "view all programs",
);


// PROGRAM CARDS

replaceOrFail(
  `whileHover={{ y: -5 }}
                className="group rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-xl"`,
  `whileHover={{ y: -5 }}
                onClick={() =>
                  router.push(
                    routeForLabel(program.title)
                  )
                }
                role="link"
                tabIndex={0}
                className="group cursor-pointer rounded-[26px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-xl"`,
  "program cards",
);


// CAMPUS UPDATE CARDS

replaceOrFail(
  `transition={{ delay: index * 0.08 }}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg"`,
  `transition={{ delay: index * 0.08 }}
                onClick={() =>
                  router.push(
                    item.category === "ADMISSIONS"
                      ? "/notices?category=Admissions"
                      : item.category === "PLACEMENT"
                        ? "/notices?category=Placement"
                        : "/notices?category=Academic"
                  )
                }
                role="link"
                tabIndex={0}
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg"`,
  "update cards",
);


fs.writeFileSync(
  file,
  code,
  "utf8",
);

console.log(
  "✓ Homepage links connected successfully."
);
