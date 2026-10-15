import { useEffect } from "react";
import { Icon } from "../src/icons";
import { roomGroups } from "../src/rooms";
import { BrandMark, Kbd } from "../src/ui";
import "../src/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  // 1–6 open a link, / jumps to the ask box. No animation on any of these.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        if (e.key === "Escape") target.blur();
        return;
      }
      if (e.key === "/") {
        const ask = document.getElementById("ask-input");
        if (ask) {
          e.preventDefault();
          ask.focus();
        }
        return;
      }
      if (!/^[1-9]$/.test(e.key)) return;
      const room = document.querySelector<HTMLAnchorElement>(`a[data-key="${e.key}"]`);
      if (room) {
        e.preventDefault();
        room.click();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[236px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col px-3 pt-3 pb-4 md:flex">
        <a
          href="/"
          className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] font-semibold tracking-[-0.01em] text-ink hover:bg-hover"
        >
          <BrandMark />
          Avvos HQ
        </a>

        <nav aria-label="Links" className="mt-3 flex flex-col gap-px overflow-y-auto">
          <a
            href="/"
            aria-current="page"
            className="flex h-7 items-center gap-2 rounded-md bg-press px-2 text-[13px] font-medium text-ink"
          >
            <Icon name="home" className="size-4 text-ink-2" />
            Home
          </a>

          {roomGroups.map((group) => (
            <div key={group.label} className="mt-4">
              <p className="mb-1 px-2 text-[12px] font-medium text-ink-3">{group.label}</p>
              <ul className="flex flex-col gap-px">
                {group.rooms.map((room) => (
                  <li key={room.key}>
                    <a
                      href={room.href}
                      target="_blank"
                      rel="noopener"
                      data-key={room.key}
                      title={room.note}
                      className="group flex h-7 items-center gap-2 rounded-md px-2 text-[13px] text-ink-2 transition-colors duration-100 ease-out hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <Icon name={room.icon} className="size-4 text-ink-3 group-hover:text-ink-2" />
                      <span className="min-w-0 flex-1 truncate">{room.name}</span>
                      <Kbd className="opacity-0 transition-opacity duration-100 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {room.key}
                      </Kbd>
                    </a>
                    {room.tabs && (
                      <ul className="mt-px flex flex-col gap-px">
                        {room.tabs.map((tab) => (
                          <li key={tab.name}>
                            <a
                              href={tab.href}
                              target="_blank"
                              rel="noopener"
                              className="flex h-7 items-center rounded-md pr-2 pl-8 text-[13px] text-ink-2 transition-colors duration-100 ease-out hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                            >
                              {tab.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1.5 px-2 text-[12px] text-ink-3">
          <p className="flex items-center gap-1.5">
            <Kbd>1</Kbd>–<Kbd>6</Kbd> open a link
          </p>
          <p className="flex items-center gap-1.5">
            <Kbd>/</Kbd> ask a question
          </p>
        </div>
      </aside>

      <div className="min-w-0 md:py-2 md:pr-2">
        <main className="min-h-dvh bg-panel md:min-h-[calc(100dvh-16px)] md:rounded-xl md:shadow-panel">
          {children}
        </main>
      </div>
    </div>
  );
}
