import type {
  SocialBadgeKind,
} from "@/components/social/social-badge";


export type SocialRoleKind =
  | SocialBadgeKind
  | "visitor";


export default function SocialRolePill({
  kind,
  compact = false,
}: {
  kind: SocialRoleKind;
  compact?: boolean;
}) {
  const label =
    kind === "admin"
      ? "Administrator"
      : kind === "blue"
        ? "Verified Student"
        : kind === "student"
          ? "Student"
          : "Visitor";


  const colors =
    kind === "admin"
      ? "border-violet-300 bg-violet-100 text-violet-800 shadow-violet-500/10 dark:border-violet-400/50 dark:bg-violet-500/20 dark:text-violet-100"
      : kind === "blue"
        ? "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-400/50 dark:bg-blue-500/20 dark:text-blue-100"
        : kind === "student"
          ? "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-400/50 dark:bg-amber-500/20 dark:text-amber-100"
          : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200";


  return (
    <span
      title={
        label
      }
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border font-black uppercase shadow-sm ${colors} ${
        compact
          ? "px-2 py-0.5 text-[8px] tracking-[0.09em]"
          : "px-3.5 py-1.5 text-[10px] tracking-[0.13em]"
      }`}
    >
      {
        label
      }
    </span>
  );
}
