import { useEffect, useRef, useState } from "react";
import { load, save } from "../src/storage";
import { nudges, thoughts } from "../src/thoughts";
import { clock, dayOfYear, greetingFor, partOfDay, useNow, ymd } from "../src/time";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function HomePage() {
  const now = useNow();
  const hour = now ? now.getHours() : 12;
  const nudgeList = nudges[partOfDay(hour)];
  const nudge = now ? nudgeList[(dayOfYear(now) + hour) % nudgeList.length] : "";

  return (
    <div className="page">
      <header className="hello">
        <p className="date">{now ? `${dateFormat.format(now)} · ${clock(now)}` : " "}</p>
        <h1>{now ? greetingFor(hour) : "Welcome back"}, Avvos</h1>
        <p className="nudge">{nudge || " "}</p>
      </header>

      <OneThing today={now ? ymd(now) : null} />
      <Ask />
      <ThoughtForToday now={now} />
    </div>
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
    <section className="panel" aria-labelledby="one-thing">
      <h2 id="one-thing">Today’s one thing</h2>
      {showForm ? (
        <form className="inline-form" onSubmit={submit} autoComplete="off">
          <label className="visually-hidden" htmlFor="intent-input">
            Today’s one thing
          </label>
          <input
            ref={inputRef}
            id="intent-input"
            className="text-input"
            maxLength={140}
            placeholder="What matters most today?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      ) : (
        <div className={`intent${item.done ? " is-done" : ""}`}>
          <button
            className="check"
            type="button"
            aria-pressed={item.done}
            aria-label={item.done ? "Mark as not done" : "Mark as done"}
            onClick={() => update({ ...item, done: !item.done })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 12.5 4 4 8-9" />
            </svg>
          </button>
          <p className="intent-text">{item.text}</p>
          <button
            className="link-btn"
            type="button"
            onClick={() => {
              setDraft(item.text);
              setEditing(true);
            }}
          >
            Edit
          </button>
        </div>
      )}
      {item?.done && !editing && <p className="note">Done. Good day.</p>}
      {offerCarry && (
        <p className="note">
          Yesterday: <em>{yesterday.text}</em>{" "}
          <button
            className="link-btn"
            type="button"
            onClick={() => update({ text: yesterday.text, done: false })}
          >
            Carry it over
          </button>
        </p>
      )}
    </section>
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
    <section className="panel" aria-labelledby="ask">
      <h2 id="ask">Ask</h2>
      <form
        className="inline-form"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          linkRef.current?.click();
          setQuestion("");
        }}
      >
        <div className="segmented" role="radiogroup" aria-label="Who to ask">
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
            >
              {minds[key].name}
            </button>
          ))}
        </div>
        <label className="visually-hidden" htmlFor="ask-input">
          Your question
        </label>
        <input
          id="ask-input"
          className="text-input"
          placeholder={`Ask ${m.name} anything`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <a
          ref={linkRef}
          className="btn btn-primary"
          href={q ? m.ask(q) : m.home}
          target="_blank"
          rel="noopener"
        >
          Open {m.name}
        </a>
      </form>
    </section>
  );
}

/* ---------- thought for today ---------- */

function ThoughtForToday({ now }: { now: Date | null }) {
  const [offset, setOffset] = useState(0);
  const base = now ? dayOfYear(now) * 7 + now.getFullYear() : 0;
  const thought = thoughts[(base + offset) % thoughts.length];

  return (
    <figure className="thought" data-ready={now !== null}>
      <figcaption className="thought-head">
        <span>Thought for today</span>
        <button className="link-btn" type="button" onClick={() => setOffset((o) => o + 1)}>
          Another
        </button>
      </figcaption>
      <blockquote>“{thought.text}”</blockquote>
      <p className="cite">
        {thought.who}, {thought.where}
      </p>
    </figure>
  );
}
