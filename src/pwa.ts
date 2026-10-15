import { useEffect, useState } from "react";

// Chrome and Edge fire this when HQ can be installed; Safari never does (Share → Add to Home Screen there).
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    listeners.forEach((fn) => fn());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((fn) => fn());
  });
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Offline support is a bonus; the page works without it.
  });
}

/**
 * Keep the status bar and title bar the colour of the top of the page: the white header on
 * phones, the grey canvas around the panel on wider screens. Void merges meta tags by name,
 * so the media-specific value is set here. Returns a cleanup function for useEffect.
 */
export function syncThemeColor() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;
  const wide = window.matchMedia("(min-width: 768px)");
  const apply = () => meta.setAttribute("content", wide.matches ? "#f4f4f5" : "#ffffff");
  apply();
  wide.addEventListener("change", apply);
  return () => wide.removeEventListener("change", apply);
}

/** Whether the browser offered to install HQ, and a function that shows its prompt. */
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const sync = () => setCanInstall(deferred !== null);
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    const event = deferred;
    deferred = null;
    setCanInstall(false);
    await event.prompt();
  }

  return { canInstall, install };
}
