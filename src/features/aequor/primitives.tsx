/**
 * Small pieces used by more than one screen.
 * Each one is presentational: data in, markup out, no lab state.
 */

import type { ReactNode } from "react";
import type { Base } from "./model";

export function DnaBaseButton({
  base,
  index,
  selected,
  mutating,
  onSelect,
}: {
  base: Base;
  index: number;
  selected: boolean;
  mutating: boolean;
  onSelect: () => void;
}) {
  const names = { A: "Adenine", T: "Thymine", C: "Cytosine", G: "Guanine" };
  return (
    <button
      type="button"
      data-base={base}
      data-selected={selected}
      data-mutating={mutating}
      className="dna-base"
      aria-pressed={selected}
      aria-label={`Base ${base}, ${names[base]}, position ${index + 1}`}
      onClick={onSelect}
    >
      {base}
    </button>
  );
}

export function PhosphateLink() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-2 shrink-0 bg-linear-to-r from-phosphate/70 to-phosphate/20"
    />
  );
}

export function MetricBar({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint?: string;
  tone: "cyan" | "teal" | "violet" | "guanine";
}) {
  const bar = {
    cyan: "bg-linear-to-r from-cyan-deep to-cyan shadow-[0_0_10px] shadow-cyan/40",
    teal: "bg-teal shadow-[0_0_8px] shadow-teal/40",
    violet: "bg-violet shadow-[0_0_8px] shadow-violet/40",
    guanine: "bg-guanine shadow-[0_0_8px] shadow-guanine/40",
  }[tone];
  const ink = {
    cyan: "text-cyan",
    teal: "text-teal",
    violet: "text-violet",
    guanine: "text-guanine",
  }[tone];
  const track = {
    cyan: "bg-cyan/10",
    teal: "bg-teal/10",
    violet: "bg-violet/10",
    guanine: "bg-guanine/10",
  }[tone];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-label text-muted/60">{label}</span>
        <span className={`font-mono text-sm font-bold ${ink}`}>{value}%</span>
      </div>
      <div className={`h-1.5 overflow-hidden rounded-full ${track}`} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={`h-full rounded-full transition-[width] duration-700 ${bar}`} style={{ width: `${value}%` }} />
      </div>
      {hint ? <p className="mt-1.5 font-mono text-[9px] text-muted/40">{hint}</p> : null}
    </div>
  );
}

export function SurvivalRing({ value }: { value: number }) {
  const size = 54;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-violet"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
      />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-28 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full border border-cyan/15 bg-cyan/5 text-cyan/40">
        {icon}
      </div>
      <p className="font-mono text-sm text-muted/50">{title}</p>
      <p className="mt-1 font-mono text-xs text-muted/35">{detail}</p>
    </div>
  );
}

export function SectionHead({ num, kicker, title }: { num: string; kicker: string; title: string }) {
  return (
    <div className="mb-7 flex items-end gap-5">
      <span className="select-none font-mono text-6xl leading-none font-bold text-cyan/10" aria-hidden="true">
        {num}
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 font-mono text-[10px] tracking-label text-cyan/55">{kicker}</p>
        <h2 className="font-display text-2xl leading-tight font-bold text-fg">{title}</h2>
      </div>
      <div className="mb-2 hidden h-px max-w-48 flex-1 bg-linear-to-r from-cyan/25 to-transparent md:block" />
    </div>
  );
}
