import Link from "next/link";
import type { ReactNode } from "react";

// Primitives partagées — design tokens Annexe A

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-3">{children}</p>;
}

export function Section({
  children,
  tone = "paper",
  id,
}: {
  children: ReactNode;
  tone?: "paper" | "light" | "navy";
  id?: string;
}) {
  const bg =
    tone === "navy"
      ? "bg-navy text-white"
      : tone === "light"
        ? "bg-light text-ink"
        : "bg-paper text-ink";
  return (
    <section id={id} className={`${bg} py-12 md:py-16`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-semibold transition-colors no-underline";
  const styles = {
    primary: "bg-gold text-navy hover:bg-gold-soft",
    secondary: "bg-royal text-white hover:bg-navy",
    ghost: "border border-white/40 text-white hover:bg-white/10",
  }[variant];
  const props = external ? { target: "_blank", rel: "noopener" } : {};
  return (
    <Link href={href} className={`${base} ${styles}`} {...props}>
      {children}
    </Link>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  tone = "dark",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="mb-8 flex max-w-3xl flex-col gap-3">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`title-1 gold-rule ${tone === "light" ? "!text-white" : ""}`}>{title}</h2>
      {intro && (
        <p className={`text-lg ${tone === "light" ? "text-white/80" : "text-grey"}`}>{intro}</p>
      )}
    </div>
  );
}

export function Callout({
  title,
  children,
  variant = "navy",
}: {
  title?: string;
  children: ReactNode;
  variant?: "navy" | "gold";
}) {
  const border = variant === "gold" ? "border-gold" : "border-navy";
  return (
    <div className={`bg-light border-l-4 ${border} p-5 my-6 rounded-r-md`}>
      {title && <p className="font-bold text-navy mb-1">{title}</p>}
      <div className="text-ink/90">{children}</div>
    </div>
  );
}
