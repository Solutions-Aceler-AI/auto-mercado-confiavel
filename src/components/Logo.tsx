import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 17h14M6 17l1.5-5h9L18 17M7 12l1-4h8l1 4M7.5 17v2M16.5 17v2" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight">
        Auto<span className="text-accent">Market</span>
      </span>
    </Link>
  );
}