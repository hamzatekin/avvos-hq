import type { IconName } from "./rooms";

type Name = IconName | "home" | "arrow" | "shuffle" | "check" | "target" | "quote" | "send";

const paths: Record<Name, React.ReactNode> = {
  sunrise: (
    <path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 6.5v2.5M6.2 9.7l1.6 1.6M17.8 9.7l-1.6 1.6" />
  ),
  notebook: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  sparkle: (
    <path d="M12 3.5c.6 4.4 2.5 7.6 8.5 8.5-6 .9-7.9 4.1-8.5 8.5-.6-4.4-2.5-7.6-8.5-8.5 6-.9 7.9-4.1 8.5-8.5Z" />
  ),
  chat: (
    <path d="M7.5 4.5h9A2.5 2.5 0 0 1 19 7v6.5a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V16h.5A2.5 2.5 0 0 1 5 13.5V7a2.5 2.5 0 0 1 2.5-2.5Z" />
  ),
  home: <path d="M4.5 10.5 12 4.5l7.5 6V19a1 1 0 0 1-1 1H15v-5.5H9V20H5.5a1 1 0 0 1-1-1v-8.5Z" />,
  arrow: <path d="M8 16 16 8M9.5 8H16v6.5" />,
  shuffle: (
    <path d="M4 7h3.5c2 0 3.2 1 4.3 2.6l.4.6M4 17h3.5c2 0 3.2-1 4.3-2.6l1.6-2.4c1.1-1.6 2.3-2.6 4.3-2.6H20M17.5 4.5 20 7l-2.5 2.5M16 17h4M17.5 14.5 20 17l-2.5 2.5" />
  ),
  check: <path d="m6.5 12.5 3.5 3.5 7.5-8" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  quote: (
    <path d="M10 7.5c-2.6.8-4.5 3-4.5 6v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H6.6M18.5 7.5c-2.6.8-4.5 3-4.5 6v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9" />
  ),
  send: <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" />,
};

export function Icon({ name, className = "size-4" }: { name: Name; className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
