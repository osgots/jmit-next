export default function BlueTick({
  type = "verified",
  size = 18,
}: {
  type?: string;
  size?: number;
}) {
  const title =
    type === "admin"
      ? "JMIT Next Administrator"
      : type === "official"
        ? "Official JMIT Next account"
        : "JMIT Next Verified";

  return (
    <span
      title={title}
      aria-label={title}
      className="inline-flex shrink-0 items-center"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#1677ff"
          d="M12 1.8 14.5 4l3.3-.2.9 3.1 2.8 1.8-1.2 3 1.2 3-2.8 1.8-.9 3.1-3.3-.2L12 22.2l-2.5-2.2-3.3.2-.9-3.1-2.8-1.8 1.2-3-1.2-3 2.8-1.8.9-3.1 3.3.2L12 1.8Z"
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
