export type SocialBadgeKind =
  | "admin"
  | "blue"
  | "student";


export default function SocialBadge({
  kind,
  size = 19,
}: {
  kind: SocialBadgeKind;
  size?: number;
}) {
  const title =
    kind === "admin"
      ? "JMIT Next Administrator"
      : kind === "blue"
        ? "Verified Student"
        : "Student Account";


  /*
   * Student accounts deliberately get a DOT,
   * never a checkmark.
   */
  if (
    kind ===
    "student"
  ) {
    const dot =
      Math.max(
        8,
        Math.round(
          size * 0.55,
        ),
      );


    return (
      <span
        title={
          title
        }
        aria-label={
          title
        }
        className="inline-flex shrink-0 items-center justify-center"
        style={{
          width:
            size,
          height:
            size,
        }}
      >
        <span
          className="rounded-full border border-amber-500 bg-amber-400 shadow-[0_0_7px_rgba(245,158,11,.65)] ring-2 ring-white dark:ring-slate-950"
          style={{
            width:
              dot,
            height:
              dot,
          }}
        />
      </span>
    );
  }


  const admin =
    kind ===
    "admin";


  return (
    <span
      title={
        title
      }
      aria-label={
        title
      }
      className={`inline-flex shrink-0 items-center justify-center rounded-full ring-2 ring-white shadow-md dark:ring-slate-950 ${
        admin
          ? "shadow-violet-500/40"
          : "shadow-blue-500/40"
      }`}
      style={{
        width:
          size,
        height:
          size,
      }}
    >
      <svg
        width={
          size
        }
        height={
          size
        }
        viewBox="0 0 24 24"
        aria-hidden="true"
      >

        <path
          d="M12 1.65 14.55 3.9l3.38-.17.9 3.22 2.87 1.82-1.24 3.23 1.24 3.23-2.87 1.82-.9 3.22-3.38-.17L12 22.35 9.45 20.1l-3.38.17-.9-3.22-2.87-1.82L3.54 12 2.3 8.77l2.87-1.82.9-3.22 3.38.17L12 1.65Z"
          fill={
            admin
              ? "#7c3aed"
              : "#2563eb"
          }
          stroke={
            admin
              ? "#a78bfa"
              : "#60a5fa"
          }
          strokeWidth="0.8"
        />


        <path
          d="m7.8 12.1 2.7 2.7 5.9-6.2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
