// The links in the sidebar. `key` is the number shortcut that opens a room.

export type IconName = "sunrise" | "notebook" | "mail" | "calendar" | "sparkle" | "chat";

export interface Room {
  key: string;
  name: string;
  note: string;
  href: string;
  icon: IconName;
  tabs?: { name: string; href: string }[];
}

export interface RoomGroup {
  label: string;
  rooms: Room[];
}

export const roomGroups: RoomGroup[] = [
  {
    label: "Apps",
    rooms: [
      {
        key: "1",
        name: "Pergent",
        note: "Daily runs from the Hetzner box",
        href: "https://pergent.hamzatekin.dev/",
        icon: "sunrise",
        tabs: [
          { name: "News", href: "https://pergent.hamzatekin.dev/read/news" },
          { name: "Tech", href: "https://pergent.hamzatekin.dev/read/tech" },
          { name: "Pains", href: "https://pergent.hamzatekin.dev/read/pains" },
        ],
      },
      {
        key: "2",
        name: "Aletheia",
        note: "Notes",
        href: "https://aletheia.hmztkn.workers.dev/",
        icon: "notebook",
      },
    ],
  },
  {
    label: "Inbox",
    rooms: [
      {
        key: "3",
        name: "Gmail",
        note: "Mail and newsletters",
        href: "https://mail.google.com/",
        icon: "mail",
      },
      {
        key: "4",
        name: "Calendar",
        note: "Standups and meetings",
        href: "https://calendar.google.com/",
        icon: "calendar",
      },
    ],
  },
  {
    label: "AI",
    rooms: [
      {
        key: "5",
        name: "Claude",
        note: "claude.ai",
        href: "https://claude.ai/new",
        icon: "sparkle",
      },
      {
        key: "6",
        name: "ChatGPT",
        note: "chatgpt.com",
        href: "https://chatgpt.com/",
        icon: "chat",
      },
    ],
  },
];
