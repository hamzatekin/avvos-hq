import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const dayOfYear = (d: Date) =>
  Math.round(
    (+new Date(d.getFullYear(), d.getMonth(), d.getDate()) - +new Date(d.getFullYear(), 0, 0)) /
      864e5,
  );

export const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export function greetingFor(h: number) {
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function partOfDay(h: number) {
  if (h < 5) return "late";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

/**
 * The current time, ticking each minute. Null during server rendering and the
 * first client render, so the server's clock (UTC) never leaks into the page.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    let interval = 0;
    const timeout = window.setTimeout(
      () => {
        setNow(new Date());
        interval = window.setInterval(() => setNow(new Date()), 60_000);
      },
      (60 - new Date().getSeconds()) * 1000 + 50,
    );
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);
  return now;
}
