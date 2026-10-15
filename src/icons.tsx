import type { IconName } from "./rooms";

const paths: Record<IconName, React.ReactNode> = {
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
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
