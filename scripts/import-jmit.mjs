import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";


// ============================================================
// LOAD LOCAL ENVIRONMENT WHEN RUNNING MANUALLY
// ============================================================

const envPath = path.resolve(
  process.cwd(),
  ".env.local",
);

if (fs.existsSync(envPath)) {
  config({
    path: envPath,
    override: false,
  });
}


// ============================================================
// ENVIRONMENT
// ============================================================

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const ADMIN_EMAIL =
  process.env.JMIT_IMPORT_ADMIN_EMAIL;

const ADMIN_PASSWORD =
  process.env.JMIT_IMPORT_ADMIN_PASSWORD;


if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "ERROR: Missing Supabase URL or publishable key.",
  );

  process.exit(1);
}


if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "ERROR: Missing JMIT sync account credentials.",
  );

  process.exit(1);
}


// ============================================================
// SUPABASE
// ============================================================

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);


const login =
  await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });


if (login.error || !login.data.user) {
  console.error(
    "ERROR: Sync account login failed:",
    login.error?.message,
  );

  process.exit(1);
}


const { data: profile } =
  await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", login.data.user.id)
    .single();


if (
  !profile ||
  !["admin", "editor"].includes(
    profile.role,
  )
) {
  console.error(
    "ERROR: Sync account is not admin/editor.",
  );

  process.exit(1);
}


console.log("");
console.log(
  `✓ Authenticated as ${profile.full_name || ADMIN_EMAIL}`,
);

console.log(
  `✓ Application role: ${profile.role}`,
);


// ============================================================
// DEEP CRAWL CONFIGURATION
// ============================================================

const START_URLS = [
  "https://www.jmit.ac.in/",
  "https://conference.jmit.ac.in/",
];

const MAX_PAGES = 2000;

const REQUEST_DELAY = 175;

const REQUEST_TIMEOUT = 25000;

const USER_AGENT =
  "JMIT-Next-Educational-Sync/2.0";


const documentExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
]);


const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
]);


const ignoredExtensions = new Set([
  ".css",
  ".js",
  ".ico",
  ".mp3",
  ".mp4",
  ".avi",
  ".mov",
  ".wmv",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
]);


// ============================================================
// STATE
// ============================================================

const queue = [...START_URLS];

const queued =
  new Set(START_URLS);

const visited =
  new Set();

let pageNew = 0;
let pageUpdated = 0;
let pageUnchanged = 0;

let resourcesIndexed = 0;

let skipped = 0;
let failed = 0;


// ============================================================
// HELPERS
// ============================================================

function sleep(ms) {
  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms),
  );
}


function hashContent(value) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}


function cleanWhitespace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}


function extensionOf(value) {
  try {
    return path
      .extname(
        new URL(value).pathname,
      )
      .toLowerCase();
  } catch {
    return "";
  }
}


function isJmitHostname(hostname) {
  const host =
    hostname.toLowerCase();

  return (
    host === "jmit.ac.in" ||
    host.endsWith(
      ".jmit.ac.in",
    )
  );
}


function normalizeUrl(
  value,
  base = START_URLS[0],
) {
  try {
    if (!value) {
      return null;
    }

    const trimmed =
      String(value).trim();

    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:") ||
      trimmed.startsWith("javascript:")
    ) {
      return null;
    }

    const url =
      new URL(trimmed, base);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }


    if (
      !isJmitHostname(
        url.hostname,
      )
    ) {
      return null;
    }


    url.protocol = "https:";

    url.hostname =
      url.hostname.toLowerCase();

    url.hash = "";


    // Remove tracking parameters only.
    const removableParams = [];

    for (
      const [key]
      of url.searchParams
    ) {
      if (
        key.toLowerCase().startsWith(
          "utm_",
        ) ||
        [
          "fbclid",
          "gclid",
          "mc_cid",
          "mc_eid",
        ].includes(
          key.toLowerCase(),
        )
      ) {
        removableParams.push(
          key,
        );
      }
    }

    removableParams.forEach(
      (key) =>
        url.searchParams.delete(
          key,
        ),
    );


    let pathname =
      url.pathname.replace(
        /\/+/g,
        "/",
      );


    if (
      pathname.length > 1 &&
      pathname.endsWith("/")
    ) {
      pathname =
        pathname.slice(
          0,
          -1,
        );
    }


    url.pathname =
      pathname || "/";


    return url.toString();
  } catch {
    return null;
  }
}


function absoluteUrl(
  value,
  base,
) {
  try {
    return new URL(
      value,
      base,
    ).toString();
  } catch {
    return null;
  }
}


function isDocument(url) {
  return documentExtensions.has(
    extensionOf(url),
  );
}


function isImage(url) {
  return imageExtensions.has(
    extensionOf(url),
  );
}


function isIgnoredAsset(url) {
  return ignoredExtensions.has(
    extensionOf(url),
  );
}


function shouldCrawl(url) {
  if (!url) {
    return false;
  }

  if (
    isDocument(url) ||
    isImage(url) ||
    isIgnoredAsset(url)
  ) {
    return false;
  }

  try {
    const parsed =
      new URL(url);

    const pathname =
      parsed.pathname.toLowerCase();

    if (
      pathname.includes(
        "/admin",
      ) ||
      pathname.includes(
        "/login",
      ) ||
      pathname.includes(
        "/logout",
      )
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}


function slugFromUrl(value) {
  const url =
    new URL(value);

  const host =
    url.hostname
      .replace(
        /\.jmit\.ac\.in$/i,
        "",
      )
      .replace(
        /^www$/i,
        "",
      );


  const pathname =
    url.pathname
      .replace(
        /^\/+|\/+$/g,
        "",
      )
      .replace(
        /\.(html?|php)$/i,
        "",
      );


  const query =
    url.searchParams.size
      ? "-" +
        Array.from(
          url.searchParams.entries(),
        )
          .map(
            ([key, value]) =>
              `${key}-${value}`,
          )
          .join("-")
      : "";


  let base = [
    host,
    pathname,
    query,
  ]
    .filter(Boolean)
    .join("-");


  if (!base) {
    base =
      "legacy-home";
  }


  return base
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    )
    .slice(
      0,
      180,
    );
}


function cleanTitle(value) {
  return cleanWhitespace(
    value,
  )
    .replace(
      /\s*\|\s*JMIT.*$/i,
      "",
    )
    .replace(
      /\s*-\s*JMIT.*$/i,
      "",
    )
    .trim();
}


// ============================================================
// CLASSIFICATION
// ============================================================

function classifyPage(
  title,
  url,
  text = "",
) {
  const value =
    `${title} ${url} ${text.slice(0, 1500)}`
      .toLowerCase();


  if (
    /admission|counselling|scholarship|fee structure|eligibility/.test(
      value,
    )
  ) {
    return "Admissions";
  }


  if (
    /placement|recruit|career development|training and placement/.test(
      value,
    )
  ) {
    return "Placements";
  }


  if (
    /computer science|information technology|mechanical|electrical|bca|bba|mba|faculty|syllabus|time table|timetable|lesson plan|academic|research|curriculum|course outcome|program outcome/.test(
      value,
    )
  ) {
    return "Academics";
  }


  if (
    /hostel|library|sports|club|society|campus|auditorium|ncc|nss|entrepreneur|facility/.test(
      value,
    )
  ) {
    return "Campus Life";
  }


  if (
    /alumni/.test(
      value,
    )
  ) {
    return "Alumni";
  }


  if (
    /iqac|quality assurance|naac|accreditation/.test(
      value,
    )
  ) {
    return "IQAC";
  }


  if (
    /director|governor|committee|administration|mandatory disclosure|organization structure/.test(
      value,
    )
  ) {
    return "Administration";
  }


  if (
    /gallery|photo|video|media|news clipping/.test(
      value,
    )
  ) {
    return "Gallery";
  }


  if (
    /conference|speaker|keynote/.test(
      value,
    )
  ) {
    return "Conference";
  }


  if (
    /profile|heritage|about|institute/.test(
      value,
    )
  ) {
    return "About";
  }


  return "General";
}


// ============================================================
// CONTENT EXTRACTION
// ============================================================

function findContentContainer($) {
  const selectors = [
    "main",
    ".page-content",
    ".entry-content",
    ".content-area",
    ".inner-content",
    ".main-content",
    "#main-content",
    "#content",
    "article",
    ".content",
    "body",
  ];


  for (
    const selector
    of selectors
  ) {
    const candidate =
      $(selector).first();

    if (
      candidate.length &&
      cleanWhitespace(
        candidate.text(),
      ).length > 100
    ) {
      return candidate;
    }
  }


  return $("body");
}


function removeNoise(
  $,
  container,
) {
  container.find(
    [
      "script",
      "style",
      "noscript",
      "iframe",
      "header",
      "footer",
      "nav",
      ".navbar",
      ".navigation",
      ".menu",
      ".breadcrumb",
      ".breadcrumbs",
      ".sidebar",
      ".preloader",
      ".modal",
      ".cookie",
      ".cookie-banner",
    ].join(","),
  ).remove();


  container
    .find("*")
    .each(
      (_, element) => {
        const attributes =
          element.attribs || {};

        for (
          const name
          of Object.keys(
            attributes,
          )
        ) {
          if (
            /^on/i.test(name)
          ) {
            $(element)
              .removeAttr(
                name,
              );
          }
        }
      },
    );
}


// ============================================================
// RESOURCE INDEXING
// ============================================================

async function upsertResource({
  title,
  sourceUrl,
  resourceType,
  section,
  parentUrl,
}) {
  if (!sourceUrl) {
    return;
  }


  const extension =
    extensionOf(
      sourceUrl,
    ).replace(
      /^\./,
      "",
    );


  const sourceHash =
    hashContent(
      JSON.stringify({
        title,
        sourceUrl,
        resourceType,
        extension,
      }),
    );


  const { error } =
    await supabase
      .from("resources")
      .upsert(
        {
          title:
            cleanWhitespace(
              title,
            ) ||
            path.basename(
              new URL(
                sourceUrl,
              ).pathname,
            ) ||
            "JMIT Resource",

          source_url:
            sourceUrl,

          resource_type:
            resourceType,

          file_extension:
            extension || null,

          section:
            section || "General",

          parent_source_url:
            parentUrl,

          source_hash:
            sourceHash,

          last_seen_at:
            new Date().toISOString(),

          updated_at:
            new Date().toISOString(),

          is_active:
            true,
        },
        {
          onConflict:
            "source_url",
        },
      );


  if (error) {
    console.warn(
      "\nResource indexing warning:",
      error.message,
    );

    return;
  }


  resourcesIndexed++;
}


async function extractAndIndexResources(
  $,
  container,
  pageUrl,
  section,
) {
  const documents = [];

  const seen =
    new Set();


  for (
    const element
    of container
      .find("a[href]")
      .toArray()
  ) {
    const anchor =
      $(element);

    const href =
      anchor.attr("href");


    const normalized =
      normalizeUrl(
        href,
        pageUrl,
      );


    if (
      normalized &&
      isDocument(
        normalized,
      )
    ) {
      if (
        !seen.has(
          normalized,
        )
      ) {
        seen.add(
          normalized,
        );


        const title =
          cleanWhitespace(
            anchor.text(),
          ) ||
          path.basename(
            new URL(
              normalized,
            ).pathname,
          );


        documents.push({
          title,
          url:
            normalized,
          type:
            extensionOf(
              normalized,
            ).replace(
              ".",
              "",
            ),
        });


        await upsertResource({
          title,
          sourceUrl:
            normalized,
          resourceType:
            "document",
          section,
          parentUrl:
            pageUrl,
        });
      }
    }
  }


  for (
    const element
    of container
      .find("img[src]")
      .toArray()
  ) {
    const image =
      $(element);

    const src =
      absoluteUrl(
        image.attr("src"),
        pageUrl,
      );


    if (
      !src ||
      !isJmitHostname(
        new URL(src).hostname,
      )
    ) {
      continue;
    }


    const normalized =
      normalizeUrl(
        src,
        pageUrl,
      );


    if (
      !normalized ||
      !isImage(
        normalized,
      )
    ) {
      continue;
    }


    const title =
      cleanWhitespace(
        image.attr("alt"),
      ) ||
      path.basename(
        new URL(
          normalized,
        ).pathname,
      );


    await upsertResource({
      title,
      sourceUrl:
        normalized,
      resourceType:
        "image",
      section,
      parentUrl:
        pageUrl,
    });
  }


  return documents;
}


// ============================================================
// LINK REWRITING
// ============================================================

function rewriteContentLinks(
  $,
  container,
  pageUrl,
) {
  container
    .find("a[href]")
    .each(
      (_, element) => {
        const anchor =
          $(element);

        const href =
          anchor.attr("href");

        if (!href) {
          return;
        }


        const internal =
          normalizeUrl(
            href,
            pageUrl,
          );


        if (!internal) {
          const absolute =
            absoluteUrl(
              href,
              pageUrl,
            );

          if (absolute) {
            anchor.attr(
              "href",
              absolute,
            );
          }

          return;
        }


        if (
          isDocument(
            internal,
          ) ||
          isImage(
            internal,
          )
        ) {
          anchor.attr(
            "href",
            internal,
          );

          anchor.attr(
            "target",
            "_blank",
          );

          anchor.attr(
            "rel",
            "noopener noreferrer",
          );

          return;
        }


        anchor.attr(
          "href",
          `/explore/${slugFromUrl(
            internal,
          )}`,
        );
      },
    );


  container
    .find("img[src]")
    .each(
      (_, element) => {
        const image =
          $(element);

        const src =
          image.attr("src");


        const absolute =
          absoluteUrl(
            src,
            pageUrl,
          );


        if (absolute) {
          image.attr(
            "src",
            absolute,
          );

          image.attr(
            "loading",
            "lazy",
          );
        }
      },
    );
}


// ============================================================
// PAGE IMPORT
// ============================================================

async function importPage(url) {
  const response =
    await fetch(url, {
      headers: {
        "user-agent":
          USER_AGENT,

        accept:
          "text/html,application/xhtml+xml",
      },

      redirect:
        "follow",

      signal:
        AbortSignal.timeout(
          REQUEST_TIMEOUT,
        ),
    });


  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`,
    );
  }


  const contentType =
    response.headers
      .get(
        "content-type",
      )
      ?.toLowerCase() ||
    "";


  if (
    !contentType.includes(
      "text/html",
    )
  ) {
    return {
      skipped: true,
    };
  }


  const html =
    await response.text();


  const $ =
    cheerio.load(
      html,
    );


  // ==========================================================
  // DISCOVER LINKS BEFORE REMOVING OLD NAVIGATION
  // ==========================================================

  $("a[href]").each(
    (_, element) => {
      const href =
        $(element).attr(
          "href",
        );


      const normalized =
        normalizeUrl(
          href,
          url,
        );


      if (
        !normalized ||
        !shouldCrawl(
          normalized,
        )
      ) {
        return;
      }


      if (
        visited.has(
          normalized,
        ) ||
        queued.has(
          normalized,
        )
      ) {
        return;
      }


      if (
        visited.size +
          queue.length >=
        MAX_PAGES * 2
      ) {
        return;
      }


      queued.add(
        normalized,
      );

      queue.push(
        normalized,
      );
    },
  );


  // ==========================================================
  // TITLE
  // ==========================================================

  let title =
    cleanTitle(
      $("h1")
        .first()
        .text(),
    );


  if (!title) {
    title =
      cleanTitle(
        $("title")
          .text(),
      );
  }


  if (!title) {
    title =
      new URL(
        url,
      ).pathname;
  }


  const metaDescription =
    cleanWhitespace(
      $(
        'meta[name="description"]',
      ).attr(
        "content",
      ),
    );


  const container =
    findContentContainer(
      $,
    );


  removeNoise(
    $,
    container,
  );


  const preText =
    cleanWhitespace(
      container.text(),
    );


  const section =
    classifyPage(
      title,
      url,
      preText,
    );


  const documents =
    await extractAndIndexResources(
      $,
      container,
      url,
      section,
    );


  rewriteContentLinks(
    $,
    container,
    url,
  );


  const rawHtml =
    container.html() ||
    "";


  const safeHtml =
    sanitizeHtml(
      rawHtml,
      {
        allowedTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "hr",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "small",
          "ul",
          "ol",
          "li",
          "blockquote",
          "pre",
          "code",
          "table",
          "thead",
          "tbody",
          "tfoot",
          "tr",
          "th",
          "td",
          "a",
          "img",
          "div",
          "span",
          "figure",
          "figcaption",
        ],

        allowedAttributes: {
          a: [
            "href",
            "target",
            "rel",
            "title",
          ],

          img: [
            "src",
            "alt",
            "title",
            "loading",
            "width",
            "height",
          ],

          td: [
            "colspan",
            "rowspan",
          ],

          th: [
            "colspan",
            "rowspan",
          ],
        },

        allowedSchemes: [
          "http",
          "https",
          "mailto",
          "tel",
        ],
      },
    );


  const text =
    cleanWhitespace(
      cheerio
        .load(
          safeHtml,
        )
        .text(),
    );


  if (
    text.length < 40
  ) {
    return {
      skipped: true,
    };
  }


  const slug =
    slugFromUrl(
      url,
    );


  const description =
    (
      metaDescription ||
      text.slice(
        0,
        350,
      )
    ).slice(
      0,
      350,
    );


  const sourceHash =
    hashContent(
      JSON.stringify({
        title,
        description,
        safeHtml,
        documents,
      }),
    );


  // ==========================================================
  // FIND EXISTING PAGE
  // ==========================================================

  const {
    data: existing,
  } =
    await supabase
      .from("pages")
      .select(
        "id, content",
      )
      .eq(
        "slug",
        slug,
      )
      .maybeSingle();


  const previousHash =
    existing?.content &&
    typeof existing.content ===
      "object"
      ? existing.content
          .source_hash
      : null;


  if (
    previousHash ===
    sourceHash
  ) {
    return {
      status:
        "UNCHANGED",

      title,

      slug,

      section,
    };
  }


  const payload = {
    title,

    slug,

    seo_title:
      title,

    seo_description:
      description,

    is_published:
      true,

    content: {
      format:
        "imported-html",

      section,

      html:
        safeHtml,

      text,

      source_url:
        url,

      source_hash:
        sourceHash,

      documents,

      imported_at:
        new Date().toISOString(),

      source:
        new URL(
          url,
        ).hostname,
    },
  };


  const { error } =
    await supabase
      .from("pages")
      .upsert(
        payload,
        {
          onConflict:
            "slug",
        },
      );


  if (error) {
    throw error;
  }


  return {
    status:
      existing
        ? "UPDATED"
        : "NEW",

    title,

    slug,

    section,
  };
}


// ============================================================
// RUN
// ============================================================

console.log("");
console.log(
  "==================================================",
);

console.log(
  " JMIT NEXT DEEP SYNC V2",
);

console.log(
  "==================================================",
);

console.log(
  `Maximum pages: ${MAX_PAGES}`,
);

console.log(
  `Starting locations: ${START_URLS.length}`,
);

console.log("");


while (
  queue.length > 0 &&
  visited.size <
    MAX_PAGES
) {
  const url =
    queue.shift();


  if (
    !url ||
    visited.has(
      url,
    )
  ) {
    continue;
  }


  visited.add(
    url,
  );


  const number =
    visited.size;


  try {
    process.stdout.write(
      `[${number}/${MAX_PAGES}] ${url} ... `,
    );


    const result =
      await importPage(
        url,
      );


    if (
      result.skipped
    ) {
      skipped++;

      console.log(
        "SKIPPED",
      );
    } else if (
      result.status ===
      "NEW"
    ) {
      pageNew++;

      console.log(
        `NEW → ${result.section} → ${result.title}`,
      );
    } else if (
      result.status ===
      "UPDATED"
    ) {
      pageUpdated++;

      console.log(
        `UPDATED → ${result.section} → ${result.title}`,
      );
    } else {
      pageUnchanged++;

      console.log(
        `UNCHANGED → ${result.title}`,
      );
    }
  } catch (error) {
    failed++;

    console.log(
      `FAILED → ${
        error instanceof Error
          ? error.message
          : String(error)
      }`,
    );
  }


  await sleep(
    REQUEST_DELAY,
  );
}


await supabase.auth.signOut();


console.log("");
console.log(
  "==================================================",
);

console.log(
  " JMIT NEXT DEEP SYNC COMPLETE",
);

console.log(
  "==================================================",
);

console.log(
  `Visited   : ${visited.size}`,
);

console.log(
  `New       : ${pageNew}`,
);

console.log(
  `Updated   : ${pageUpdated}`,
);

console.log(
  `Unchanged : ${pageUnchanged}`,
);

console.log(
  `Skipped   : ${skipped}`,
);

console.log(
  `Failed    : ${failed}`,
);

console.log(
  `Resources : ${resourcesIndexed}`,
);

console.log("");
