import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@supabase/supabase-js";

const envFile = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(envFile)) {
  const { config } = await import("dotenv");

  config({
    path: envFile,
    override: true,
  });
}

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
    "Missing Supabase URL/publishable key in .env.local",
  );

  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing temporary importer admin credentials.",
  );

  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

const login = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
});

if (login.error || !login.data.user) {
  console.error(
    "Admin login failed:",
    login.error?.message,
  );

  process.exit(1);
}

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", login.data.user.id)
  .single();

if (
  !profile ||
  !["admin", "editor"].includes(profile.role)
) {
  console.error(
    "This account is not a JMIT NEXT admin/editor.",
  );

  process.exit(1);
}

console.log("");
console.log("✓ Admin authentication successful");
console.log(`✓ Role: ${profile.role}`);
console.log("");

const START_URL =
  "https://www.jmit.ac.in/";

const MAX_PAGES = 800;

const USER_AGENT =
  "JMIT-Next-Educational-Redesign/1.0";

const queue = [
  START_URL,
];

const queued = new Set(queue);
const visited = new Set();

let imported = 0;
let skipped = 0;
let failed = 0;

const blockedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".css",
  ".js",
  ".zip",
  ".rar",
  ".7z",
  ".mp4",
  ".mp3",
  ".avi",
  ".mov",
];

const documentExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

function normalizeUrl(value, base = START_URL) {
  try {
    if (!value) return null;

    const trimmed = value.trim();

    if (
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

    const hostname =
      url.hostname.toLowerCase();

    if (
      hostname !== "jmit.ac.in" &&
      hostname !== "www.jmit.ac.in"
    ) {
      return null;
    }

    url.protocol = "https:";
    url.hostname = "www.jmit.ac.in";

    url.hash = "";

    /*
     * Most query parameters on the legacy website are not
     * needed for canonical content pages.
     */
    url.search = "";

    let pathname =
      url.pathname.replace(/\/+/g, "/");

    if (
      pathname.length > 1 &&
      pathname.endsWith("/")
    ) {
      pathname =
        pathname.slice(0, -1);
    }

    url.pathname = pathname;

    return url.toString();
  } catch {
    return null;
  }
}

function extensionOf(url) {
  try {
    return path
      .extname(new URL(url).pathname)
      .toLowerCase();
  } catch {
    return "";
  }
}

function isDocument(url) {
  return documentExtensions.includes(
    extensionOf(url),
  );
}

function isBlockedAsset(url) {
  return blockedExtensions.includes(
    extensionOf(url),
  );
}

function shouldCrawl(url) {
  if (!url) return false;

  if (isDocument(url)) return false;
  if (isBlockedAsset(url)) return false;

  const pathname =
    new URL(url).pathname.toLowerCase();

  if (
    pathname.startsWith("/admin") ||
    pathname.includes("/login") ||
    pathname.includes("/logout")
  ) {
    return false;
  }

  return true;
}

function slugFromUrl(url) {
  const pathname =
    new URL(url).pathname
      .replace(/^\/+|\/+$/g, "")
      .replace(/\.(html?|php)$/i, "");

  if (!pathname) {
    return "legacy-home";
  }

  return pathname
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/\//g, "--")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function classifyPage(title, url) {
  const value =
    `${title} ${url}`.toLowerCase();

  if (
    /admission|counselling|scholarship|fee structure/.test(
      value,
    )
  ) {
    return "Admissions";
  }

  if (
    /placement|training.*placement|industry interaction|recruit/.test(
      value,
    )
  ) {
    return "Placements";
  }

  if (
    /hostel|library|sports|club|societ|campus|auditorium|ncc|nss|entrepreneur/.test(
      value,
    )
  ) {
    return "Campus Life";
  }

  if (
    /alumni/.test(value)
  ) {
    return "Alumni";
  }

  if (
    /iqac|quality assurance/.test(
      value,
    )
  ) {
    return "IQAC";
  }

  if (
    /faculty|syllabus|time table|timetable|lesson plan|mentor mentee|peo|pso|course|computer science|information technology|mechanical|electrical|bca|bba|mba|academic|research/.test(
      value,
    )
  ) {
    return "Academics";
  }

  if (
    /director|committee|board of governors|organization|mandatory disclosure|career|equal opportunity/.test(
      value,
    )
  ) {
    return "Administration";
  }

  if (
    /gallery|media clipping|photo|video/.test(
      value,
    )
  ) {
    return "Gallery";
  }

  if (
    /profile|heritage|about/.test(
      value,
    )
  ) {
    return "About";
  }

  return "General";
}

function cleanTitle(title) {
  return String(title || "")
    .replace(
      /\s*\|\s*JMIT.*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteAssetUrl(value, pageUrl) {
  try {
    return new URL(
      value,
      pageUrl,
    ).toString();
  } catch {
    return value;
  }
}

function rewriteContentLinks(
  $,
  container,
  pageUrl,
) {
  container
    .find("a[href]")
    .each((_, element) => {
      const anchor =
        $(element);

      const originalHref =
        anchor.attr("href");

      if (!originalHref) return;

      const internal =
        normalizeUrl(
          originalHref,
          pageUrl,
        );

      if (!internal) {
        /*
         * Preserve genuine external links.
         */
        try {
          anchor.attr(
            "href",
            new URL(
              originalHref,
              pageUrl,
            ).toString(),
          );
        } catch {}

        return;
      }

      if (
        isDocument(internal) ||
        isBlockedAsset(internal)
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
    });

  container
    .find("img[src]")
    .each((_, element) => {
      const image =
        $(element);

      const src =
        image.attr("src");

      if (!src) return;

      image.attr(
        "src",
        absoluteAssetUrl(
          src,
          pageUrl,
        ),
      );

      image.attr(
        "loading",
        "lazy",
      );
    });
}

function extractDocuments(
  $,
  container,
  pageUrl,
) {
  const documents = [];

  const seen = new Set();

  container
    .find("a[href]")
    .each((_, element) => {
      const href =
        $(element).attr("href");

      const absolute =
        normalizeUrl(
          href,
          pageUrl,
        );

      if (
        !absolute ||
        !isDocument(absolute) ||
        seen.has(absolute)
      ) {
        return;
      }

      seen.add(absolute);

      documents.push({
        title:
          $(element)
            .text()
            .replace(/\s+/g, " ")
            .trim() ||
          path.basename(
            new URL(
              absolute,
            ).pathname,
          ),

        url: absolute,

        type:
          extensionOf(
            absolute,
          ).replace(".", ""),
      });
    });

  return documents;
}

function findContentContainer($) {
  const selectors = [
    "main",
    ".page-content",
    ".entry-content",
    ".content-area",
    ".inner-content",
    ".content",
    "#content",
    "article",
    ".container",
    "body",
  ];

  for (const selector of selectors) {
    const candidate =
      $(selector).first();

    if (
      candidate.length &&
      candidate.text().trim().length >
        100
    ) {
      return candidate;
    }
  }

  return $("body");
}

function removeNoise($, container) {
  container
    .find(
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
        ".social",
        ".social-links",
        ".preloader",
        ".modal",
      ].join(","),
    )
    .remove();

  /*
   * Remove inline event handlers.
   */
  container
    .find("*")
    .each((_, element) => {
      const attribs =
        element.attribs || {};

      Object.keys(attribs)
        .filter((name) =>
          /^on/i.test(name),
        )
        .forEach((name) => {
          $(element).removeAttr(
            name,
          );
        });
    });
}

async function importPage(url) {
  const response =
    await fetch(url, {
      headers: {
        "user-agent":
          USER_AGENT,
        accept:
          "text/html,application/xhtml+xml",
      },

      redirect: "follow",

      signal:
        AbortSignal.timeout(
          20000,
        ),
    });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`,
    );
  }

  const contentType =
    response.headers
      .get("content-type")
      ?.toLowerCase() || "";

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
    cheerio.load(html);

  /*
   * Discover links from the ORIGINAL DOM before removing menus,
   * because the old navigation is useful for finding every page.
   */
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
        normalized &&
        shouldCrawl(
          normalized,
        ) &&
        !visited.has(
          normalized,
        ) &&
        !queued.has(
          normalized,
        ) &&
        queue.length +
          visited.size <
          MAX_PAGES * 2
      ) {
        queued.add(
          normalized,
        );

        queue.push(
          normalized,
        );
      }
    },
  );

  let title =
    cleanTitle(
      $("h1")
        .first()
        .text(),
    );

  if (!title) {
    title =
      cleanTitle(
        $("title").text(),
      );
  }

  if (!title) {
    title =
      new URL(url).pathname;
  }

  const metaDescription =
    $(
      'meta[name="description"]',
    ).attr("content")?.trim() ||
    "";

  const container =
    findContentContainer($);

  removeNoise(
    $,
    container,
  );

  const documents =
    extractDocuments(
      $,
      container,
      url,
    );

  rewriteContentLinks(
    $,
    container,
    url,
  );

  const rawHtml =
    container.html() || "";

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
    cheerio
      .load(safeHtml)
      .text()
      .replace(/\s+/g, " ")
      .trim();

  /*
   * Skip pages that contain practically no useful content.
   */
  if (
    text.length < 40
  ) {
    return {
      skipped: true,
    };
  }

  const slug =
    slugFromUrl(url);

  const section =
    classifyPage(
      title,
      url,
    );

  const description =
    metaDescription ||
    text.slice(
      0,
      300,
    );

  const payload = {
    title,
    slug,

    seo_title: title,

    seo_description:
      description.slice(
        0,
        300,
      ),

    is_published: true,

    content: {
      format:
        "imported-html",

      section,

      html:
        safeHtml,

      text,

      source_url:
        url,

      documents,

      imported_at:
        new Date().toISOString(),

      source:
        "jmit.ac.in",
    },
  };

  const {
    error,
  } = await supabase
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
    skipped: false,
    title,
    slug,
    section,
    documents:
      documents.length,
  };
}

console.log(
  "==============================================",
);
console.log(
  " JMIT NEXT - PUBLIC CONTENT IMPORT",
);
console.log(
  "==============================================",
);

console.log(
  `Starting from: ${START_URL}`,
);

console.log(
  `Maximum HTML pages: ${MAX_PAGES}`,
);

console.log("");

while (
  queue.length &&
  visited.size <
    MAX_PAGES
) {
  const url =
    queue.shift();

  if (
    !url ||
    visited.has(url)
  ) {
    continue;
  }

  visited.add(url);

  const number =
    visited.size;

  try {
    process.stdout.write(
      `[${number}/${MAX_PAGES}] ${url} ... `,
    );

    const result =
      await importPage(url);

    if (
      result.skipped
    ) {
      skipped++;

      console.log(
        "SKIPPED",
      );
    } else {
      imported++;

      console.log(
        `IMPORTED → ${result.section} → ${result.title}`,
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

  /*
   * Deliberately polite crawl speed.
   */
  await sleep(175);
}

await supabase.auth.signOut();

console.log("");
console.log(
  "==============================================",
);
console.log(
  " IMPORT COMPLETE",
);
console.log(
  "==============================================",
);

console.log(
  `Visited : ${visited.size}`,
);

console.log(
  `Imported: ${imported}`,
);

console.log(
  `Skipped : ${skipped}`,
);

console.log(
  `Failed  : ${failed}`,
);

console.log("");
console.log(
  "Open /directory after starting Next.js.",
);
