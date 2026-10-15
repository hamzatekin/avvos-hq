import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Icon } from "../src/icons";
import { roomGroups } from "../src/rooms";
import { load, save } from "../src/storage";
import { useInstallPrompt } from "../src/pwa";
import { nudges, thoughts } from "../src/thoughts";
import { clock, dayOfYear, greetingFor, partOfDay, useNow, ymd } from "../src/time";
import { BrandMark, button, Card, input, Kbd } from "../src/ui";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const shortDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export default function HomePage() {
  const now = useNow();
  const hour = now ? now.getHours() : 12;
  const nudgeList = nudges[partOfDay(hour)];
  const nudge = now ? nudgeList[(dayOfYear(now) + hour) % nudgeList.length] : "";

  return (
    <>
      <header className="safe-x flex h-12 items-center justify-between gap-3 border-b border-line md:px-6">
        <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <span className="md:hidden">
            <BrandMark />
          </span>
          <span className="md:hidden">Avvos HQ</span>
          <span className="hidden md:inline">Home</span>
        </div>
        <div className="flex items-center gap-3">
          <InstallButton />
          <p className="text-[13px] text-ink-2 tabular-nums">
            {now ? (
              <>
                <span className="sm:hidden">{shortDate.format(now)}</span>
                <span className="max-sm:hidden">{dateFormat.format(now)}</span>{" "}
                <span className="text-ink-3">·</span> {clock(now)}
              </>
            ) : (
              " "
            )}
          </p>
        </div>
      </header>

      <div className="safe-x safe-b mx-auto w-full max-w-[1040px] pt-8 md:px-10 md:pt-12">
        <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.02em] text-balance text-ink md:text-[26px]">
          {now ? greetingFor(hour) : "Welcome back"}, Avvos
        </h1>
        <p className="mt-1.5 min-h-[1lh] text-[14px] text-pretty text-ink-2">{nudge}</p>

        <div className="mt-8 flex flex-col gap-8">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
            <div className="flex min-w-0 flex-col gap-4">
              <OneThing today={now ? ymd(now) : null} />
              <Ask />
            </div>
            <ThoughtForToday now={now} />
          </div>
          <Apps />
        </div>
      </div>
    </>
  );
}

function InstallButton() {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <button type="button" className={button.ghost} onClick={install}>
      <Icon name="download" className="size-3.5" />
      Install
    </button>
  );
}

/* ---------- today's one thing ---------- */

interface Intent {
  text: string;
  done: boolean;
}

function OneThing({ today }: { today: string | null }) {
  const [item, setItem] = useState<Intent | null>(null);
  const [yesterday, setYesterday] = useState<Intent | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!today) return;
    setItem(load<Intent>(`hq.intent.${today}`));
    const prev = new Date(`${today}T12:00:00`);
    prev.setDate(prev.getDate() - 1);
    setYesterday(load<Intent>(`hq.intent.${ymd(prev)}`));
  }, [today]);

  function update(next: Intent) {
    setItem(next);
    if (today) save(`hq.intent.${today}`, next);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    update({ text, done: false });
    setDraft("");
    setEditing(false);
  }

  const showForm = !item || editing;
  const offerCarry = !item && yesterday && yesterday.text && !yesterday.done;

  return (
    <Card
      title="Today’s one thing"
      icon="target"
      action={
        item && !editing ? (
          <button
            type="button"
            className={button.ghost}
            onClick={() => {
              setDraft(item.text);
              setEditing(true);
            }}
          >
            Edit
          </button>
        ) : null
      }
    >
      {showForm ? (
        <form className="flex gap-2" onSubmit={submit} autoComplete="off">
          <label className="sr-only" htmlFor="intent-input">
            Today’s one thing
          </label>
          <input
            ref={inputRef}
            id="intent-input"
            className={input}
            maxLength={140}
            placeholder="What matters most today?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className={button.primary} type="submit">
            Save
          </button>
        </form>
      ) : (
        <div className="flex items-start gap-3">
          <button
            type="button"
            aria-pressed={item.done}
            aria-label={item.done ? "Mark as not done" : "Mark as done"}
            onClick={() => update({ ...item, done: !item.done })}
            className={clsx(
              "tap mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              item.done
                ? "bg-accent text-white"
                : "text-transparent ring-[1.5px] ring-ink-3/70 ring-inset hover:bg-hover",
            )}
          >
            <Icon name="check" className="size-3 [stroke-width:2.6]" />
          </button>
          <p
            className={clsx(
              "min-w-0 text-[15px] leading-6 [overflow-wrap:anywhere] transition-colors duration-150",
              item.done ? "text-ink-3 line-through decoration-ink-3/40" : "text-ink",
            )}
          >
            {item.text}
          </p>
        </div>
      )}
      {item?.done && !editing && (
        <p className="mt-3 pl-[30px] text-[13px] text-ink-2">Done. Good day.</p>
      )}
      {offerCarry && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-ink-2">
          <span className="min-w-0 [overflow-wrap:anywhere]">
            Yesterday: <span className="text-ink">{yesterday.text}</span>
          </span>
          <button
            type="button"
            className="tap rounded text-[13px] font-medium text-accent hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => update({ text: yesterday.text, done: false })}
          >
            Carry it over
          </button>
        </p>
      )}
    </Card>
  );
}

/* ---------- ask ---------- */

const minds = {
  claude: {
    name: "Claude",
    home: "https://claude.ai/new",
    ask: (q: string) => `https://claude.ai/new?q=${encodeURIComponent(q)}`,
  },
  chatgpt: {
    name: "ChatGPT",
    home: "https://chatgpt.com/",
    ask: (q: string) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`,
  },
};
type MindKey = keyof typeof minds;
const mindKeys = Object.keys(minds) as MindKey[];

function Ask() {
  const [mind, setMind] = useState<MindKey>("claude");
  const [question, setQuestion] = useState("");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const radios = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const saved = load<string>("hq.mind");
    if (saved === "claude" || saved === "chatgpt") setMind(saved);
  }, []);

  function choose(next: MindKey, focus = false) {
    setMind(next);
    save("hq.mind", next);
    if (focus) radios.current[next]?.focus();
  }

  const m = minds[mind];
  const q = question.trim();

  return (
    <Card
      title="Ask"
      icon="sparkle"
      action={
        // Switches instantly: it's used too often to animate.
        <div
          role="radiogroup"
          aria-label="Who to ask"
          className="flex h-7 items-center rounded-md bg-hover p-0.5 ring-1 ring-line ring-inset"
        >
          {mindKeys.map((key) => (
            <button
              key={key}
              ref={(el) => {
                radios.current[key] = el;
              }}
              type="button"
              role="radio"
              aria-checked={mind === key}
              tabIndex={mind === key ? 0 : -1}
              onClick={() => choose(key)}
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
                e.preventDefault();
                const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
                const i = mindKeys.indexOf(mind);
                choose(mindKeys[(i + step + mindKeys.length) % mindKeys.length], true);
              }}
              className={clsx(
                "h-6 rounded-[5px] px-2 text-[12.5px] font-medium focus-visible:outline-2 focus-visible:outline-accent",
                mind === key ? "bg-panel text-ink shadow-card" : "text-ink-2 hover:text-ink",
              )}
            >
              {minds[key].name}
            </button>
          ))}
        </div>
      }
    >
      <form
        className="flex gap-2"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          linkRef.current?.click();
          setQuestion("");
        }}
      >
        <label className="sr-only" htmlFor="ask-input">
          Your question
        </label>
        <input
          id="ask-input"
          className={input}
          placeholder={`Ask ${m.name} anything`}
          enterKeyHint="go"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <a
          ref={linkRef}
          className={button.primary}
          href={q ? m.ask(q) : m.home}
          target="_blank"
          rel="noopener"
        >
          <span className="max-sm:sr-only">Open {m.name}</span>
          <Icon name="arrow" className="size-4" />
        </a>
      </form>
      <p className="mt-2.5 hidden items-center gap-1.5 text-[12px] text-ink-3 md:flex">
        <Kbd>/</Kbd> to focus, <Kbd>Enter</Kbd> opens it in a new tab
      </p>
    </Card>
  );
}

/* ---------- thought for today ---------- */

function ThoughtForToday({ now }: { now: Date | null }) {
  const [offset, setOffset] = useState(0);
  const base = now ? dayOfYear(now) * 7 + now.getFullYear() : 0;
  const index = (base + offset) % thoughts.length;
  const thought = thoughts[index];

  return (
    <Card
      title="Thought for today"
      icon="quote"
      action={
        <button type="button" className={button.ghost} onClick={() => setOffset((o) => o + 1)}>
          <Icon name="shuffle" className="size-3.5" />
          Another
        </button>
      }
    >
      {now && (
        // Remounts on each new thought so it fades in; blur hides the swap.
        <figure
          key={index}
          className="flex flex-1 flex-col justify-between gap-4 transition-[opacity,filter] duration-200 ease-out starting:opacity-0 starting:blur-[2px]"
        >
          <blockquote className="text-[17px] leading-[1.55] lg:text-[18px] tracking-[-0.011em] text-pretty text-ink">
            “{thought.text}”
          </blockquote>
          <figcaption className="text-[13px] text-ink-2">
            <span className="font-medium text-ink">{thought.who}</span>
            <span className="text-ink-3"> · </span>
            {thought.where}
          </figcaption>
        </figure>
      )}
    </Card>
  );
}

/* ---------- apps ---------- */

const rooms = roomGroups.flatMap((g) => g.rooms);

function Apps() {
  return (
    // On phones the sidebar is hidden, so the apps come first.
    <section aria-labelledby="apps" className="max-md:order-first">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="apps" className="text-[13px] font-medium text-ink">
          Apps
        </h2>
        <p className="hidden items-center gap-1 text-[12px] text-ink-3 md:flex">
          <Kbd>1</Kbd>–<Kbd>6</Kbd>
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {rooms.map((room) => (
          <li
            key={room.key}
            className="group relative flex min-w-0 items-center gap-3 rounded-xl bg-panel p-3 shadow-card transition-colors duration-150 ease-out hover:bg-[#fafafb]"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-canvas text-ink-2 ring-1 ring-line ring-inset">
              <Icon name={room.icon} className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <a
                href={room.href}
                target="_blank"
                rel="noopener"
                className="truncate text-[13.5px] leading-5 font-medium text-ink after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-accent"
              >
                {room.name}
              </a>
              {room.tabs ? (
                // Pergent's tabs take the place of its description.
                <div className="relative z-10 flex flex-wrap gap-1">
                  {room.tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      target="_blank"
                      rel="noopener"
                      className="tap inline-flex h-[22px] items-center rounded-md bg-hover px-1.5 text-[12px] font-medium text-ink-2 ring-1 ring-line ring-inset hover:bg-press hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      {tab.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="truncate text-[12.5px] leading-[18px] text-ink-2" title={room.note}>
                  {room.note}
                </p>
              )}
            </div>
            <Icon
              name="arrow"
              className="size-4 text-ink-3 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
