"use client";

import Fuse from "fuse.js";
import {
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { searchItems } from "@/lib/site-data";

type CommandSearchProps = {
  open: boolean;
  onClose: () => void;
};

export default function CommandSearch({
  open,
  onClose,
}: CommandSearchProps) {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(searchItems, {
        keys: [
          {
            name: "title",
            weight: 0.5,
          },
          {
            name: "keywords",
            weight: 0.35,
          },
          {
            name: "description",
            weight: 0.15,
          },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        includeScore: true,
      }),
    [],
  );

  const results = query.trim()
    ? fuse.search(query).slice(0, 8).map((result) => result.item)
    : searchItems.slice(0, 8);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);

    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  function navigate(href: string) {
    onClose();
    router.push(href);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (results[0]) {
      navigate(results[0].href);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-[#020817]/70 px-4 pt-[8vh] backdrop-blur-md sm:pt-[12vh]"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black/30">
        <div className="border-b border-slate-200 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3"
          >
            <Search
              size={21}
              className="shrink-0 text-blue-700"
            />

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search JMIT..."
              className="min-w-0 flex-1 bg-transparent py-2 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close search"
            >
              <X size={17} />
            </button>
          </form>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          <div className="mb-2 flex items-center justify-between px-2 py-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              {query ? "Search Results" : "Popular Destinations"}
            </p>

            <p className="text-[10px] font-semibold text-slate-400">
              ESC to close
            </p>
          </div>

          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={`${item.category}-${item.title}`}
                  onClick={() => navigate(item.href)}
                  className="group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:bg-blue-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-blue-700 transition group-hover:bg-blue-100">
                    <Search size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900">
                      {item.title}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="hidden items-center gap-3 sm:flex">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                      {item.category}
                    </span>

                    <ArrowRight
                      size={15}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-700"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <Search
                size={28}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-black text-slate-700">
                Nothing found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try syllabus, CSE, hostel or placements.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
          <p className="text-[10px] text-slate-400">
            JMIT NEXT Universal Search
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="rounded-md border border-slate-200 bg-white px-2 py-1">
              Enter
            </span>
            Open
          </div>
        </div>
      </div>
    </div>
  );
}
