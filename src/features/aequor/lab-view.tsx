import { RefreshCw, Save, Shuffle, X, Zap } from "lucide-react";
import { BASE_INFO, statsFor, VARIANTS } from "./model";
import { useLab } from "./lab-context";
import { Creature } from "./creature";
import { DnaBaseButton, MetricBar, PhosphateLink, SurvivalRing } from "./primitives";

export function LabView() {
  const lab = useLab();
  const stats = statsFor(lab.spec.dna, lab.spec.mutations);
  const variant = VARIANTS[lab.spec.variant];
  const selected = lab.selectedBase === null ? null : lab.spec.dna[lab.selectedBase];
  const selectedInfo = selected ? BASE_INFO[selected] : null;

  const controls = [
    { label: "Mutate", hint: "M", icon: Zap, run: () => lab.mutate(1), tone: "glow" as const },
    { label: "Mutate ×5", hint: "", icon: Zap, run: () => lab.mutate(5), tone: "glow" as const },
    { label: "Mutate ×10", hint: "", icon: Zap, run: () => lab.mutate(10), tone: "rose" as const },
    { label: "Randomize", hint: "R", icon: Shuffle, run: lab.randomize, tone: "muted" as const },
    { label: "Complement", hint: "C", icon: RefreshCw, run: lab.complement, tone: "teal" as const },
    {
      label: lab.justSaved ? "Saved" : "Save to Archive",
      hint: "S",
      icon: Save,
      run: lab.save,
      tone: "violet" as const,
    },
  ];

  return (
    <div data-variant={lab.spec.variant} className="motion-enter">
      <Hero />

      <section className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:pb-12" aria-labelledby="specimen-heading">
        <h2 id="specimen-heading" className="sr-only">
          Specimen viewer
        </h2>
        <div className="overflow-hidden rounded-2xl border border-glow-soft bg-linear-to-br from-surface to-elevated shadow-[0_4px_40px_rgba(0,0,0,0.45)]">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-glow-soft bg-black/20 px-5 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] tracking-label text-glow/70">SPECIMEN</span>
              <span className="font-mono text-sm font-bold text-fg">{lab.spec.id}</span>
              <span className="hidden text-muted/40 sm:inline" aria-hidden="true">•</span>
              <span className="hidden text-xs text-muted/60 italic sm:inline">{lab.spec.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted/55">↓ {lab.spec.depth.toLocaleString("en-US")}m</span>
              <span className="rounded border border-glow-soft bg-glow-soft px-2 py-0.5 font-mono text-[10px] font-bold text-glow">
                {variant.badge}
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
            <div className="relative flex min-h-72 items-center justify-center border-b border-glow-soft p-6 md:border-r md:border-b-0">
              <div className="motion-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--glow)_10%,transparent),transparent_65%)]" />
              <div className={`motion-float relative ${lab.phase === "mutating" ? "opacity-50" : "opacity-100"}`}>
                <Creature
                  variant={lab.spec.variant}
                  mutations={lab.spec.mutations}
                  size={250}
                  label={`${variant.label} ${lab.spec.name}, ${lab.spec.mutations} mutations`}
                />
                {lab.phase === "mutating" ? (
                  <div className="motion-flash pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--glow)_40%,transparent),transparent_70%)]" />
                ) : null}
              </div>
              <p className="absolute inset-x-0 bottom-3 text-center font-mono text-[9px] text-muted/40 italic">
                {lab.spec.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 md:p-5">
              <div className="col-span-2 rounded-xl border border-cyan/15 bg-cyan/5 p-4">
                <MetricBar
                  label="GC CONTENT"
                  value={stats.gc}
                  tone="cyan"
                  hint="G+C base pair ratio — thermostability indicator"
                />
              </div>

              <article className="rounded-xl border border-violet/20 bg-violet/5 p-4">
                <h3 className="mb-2 font-mono text-[10px] tracking-label text-muted/60">SURVIVAL</h3>
                <div className="flex items-center gap-3">
                  <SurvivalRing value={stats.survival} />
                  <div>
                    <p className="font-mono text-xl font-bold text-violet">{stats.survival}%</p>
                    <p className="font-mono text-[9px] text-muted/40">prob.</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-rose/15 bg-rose/5 p-4">
                <h3 className="mb-2 font-mono text-[10px] tracking-label text-muted/60">MUTATIONS</h3>
                <p className="flex items-end gap-1">
                  <span className={`font-mono text-3xl font-bold ${lab.spec.mutations > 0 ? "text-rose" : "text-muted"}`}>
                    {lab.spec.mutations}
                  </span>
                  <span className="mb-1.5 font-mono text-[10px] text-muted/45">events</span>
                </p>
                <p className="mt-1 font-mono text-[9px] text-muted/35">Cumulative base substitutions</p>
              </article>

              <article className="rounded-xl border border-cyan/15 bg-cyan/5 p-4">
                <MetricBar label="STABILITY" value={stats.stability} tone="cyan" />
              </article>
              <article className="rounded-xl border border-teal/15 bg-teal/5 p-4">
                <MetricBar label="DEPTH ADAPT." value={stats.depthAdapt} tone="teal" />
              </article>
            </div>
          </div>

          <div className="border-t border-glow-soft px-4 py-4 md:px-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-mono text-[10px] tracking-label text-muted/50">
                DNA SEQUENCE — {lab.spec.dna.length} BASES
              </h3>
              {lab.selectedBase !== null ? (
                <button
                  type="button"
                  onClick={() => lab.selectBase(null)}
                  className="inline-flex min-h-11 items-center gap-1 font-mono text-[10px] text-muted/50 hover:text-muted"
                >
                  <X className="size-3" aria-hidden="true" /> Clear
                </button>
              ) : null}
            </div>

            <div className={lab.phase === "scanning" ? "scan-active" : undefined}>
              <div className="flex flex-wrap items-center" role="list" aria-label="DNA sequence">
                {lab.spec.dna.map((base, index) => (
                  <div key={`${lab.spec.id}-${index}`} className="flex items-center" role="listitem">
                    <DnaBaseButton
                      base={base}
                      index={index}
                      selected={lab.selectedBase === index}
                      mutating={lab.phase === "mutating"}
                      onSelect={() => lab.selectBase(lab.selectedBase === index ? null : index)}
                    />
                    {index < lab.spec.dna.length - 1 ? <PhosphateLink /> : null}
                  </div>
                ))}
              </div>
            </div>

            {selected && selectedInfo && lab.selectedBase !== null ? (
              <div data-base={selected} className="motion-enter mt-3 rounded-xl border border-current/25 bg-current/10 p-3 text-fg">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-sm font-bold" style={{ color: "var(--base)" }}>
                    {selected}
                  </span>
                  <span className="text-xs font-semibold">{selectedInfo.name}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted/50">pos. {lab.selectedBase + 1}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted/75">{selectedInfo.note}</p>
                <p className="mt-1 font-mono text-[10px] text-muted/45">
                  Pairs with {selectedInfo.pair} · {selectedInfo.bonds} H-bonds
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-glow-soft px-4 py-4 md:flex md:flex-wrap md:px-5">
            {controls.map((control) => (
              <ControlButton key={control.label} {...control} />
            ))}
          </div>
        </div>
        <p className="sr-only">
          Keyboard shortcuts: M mutate, R randomise, C complement, S save, N new specimen.
        </p>
      </section>
    </div>
  );
}

function Hero() {
  const specks = Array.from({ length: 14 }, (_, index) => ({
    id: index,
    left: `${(index * 19 + 7) % 97}%`,
    top: `${(index * 23 + 11) % 88}%`,
    size: 2 + (index % 3),
    tone: index % 3 === 0 ? "bg-cyan" : index % 3 === 1 ? "bg-violet" : "bg-pink",
    delay: `${(index * 0.35) % 3}s`,
    duration: `${3 + (index % 3)}s`,
  }));

  return (
    <div className="relative overflow-hidden border-b border-cyan/10 bg-linear-to-b from-cyan/5 to-transparent px-6 py-10 text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {specks.map((speck) => (
          <span
            key={speck.id}
            className={`motion-pulse absolute rounded-full opacity-40 ${speck.tone}`}
            style={{
              left: speck.left,
              top: speck.top,
              width: speck.size,
              height: speck.size,
              animationDelay: speck.delay,
              animationDuration: speck.duration,
            }}
          />
        ))}
      </div>
      <p className="relative font-mono text-[10px] tracking-hero text-cyan/75">DEEP SEA RESEARCH LABORATORY</p>
      <h1 className="relative mt-3 font-display text-4xl font-bold tracking-tight text-fg md:text-5xl">
        Decode the Abyss
      </h1>
      <p className="relative mt-3 text-sm tracking-[0.22em] text-muted/75 md:text-base">
        Simulate <span className="text-cyan">•</span> Mutate <span className="text-violet">•</span> Evolve
      </p>
    </div>
  );
}

const TONE: Record<string, string> = {
  glow: "border-glow-soft bg-glow-soft text-glow shadow-glow",
  rose: "border-rose/30 bg-rose/10 text-rose shadow-[0_0_12px] shadow-rose/20",
  muted: "border-muted/25 bg-muted/8 text-muted",
  teal: "border-teal/30 bg-teal/10 text-teal",
  violet: "border-violet/30 bg-violet/10 text-violet",
};

function ControlButton({
  label,
  hint,
  icon: Icon,
  run,
  tone,
}: {
  label: string;
  hint: string;
  icon: typeof Zap;
  run: () => void;
  tone: keyof typeof TONE;
}) {
  return (
    <button
      type="button"
      onClick={run}
      aria-keyshortcuts={hint || undefined}
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 font-mono text-xs font-semibold tracking-wide transition-transform hover:scale-[1.03] active:scale-95 md:w-auto ${TONE[tone]}`}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}