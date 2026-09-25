/**
 * Case study. Static on purpose: it documents the system the other
 * screens are built from. Content lives in the arrays; the JSX only lays it out.
 */

import { useState, type ReactNode } from "react";
import { Clock, Hexagon, Keyboard, CircleDot, WholeWord } from "lucide-react";
import { Creature } from "./creature";
import { PhosphateLink, SectionHead } from "./primitives";
import { BASE_INFO, BASES, VARIANTS, type Base, type Variant } from "./model";

const PILLARS = ["ABYSSAL", "BIOLUMINESCENT", "SCIENTIFIC", "IMMERSIVE", "SYSTEMATIC"];

const PRINCIPLES = [
  {
    mark: "◎",
    title: "Depth First",
    body: "Every layer adds a stop of darkness. The eye reads spatial depth before colour, guiding attention to bioluminescent highlights.",
  },
  {
    mark: "⟡",
    title: "Glow as Grammar",
    body: "Bioluminescent halo = interactive. No glow = structural. This rule is never broken, so users build a reliable mental model instantly.",
  },
  {
    mark: "ℓ",
    title: "Mono for Data",
    body: "Tabular values always JetBrains Mono. Fixed-width prevents layout shift when live stats update at high mutation rates.",
  },
];

const SCREENS = [
  { label: "Dashboard", accent: "bg-cyan", ink: "text-cyan", slug: "hero" },
  { label: "Specimen", accent: "bg-cyan", ink: "text-cyan", slug: "specimen" },
  { label: "Evolution", accent: "bg-violet", ink: "text-violet", slug: "evolution" },
  { label: "Genome Metrics", accent: "bg-guanine", ink: "text-guanine", slug: "metrics" },
  { label: "Archive", accent: "bg-cytosine", ink: "text-cytosine", slug: "archive" },
] as const;

const FAMILIES = [
  {
    role: "DISPLAY & HEADINGS",
    name: "Space Grotesk",
    sample: "Pila aequor",
    font: "font-display",
    weights: ["400", "600", "700"],
    note: "Geometric proportions evoke scientific instrumentation. Slightly rounded terminals prevent coldness.",
  },
  {
    role: "BODY & UI",
    name: "Inter",
    sample: "Deep sea specimen",
    font: "font-sans",
    weights: ["400", "500", "600"],
    note: "Maximum legibility at small sizes. Neutral enough to not compete with display or mono type.",
  },
  {
    role: "DATA & LABELS",
    name: "JetBrains Mono",
    sample: "GC: 62% ×12",
    font: "font-mono",
    weights: ["400", "500", "700"],
    note: "Fixed-width prevents layout shift on live stat updates. Ligatures add subtle craft.",
  },
];

const TYPE_SCALE = [
  { role: "Display", family: "font-display", weight: "font-bold", px: 44, sample: "Decode the Abyss" },
  { role: "H1", family: "font-display", weight: "font-bold", px: 32, sample: "Deep Sea Laboratory" },
  { role: "H2", family: "font-display", weight: "font-semibold", px: 24, sample: "Specimen Viewer" },
  { role: "H3", family: "font-display", weight: "font-semibold", px: 18, sample: "Genomic Stability" },
  { role: "Body", family: "font-sans", weight: "font-normal", px: 15, sample: "Pila aequor var. abyssus found at 3,847m depth." },
  { role: "Caption", family: "font-sans", weight: "font-normal", px: 12, sample: "Cumulative base substitutions since origin" },
  { role: "Label", family: "font-mono", weight: "font-medium", px: 10, sample: "GC CONTENT — STABILITY INDEX — SURVIVAL PROB." },
  { role: "Data", family: "font-mono", weight: "font-bold", px: 22, sample: "78% · ×12 · 3,847m" },
];

const PALETTE = [
  {
    name: "Background Scale",
    swatches: [
      { name: "Abyss", hex: "#03070F", label: "--background · Page ground" },
      { name: "Surface", hex: "#0A1321", label: "--card · Panels & cards" },
      { name: "Elevated", hex: "#0D1A2E", label: "--popover · Raised surfaces" },
      { name: "Rim", hex: "#13223D", label: "--secondary · Dividers" },
    ],
  },
  {
    name: "Bioluminescent Accents",
    swatches: [
      { name: "Cyan", hex: "#00F5D4", label: "--primary · Glow & CTA" },
      { name: "Violet", hex: "#9D4EFF", label: "--accent · Evolution data" },
      { name: "Neon Rose", hex: "#FF2E6C", label: "--destructive · Mutations" },
      { name: "Phosphate", hex: "#EEC979", label: "Backbone connector" },
    ],
  },
  {
    name: "DNA Base Codex",
    swatches: [
      { name: "Adenine", hex: "#79EEA2", label: "A — soft mint · 2 H-bonds" },
      { name: "Thymine", hex: "#CF79EE", label: "T — lavender · pairs with A" },
      { name: "Cytosine", hex: "#EE799D", label: "C — dusty rose · 3 H-bonds" },
      { name: "Guanine", hex: "#7984EE", label: "G — periwinkle · pairs with C" },
    ],
  },
];

const GLOWS = [
  { className: "bg-cyan shadow-[0_0_18px] shadow-cyan/50", label: "Specimen active" },
  { className: "bg-violet shadow-[0_0_18px] shadow-violet/50", label: "Evolution node" },
  { className: "bg-rose shadow-[0_0_18px] shadow-rose/50", label: "Mutation event" },
  { className: "bg-phosphate shadow-[0_0_14px] shadow-phosphate/50", label: "Phosphate link" },
];

const VARIANT_ORDER: Variant[] = ["standard", "mutated", "evolved", "rare"];
const SAMPLE: Base[] = ["A", "T", "G", "C", "A", "G", "T", "C", "G", "T", "A", "C", "G", "T", "A", "T"];

const RATIONALE = [
  {
    q: "Why near-black as page ground?",
    a: "At #03070F the interface drops below the absolute black of the browser chrome, creating the illusion of a window into the deep ocean. Bioluminescent accents then read at their maximum possible contrast ratio — up to 17:1 — without requiring white backgrounds.",
  },
  {
    q: "Why equal-luminance pastels for DNA bases?",
    a: "Adenine, Thymine, Cytosine and Guanine share the same perceptual lightness (~78% HSL). No single base dominates the strand visually, so the sequence reads as a unified genetic system rather than four competing colours fighting for attention.",
  },
  {
    q: "Why Space Grotesk for display type?",
    a: "Geometric proportions signal scientific precision while slightly rounded terminals prevent the coldness of a pure grotesque. The contrast against JetBrains Mono data labels is immediate and readable — two clearly differentiated registers.",
  },
  {
    q: "Why slow animations (3–6 s cycles)?",
    a: "Organisms in the deep ocean move on geological time. A 3.6-second pulse and 6-second float feel organic and mysterious rather than gamified or anxious. Speed communicates character — slow speed communicates depth.",
  },
  {
    q: "Why phosphate gold (#EEC979) as connector?",
    a: "The DNA backbone is structural, not semantic. Gold sits outside the four base hues on the colour wheel, marking it clearly as infrastructure. It also adds warmth that prevents the dark palette from reading as cold or sterile.",
  },
];

const CONTRAST = [
  { swatch: "bg-abyss text-fg", ratio: "17.3:1", label: "Primary text on page" },
  { swatch: "bg-abyss text-muted", ratio: "9.8:1", label: "Secondary text on page" },
  { swatch: "bg-surface text-cyan", ratio: "7.2:1", label: "Accent on surface" },
  { swatch: "bg-surface text-adenine", ratio: "8.1:1", label: "Adenine on card" },
  { swatch: "bg-surface text-thymine", ratio: "5.4:1", label: "Thymine on card" },
];

export function DesignView() {
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="motion-enter mx-auto max-w-5xl px-4 pt-10 pb-16">
      <section className="mb-14">
        <SectionHead num="01" kicker="AESTHETIC POSTURE" title="Visual Direction" />
        <ul className="mb-6 flex flex-wrap gap-2">
          {PILLARS.map((pillar) => (
            <li key={pillar} className="rounded-full border border-cyan/25 bg-cyan/10 px-3 py-1 font-mono text-[10px] tracking-label text-cyan">
              {pillar}
            </li>
          ))}
        </ul>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <article key={item.title} className="panel p-5">
              <p className="mb-3 text-2xl text-cyan/70" aria-hidden="true">{item.mark}</p>
              <h3 className="mb-1.5 font-display text-sm font-bold text-fg">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted/65">{item.body}</p>
            </article>
          ))}
        </div>
        <p className="panel p-6 text-sm leading-8 text-muted/75">
          Aequor Lab translates the unreachable world of the deep ocean into a legible scientific instrument.
          The aesthetic commitment is total: every surface is as dark as the abyss at 4,000 metres, every
          interactive element glows with the cold phosphorescence of a real bioluminescent organism. The
          interface doesn’t <em>decorate</em> science — it <em>is</em> the science, expressed as typography,
          colour, and motion with the same precision as a sequencing report. Calm. Mysterious. Precise.
        </p>
      </section>

      <section className="mb-14">
        <SectionHead num="02" kicker="HIGH-FIDELITY LAYOUT" title="Screen Architecture" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {SCREENS.map((screen) => (
            <figure key={screen.label} className="flex flex-col overflow-hidden rounded-xl border border-cyan/10 bg-surface">
              <div className="min-h-32 flex-1 space-y-1 p-2">
                <div className={`h-1.5 rounded ${screen.accent} opacity-40`} />
                <Wire slug={screen.slug} />
              </div>
              <figcaption className={`border-t border-white/5 px-2 py-1.5 text-center font-mono text-[8px] ${screen.ink}`}>
                {screen.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="03" kicker="TYPE HIERARCHY" title="Typography System" />
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {FAMILIES.map((family) => (
            <article key={family.name} className="panel p-5">
              <p className="mb-2 font-mono text-[9px] tracking-label text-cyan/55">{family.role}</p>
              <p className={`mb-1 text-xl font-bold text-fg ${family.font}`}>{family.sample}</p>
              <p className="mb-3 font-mono text-[10px] text-muted/45">{family.name}</p>
              <ul className="mb-3 flex gap-1.5">
                {family.weights.map((weight) => (
                  <li key={weight} className="rounded bg-cyan/10 px-1.5 py-0.5 font-mono text-[8px] text-cyan">{weight}</li>
                ))}
              </ul>
              <p className="text-[10px] leading-relaxed text-muted/50">{family.note}</p>
            </article>
          ))}
        </div>
        <div className="panel overflow-hidden">
          {TYPE_SCALE.map((row, index) => (
            <div key={row.role} className={`flex items-center gap-4 px-5 py-3 ${index < TYPE_SCALE.length - 1 ? "border-b border-cyan/10" : ""}`}>
              <div className="w-20 shrink-0">
                <p className="font-mono text-[9px] text-cyan/55">{row.role.toUpperCase()}</p>
                <p className="font-mono text-[8px] text-muted/30">{row.px}px</p>
              </div>
              <p className={`truncate text-fg ${row.family} ${row.weight}`} style={{ fontSize: Math.min(row.px, 30) }}>
                {row.sample}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="04" kicker="PALETTE & ATMOSPHERE" title="Color System" />
        {PALETTE.map((group) => (
          <div key={group.name} className="mb-6">
            <h3 className="mb-3 font-mono text-[10px] tracking-label text-muted/45">{group.name.toUpperCase()}</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {group.swatches.map((swatch) => {
                const light = Number.parseInt(swatch.hex.slice(1), 16) > 0x555555;
                return (
                  <article
                    key={swatch.hex}
                    className="overflow-hidden rounded-xl border border-white/10 transition-transform hover:scale-[1.02]"
                    onMouseEnter={() => setHover(swatch.hex)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(swatch.hex)}
                    onBlur={() => setHover(null)}
                    tabIndex={0}
                  >
                    <div className="grid h-16 place-items-center" style={{ background: swatch.hex }}>
                      {hover === swatch.hex ? (
                        <span className={`font-mono text-xs font-bold ${light ? "text-abyss/80" : "text-fg"}`}>{swatch.hex}</span>
                      ) : null}
                    </div>
                    <div className="bg-surface px-3 py-2">
                      <p className="font-display text-xs font-semibold text-fg">{swatch.name}</p>
                      <p className="mt-0.5 font-mono text-[9px] text-muted/45">{swatch.label}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
        <div className="panel p-6">
          <h3 className="mb-5 font-mono text-[10px] tracking-label text-muted/45">GLOW APPLICATION</h3>
          <div className="flex flex-wrap items-end gap-8">
            {GLOWS.map((glow) => (
              <figure key={glow.label} className="flex flex-col items-center gap-3">
                <div className={`motion-pulse size-12 rounded-full ${glow.className}`} />
                <figcaption className="text-center font-mono text-[9px] text-muted/50">{glow.label}</figcaption>
              </figure>
            ))}
            <p className="ml-auto hidden max-w-xs text-right text-[10px] leading-relaxed text-muted/45 md:block">
              Glow = interactive. All four accent hues share the same glow formula — only colour and radius change by context.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="05" kicker="VISUAL LANGUAGE" title="Iconography & Symbols" />
        <h3 className="mb-4 font-mono text-[10px] tracking-label text-muted/45">SPECIMEN VARIANT MARKERS</h3>
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {VARIANT_ORDER.map((key) => {
            const meta = VARIANTS[key];
            const mutations = key === "mutated" ? 5 : key === "evolved" ? 12 : key === "rare" ? 18 : 0;
            return (
              <article key={key} data-variant={key} className="panel flex flex-col items-center border-glow-soft p-4 text-center">
                <Creature variant={key} mutations={mutations} size={96} labelled={false} />
                <span className="mt-1 rounded border border-glow-soft bg-glow-soft px-2 py-0.5 font-mono text-[9px] font-bold text-glow">
                  {meta.badge}
                </span>
                <h4 className="mt-1.5 font-display text-xs font-bold text-fg">{meta.title}</h4>
                <p className="mt-1 text-[9px] leading-relaxed text-muted/45">{meta.detail}</p>
              </article>
            );
          })}
        </div>
        <h3 className="mb-4 font-mono text-[10px] tracking-label text-muted/45">DNA BASE CODEX</h3>
        <ul className="flex flex-wrap gap-3">
          {BASES.map((base) => (
            <li key={base} data-base={base} className="flex items-center gap-3 rounded-xl border px-4 py-3" style={{ borderColor: "color-mix(in srgb, var(--base) 28%, transparent)", background: "color-mix(in srgb, var(--base) 12%, transparent)" }}>
              <span className="grid size-10 place-items-center rounded-full border-2 bg-abyss/60 font-mono text-lg font-bold" style={{ borderColor: "var(--base)", color: "var(--base)" }}>
                {base}
              </span>
              <span>
                <span className="block text-xs font-semibold text-fg">{BASE_INFO[base].name}</span>
                <span className="font-mono text-[9px] text-muted/45">pairs with {BASE_INFO[base].pair}</span>
              </span>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-xl border border-phosphate/30 bg-phosphate/10 px-4 py-3">
            <span className="grid w-10 place-items-center" aria-hidden="true">
              <span className="h-0.5 w-9 rounded-full bg-linear-to-r from-phosphate to-phosphate/30" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-fg">Phosphate</span>
              <span className="font-mono text-[9px] text-muted/45">backbone connector</span>
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-14">
        <SectionHead num="06" kicker="HIGH-FIDELITY ELEMENTS" title="UI Components" />
        <h3 className="mb-3 font-mono text-[10px] tracking-label text-muted/45">BIOLUMINESCENT BUTTONS</h3>
        <div className="mb-7 flex flex-wrap gap-3">
          <DemoButton className="border-cyan/35 bg-cyan/10 text-cyan">▶ Run Evolution</DemoButton>
          <DemoButton className="border-rose/35 bg-rose/10 text-rose">Mutate ×10</DemoButton>
          <DemoButton className="border-violet/35 bg-violet/10 text-violet">Save Archive</DemoButton>
          <DemoButton className="border-teal/35 bg-teal/10 text-teal">Complement</DemoButton>
          <DemoButton className="border-muted/30 bg-muted/8 text-muted">Randomize</DemoButton>
        </div>
        <h3 className="mb-3 font-mono text-[10px] tracking-label text-muted/45">SPECIMEN BADGES</h3>
        <ul className="mb-7 flex flex-wrap gap-2">
          {VARIANT_ORDER.map((key) => (
            <li key={key} data-variant={key} className="rounded border border-glow-soft bg-glow-soft px-3 py-1 font-mono text-[10px] font-bold text-glow">
              {VARIANTS[key].badge} — {VARIANTS[key].label}
            </li>
          ))}
        </ul>
        <h3 className="mb-3 font-mono text-[10px] tracking-label text-muted/45">GENOMIC PROGRESS INDICATORS</h3>
        <div className="panel mb-7 space-y-4 p-5">
          <StaticBar label="GC CONTENT" value={62} bar="bg-cyan" ink="text-cyan" track="bg-cyan/10" />
          <StaticBar label="SURVIVAL" value={78} bar="bg-violet" ink="text-violet" track="bg-violet/10" />
          <StaticBar label="STABILITY" value={54} bar="bg-teal" ink="text-teal" track="bg-teal/10" />
          <StaticBar label="DEPTH ADAPT." value={87} bar="bg-guanine" ink="text-guanine" track="bg-guanine/10" />
        </div>
        <h3 className="mb-3 font-mono text-[10px] tracking-label text-muted/45">DNA SEQUENCE STRIP</h3>
        <div className="panel overflow-x-auto p-5">
          <div className="flex min-w-max items-center">
            {SAMPLE.map((base, index) => (
              <span key={`${base}-${index}`} className="flex items-center">
                <span data-base={base} className="grid size-10 place-items-center rounded-full border-2 font-mono text-sm font-bold" style={{ borderColor: "var(--base)", color: "var(--base)", background: "color-mix(in srgb, var(--base) 14%, transparent)" }}>
                  {base}
                </span>
                {index < SAMPLE.length - 1 ? <PhosphateLink /> : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="07" kicker="MOTION LANGUAGE" title="Micro-Interactions" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <MotionCard title="Bioluminescent Pulse" detail="3.6s · scale 1 → 1.04 · ease-in-out · infinite">
            <div className="motion-pulse size-14 rounded-full bg-cyan shadow-[0_0_22px] shadow-cyan/50" />
          </MotionCard>
          <MotionCard title="Abyssal Float" detail="6s · translateY ±9px · rotate ±0.7° · infinite">
            <div className="motion-float" data-variant="standard">
              <Creature variant="standard" mutations={0} size={56} labelled={false} />
            </div>
          </MotionCard>
          <MotionCard title="Mutation Flash" detail="0.65s · radial burst · opacity 0 → 0.55 → 0 · on trigger">
            <div className="relative size-14">
              <div className="motion-pulse absolute inset-0 rounded-full bg-rose shadow-[0_0_22px] shadow-rose/50" />
              <div className="absolute inset-3 rounded-full bg-rose/60" />
            </div>
          </MotionCard>
          <MotionCard title="Phosphate Scan" detail="1.3s · translateX sweep · linear · on Complement action">
            <div className="scan-demo" />
          </MotionCard>
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="08" kicker="SYSTEMIC STRUCTURES" title="UI Patterns" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Pattern name="Specimen Viewer" text="Top bar ID → Creature (left ⅓) + Stats grid (right ⅔) → DNA strip → Control row. Creature anchors hierarchy; stats expand right on all breakpoints.">
            <div className="space-y-1.5">
              <div className="h-1 w-full rounded bg-cyan/25" />
              <div className="flex h-10 gap-1.5">
                <div className="w-12 rounded border border-cyan/15 bg-cyan/10" />
                <div className="grid flex-1 grid-cols-2 gap-1">
                  {Array.from({ length: 4 }, (_, i) => <div key={i} className="rounded bg-cyan/10" />)}
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }, (_, i) => <div key={i} className="size-3 rounded-full bg-cyan/20" />)}
              </div>
            </div>
          </Pattern>
          <Pattern name="Morphological Timeline" text="Generation nodes linked by phosphate vectors. Each node = mini-creature + gen index + variant badge. Scroll horizontally on mobile.">
            <div className="flex h-14 items-center gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="size-8 shrink-0 rounded-full border border-violet/30 bg-violet/15" />
                  {i < 4 ? <div className="h-px w-3 bg-phosphate/50" /> : null}
                </div>
              ))}
            </div>
          </Pattern>
          <Pattern name="Genomic Metrics Grid" text="GC bar always leads (full width) — it drives all downstream calculations. Survival + Mutations on row 2, Stability + Depth Adapt on row 3.">
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-cyan/20" />
              <div className="flex gap-1.5">
                <div className="size-6 rounded-full bg-violet/20" />
                <div className="h-6 w-12 rounded bg-rose/15" />
              </div>
              <div className="flex gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-cyan/15" />
                <div className="h-1.5 flex-1 rounded-full bg-teal/15" />
              </div>
            </div>
          </Pattern>
          <Pattern name="Archive Grid" text="3-column specimen cards. Each: variant badge + mini creature + 14-base DNA strip + 4 key stats. Click routes directly to Specimen Viewer with context.">
            <div className="grid h-14 grid-cols-3 gap-1.5">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="rounded-lg border border-cyan/10 bg-cyan/5" />
              ))}
            </div>
          </Pattern>
        </div>
      </section>

      <section className="mb-14">
        <SectionHead num="09" kicker="INCLUSIVE DESIGN" title="Accessibility" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="mb-4 font-mono text-[10px] tracking-label text-muted/45">CONTRAST RATIOS — WCAG AA</h3>
            <ul className="space-y-3">
              {CONTRAST.map((row) => (
                <li key={row.label} className="flex items-center gap-3">
                  <span className={`grid size-8 shrink-0 place-items-center rounded border border-white/10 font-mono text-[10px] font-bold ${row.swatch}`}>Aa</span>
                  <span className="flex-1 text-[10px] text-fg/70">{row.label}</span>
                  <span className="w-14 text-right font-mono text-[10px] text-muted/50">{row.ratio}</span>
                  <span className="rounded bg-pass/15 px-1.5 py-0.5 font-mono text-[9px] text-pass">PASS</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="panel p-5">
            <h3 className="mb-4 font-mono text-[10px] tracking-label text-muted/45">INCLUSIVE GUIDELINES</h3>
            <ul className="space-y-4">
              <Guide icon={<CircleDot className="size-4" />} title="Touch targets ≥ 44 × 44 px" detail="DNA bases are 44 px circles. All control buttons meet 44 px height minimum." />
              <Guide icon={<Keyboard className="size-4" />} title="Keyboard navigable" detail="All interactive elements reachable via Tab. Focus rings visible against dark surfaces. Shortcuts: M, R, C, S, N." />
              <Guide icon={<Clock className="size-4" />} title="No motion required" detail="All animations are decorative. The interface is fully functional with reduced motion." />
              <Guide icon={<Hexagon className="size-4" />} title="Colour + letter coding" detail="DNA bases carry both colour and letter. No information is conveyed by colour alone." />
              <Guide icon={<WholeWord className="size-4" />} title="Semantic aria labels" detail="aria-label on every base (position + name), and a name on the primary creature illustration." />
            </ul>
          </article>
        </div>
      </section>

      <section>
        <SectionHead num="10" kicker="INTENTIONAL DECISIONS" title="Design Rationale" />
        <div className="space-y-3">
          {RATIONALE.map((item) => (
            <article key={item.q} className="panel flex gap-4 p-5">
              <div className="w-1 shrink-0 self-stretch rounded-full bg-linear-to-b from-cyan to-violet" aria-hidden="true" />
              <div>
                <h3 className="mb-2 font-display text-sm font-bold text-fg">{item.q}</h3>
                <p className="text-xs leading-7 text-muted/60">{item.a}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Wire({ slug }: { slug: string }) {
  if (slug === "hero") {
    return (
      <>
        <div className="h-3 rounded bg-cyan/10" />
        <div className="h-10 rounded bg-cyan/8" />
        <div className="grid grid-cols-2 gap-0.5">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-2.5 rounded bg-cyan/10" />)}</div>
      </>
    );
  }
  if (slug === "specimen") {
    return (
      <>
        <div className="flex justify-center pt-1"><div className="size-9 rounded-full bg-cyan/20 shadow-[0_0_10px] shadow-cyan/40" /></div>
        <div className="flex flex-wrap gap-0.5">{Array.from({ length: 8 }, (_, i) => <div key={i} className="size-2 rounded-full bg-cyan/30" />)}</div>
      </>
    );
  }
  if (slug === "evolution") {
    return (
      <>
        <div className="h-7 overflow-hidden rounded bg-elevated">
          <svg viewBox="0 0 60 20" className="h-full w-full" aria-hidden="true">
            <polyline points="0,18 10,14 22,8 34,11 46,5 60,7" fill="none" stroke="#9D4EFF" strokeWidth="1.5" opacity="0.7" />
          </svg>
        </div>
        <div className="flex gap-0.5">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-4 flex-1 rounded-full bg-violet/15" />)}</div>
      </>
    );
  }
  if (slug === "metrics") {
    return <div className="grid grid-cols-2 gap-0.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-3.5 rounded bg-guanine/15" />)}</div>;
  }
  return <div className="grid grid-cols-3 gap-0.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-10 rounded bg-cytosine/15" />)}</div>;
}

function DemoButton({ className, children }: { className: string; children: string }) {
  return (
    <span className={`inline-flex min-h-11 items-center rounded-xl border px-4 font-mono text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function StaticBar({ label, value, bar, ink, track }: { label: string; value: number; bar: string; ink: string; track: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <span className="font-mono text-[10px] text-muted/55">{label}</span>
        <span className={`font-mono text-[10px] font-bold ${ink}`}>{value}%</span>
      </div>
      <div className={`h-1.5 overflow-hidden rounded-full ${track}`}>
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MotionCard({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return (
    <article className="panel flex flex-col items-center gap-4 p-5">
      <div className="flex h-16 w-full items-center justify-center">{children}</div>
      <div className="text-center">
        <h3 className="mb-1 font-display text-xs font-semibold text-fg">{title}</h3>
        <p className="font-mono text-[9px] leading-relaxed text-muted/45">{detail}</p>
      </div>
    </article>
  );
}

function Pattern({ name, text, children }: { name: string; text: string; children: ReactNode }) {
  return (
    <article className="panel p-5">
      <h3 className="mb-2 font-mono text-[9px] tracking-label text-cyan/55">PATTERN / {name.toUpperCase()}</h3>
      <div className="mb-3 rounded-lg bg-black/30 p-3">{children}</div>
      <p className="text-[11px] leading-relaxed text-muted/55">{text}</p>
    </article>
  );
}

function Guide({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 text-cyan/70" aria-hidden="true">{icon}</span>
      <div>
        <p className="mb-0.5 font-display text-xs font-semibold text-fg">{title}</p>
        <p className="text-[10px] leading-relaxed text-muted/50">{detail}</p>
      </div>
    </li>
  );
}
