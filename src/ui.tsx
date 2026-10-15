import clsx from "clsx";
import { Icon } from "./icons";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={clsx(
        "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] bg-hover px-1 font-sans text-[11px] leading-none font-medium text-ink-3 tabular-nums ring-1 ring-line ring-inset",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function Card({
  title,
  icon,
  action,
  className,
  children,
  ...rest
}: {
  title: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const id = `card-${title.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className={clsx("flex min-w-0 flex-col rounded-xl bg-panel shadow-card", className)}
      {...rest}
    >
      <header className="flex h-11 items-center justify-between gap-3 border-b border-line px-4">
        <h2 id={id} className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <Icon name={icon} className="size-4 text-ink-3" />
          {title}
        </h2>
        {action}
      </header>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </section>
  );
}

export const button = {
  primary:
    "tap inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 text-[13px] font-medium text-white shadow-button hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  secondary:
    "tap inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-panel px-3 text-[13px] font-medium text-ink shadow-card hover:bg-[#f8f8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  ghost:
    "tap inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium text-ink-2 hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent",
};

export const input =
  "h-9 w-full min-w-0 rounded-lg bg-panel px-3 text-[14px] text-ink shadow-card transition-shadow duration-150 ease-out placeholder:text-ink-3 focus:shadow-[0_0_0_1px_var(--color-accent),0_0_0_4px_rgb(94_106_210/0.15)] focus:outline-none";

export function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-5 place-items-center rounded-[5px] bg-accent text-[11px] font-semibold text-white shadow-button"
    >
      A
    </span>
  );
}
