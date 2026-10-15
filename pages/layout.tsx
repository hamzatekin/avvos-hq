import { useEffect } from "react";
import { Icon } from "../src/icons";
import { roomGroups } from "../src/rooms";
import "../src/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  // 1–6 open a link, / jumps to the ask box.
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
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          Avvos HQ
        </a>

        <nav className="links" aria-label="Links">
          {roomGroups.map((group) => (
            <div className="group" key={group.label}>
              <p className="group-label">{group.label}</p>
              <ul>
                {group.rooms.map((room) => (
                  <li key={room.key}>
                    <a
                      className="room"
                      href={room.href}
                      target="_blank"
                      rel="noopener"
                      data-key={room.key}
                      title={room.note}
                    >
                      <Icon name={room.icon} />
                      <span className="room-name">{room.name}</span>
                      <kbd>{room.key}</kbd>
                    </a>
                    {room.tabs && (
                      <div className="tabs">
                        {room.tabs.map((tab) => (
                          <a key={tab.name} href={tab.href} target="_blank" rel="noopener">
                            {tab.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <p className="hint">
          <kbd>1</kbd>–<kbd>6</kbd> open a link
          <br />
          <kbd>/</kbd> ask a question
        </p>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}
