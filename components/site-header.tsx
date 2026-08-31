"use client";

import { motion } from "motion/react";
import {
  ChevronDown,
  Command,
  GraduationCap,
  Menu,
  Search,
  Users,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import CommandSearch from "@/components/command-search";

import {
  mainNavigation,
  megaMenus,
} from "@/lib/jmit-navigation";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [activeMenu, setActiveMenu] =
    useState<string | null>(null);

  const closeSearch =
    useCallback(() => {
      setSearchOpen(false);
    }, []);

  useEffect(() => {
    function keyboard(
      event: KeyboardEvent,
    ) {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener(
      "keydown",
      keyboard,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        keyboard,
      );
  }, []);

  return (
    <>
      <div className="relative z-[80] bg-[#061b42] px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white">
        <span className="font-black text-cyan-300">
          JMIT NEXT
        </span>

        <span className="mx-2 text-white/30">
          •
        </span>

        Modern College Information &
        Management Portal
      </div>

      <header
        onMouseLeave={() =>
          setActiveMenu(null)
        }
        className="sticky top-0 z-[70] border-b border-slate-200/80 bg-white/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-950 to-blue-600 text-white shadow-lg">
              <GraduationCap size={23} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-[#061b42]">
                  JMIT
                </span>

                <span className="rounded-md bg-cyan-100 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-cyan-700">
                  NEXT
                </span>
              </div>

              <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
                Radaur, Haryana
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {mainNavigation.map(
              (item) => (
                <div
                  key={item.label}
                  onMouseEnter={() =>
                    setActiveMenu(
                      item.label === "Home"
                        ? null
                        : item.label,
                    )
                  }
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      activeMenu ===
                      item.label
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                    }`}
                  >
                    {item.label}

                    {item.label !==
                      "Home" && (
                      <ChevronDown
                        size={13}
                        className={`opacity-50 transition ${
                          activeMenu ===
                          item.label
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              ),
            )}

            <Link
              href="/social-connect"
              onMouseEnter={() =>
                setActiveMenu(null)
              }
              className="ml-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5"
            >
              <Users size={16} />
              Social Connect
            </Link>
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <button
              onClick={() =>
                setSearchOpen(true)
              }
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50"
            >
              <Search size={16} />

              Search

              <span className="ml-1 flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
                <Command size={10} /> K
              </span>
            </button>
          </div>

          <button
            onClick={() =>
              setMobileOpen(
                (value) => !value,
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
            aria-label="Open navigation"
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </div>

        {activeMenu &&
          megaMenus[activeMenu] && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.15,
              }}
              className="absolute left-0 top-full hidden w-full border-t border-slate-100 bg-white shadow-2xl lg:block"
            >
              <div className="mx-auto grid max-w-7xl grid-cols-3 gap-10 px-8 py-8">
                {megaMenus[
                  activeMenu
                ].map((group) => (
                  <div
                    key={group.title}
                  >
                    <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                      {group.title}
                    </p>

                    <div className="space-y-1">
                      {group.links.map(
                        (link) => (
                          <Link
                            key={
                              link.label
                            }
                            href={
                              link.href
                            }
                            onClick={() =>
                              setActiveMenu(
                                null,
                              )
                            }
                            className="group block rounded-xl px-3 py-2.5 transition hover:bg-blue-50"
                          >
                            <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                              {
                                link.label
                              }
                            </p>

                            {link.description && (
                              <p className="mt-0.5 text-xs text-slate-400">
                                {
                                  link.description
                                }
                              </p>
                            )}
                          </Link>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="border-t border-slate-100 bg-white px-5 py-5 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setMobileOpen(false);
                }}
                className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600"
              >
                <Search size={17} />
                Search JMIT
              </button>

              {mainNavigation.map(
                (item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-blue-50"
                  >
                    {item.label}
                  </Link>
                ),
              )}

              <Link
                href="/social-connect"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 px-4 py-3 font-black text-white"
              >
                <Users size={17} />
                Social Connect
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      <CommandSearch
        open={searchOpen}
        onClose={closeSearch}
      />
    </>
  );
}
