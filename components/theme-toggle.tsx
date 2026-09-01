"use client";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "next-themes";

import {
  useEffect,
  useState,
} from "react";


export default function ThemeToggle() {
  const {
    resolvedTheme,
    setTheme,
  } =
    useTheme();

  const [
    mounted,
    setMounted,
  ] =
    useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
    );
  }


  const dark =
    resolvedTheme ===
    "dark";


  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          dark
            ? "light"
            : "dark",
        )
      }
      title={
        dark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      aria-label="Toggle color theme"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {dark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}
