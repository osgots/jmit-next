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
  /*
   * Normal students are NOT verified.
   * They receive a simple yellow identity dot.
   */
  if (kind === "student") {
    return (
      <span
        title="Student account"
        aria-label="Student account"
        className="inline-flex shrink-0 items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <span
          className="block rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 shadow-[0_0_6px_rgba(245,158,11,.35)]"
          style={{
            width: Math.max(8, Math.round(size * 0.55)),
            height: Math.max(8, Math.round(size * 0.55)),
          }}
        />
      </span>
    );
  }

  const id =
    `badge-${kind}-${Math.random()
      .toString(36)
      .slice(2)}`;

  const isAdmin =
    kind === "admin";

  const title =
    isAdmin
      ? "JMIT Next Administrator"
      : "Admin Verified Student";

  const gradient =
    isAdmin
      ? [
          "#6d28d9",
          "#a855f7",
          "#ec4899",
          "#6366f1",
        ]
      : [
          "#0284c7",
          "#2563eb",
          "#06b6d4",
          "#3b82f6",
        ];

  return (
    <span
      title={title}
      aria-label={title}
      className="inline-flex shrink-0"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={
          isAdmin
            ? "drop-shadow-[0_0_5px_rgba(168,85,247,.55)]"
            : ""
        }
      >
        <defs>
          <linearGradient
            id={id}
            x1="0"
            y1="0"
            x2="24"
            y2="24"
          >
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="35%" stopColor={gradient[1]} />
            <stop offset="70%" stopColor={gradient[2]} />
            <stop offset="100%" stopColor={gradient[3]} />
          </linearGradient>
        </defs>

        <path
          fill={`url(#${id})`}
          d="M12 1.8 14.5 4l3.3-.2.9 3.1 2.8 1.8-1.2 3 1.2 3-2.8 1.8-.9 3.1-3.3-.2L12 22.2 9.5 20l-3.3.2-.9-3.1-2.8-1.8 1.2-3-1.2-3 2.8-1.8.9-3.1 3.3.2L12 1.8Z"
        />

        <path
          d="m8 12.2 2.5 2.5 5.6-6"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
