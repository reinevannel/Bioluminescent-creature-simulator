import { ChevronRight, Play, RefreshCw, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLab } from "./lab-context";
import { Creature } from "./creature";
import { EmptyState } from "./primitives";
import { INK, variantFor, VARIANTS, type GenerationPoint } from "./model";

const KEY_GENERATIONS = [0, 4, 9, 14, 19];

export function EvolutionView() {
  const lab = useLab();
  const visible = lab.evolution.slice(0, lab.evolutionGen + 1);
  const shown = KEY_GENERATIONS.filter((generation) => generation <= lab.evolutionGen);

  return (
    <div className="motion-enter mx-auto max-w-6xl px-4 pt-8 pb-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fg">Evolution Simulator</h1>
          <p className="mt-1 font-mono text-[10px] text-muted/50 italic">{lab.spec.name}</p>
        </div>
        <button
          type="button"
          onClick={lab.runEvolution}
          disabled={lab.evolutionRunning}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan/35 bg-cyan/10 px-5 font-mono text-sm font-semibold text-cyan shadow-[0_0_16px] shadow-cyan/15 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {lab.evolutionRunning ? (
            <>
              <RefreshCw className="size-4 animate-spin" aria-hidden="true" /> Simulating…
            </>
          ) : (
            <>
              <Play className="size-4" aria-hidden="true" /> Run Evolution
            </>
          )}
        </button>
      </div>

      {lab.evolution.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="size-8" aria-hidden="true" />}
          title="No simulation data."
          detail="Press “Run Evolution” to simulate 20 generations."
        />
      ) : (
        <div className="space-y-6">
          <section className="panel p-5" aria-labelledby="stability-chart">
            <h2 id="stability-chart" className="mb-4 font-mono text-[10px] tracking-label text-muted/50">
              GENOMIC STABILITY ACROSS GENERATIONS
            </h2>
            <div className="h-52 w-full md:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visible} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,245,212,0.06)" />
                  <XAxis dataKey="gen" tick={{ fontSize: 10, fill: INK.muted, fontFamily: "JetBrains Mono, monospace" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: INK.muted, fontFamily: "JetBrains Mono, monospace" }} />
                  <Tooltip content={<EvolutionTooltip />} cursor={{ stroke: INK.cyan, strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="gc" name="GC Content" stroke={INK.cyan} fill="rgba(0,245,212,0.08)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="survival" name="Survival" stroke={INK.violet} fill="rgba(157,78,255,0.06)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="stability" name="Stability" stroke={INK.teal} fill="rgba(78,205,196,0.05)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 flex flex-wrap gap-5">
              <Legend color="bg-cyan" label="GC Content" />
              <Legend color="bg-violet" label="Survival" />
              <Legend color="bg-teal" label="Stability" />
            </ul>
          </section>

          <section className="panel p-5" aria-labelledby="morphology">
            <h2 id="morphology" className="mb-4 font-mono text-[10px] tracking-label text-muted/50">
              MORPHOLOGICAL PROGRESSION — GEN {lab.evolutionGen} / 20
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {shown.map((generation, index) => {
                const mutations = lab.spec.mutations + generation * 2;
                const variant = variantFor(mutations);
                const meta = VARIANTS[variant];
                return (
                  <div key={generation} className="flex items-center gap-2">
                    <figure data-variant={variant} className="flex w-24 shrink-0 flex-col items-center gap-1">
                      <Creature
                        variant={variant}
                        mutations={mutations}
                        size={88}
                        labelled={false}
                      />
                      <figcaption className="text-center">
                        <span className="block font-mono text-[9px] text-muted/45">Gen {generation}</span>
                        <span className="font-mono text-[10px] font-bold text-glow">{meta.label}</span>
                      </figcaption>
                    </figure>
                    {index < shown.length - 1 ? (
                      <ChevronRight className="size-4 shrink-0 text-muted/25" aria-hidden="true" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`h-px w-4 ${color}`} aria-hidden="true" />
      <span className="font-mono text-[9px] text-muted/50">{label}</span>
    </li>
  );
}

function EvolutionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: GenerationPoint }>;
  label?: number | string;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="rounded-xl border border-cyan/25 bg-surface px-3 py-2 font-mono text-[11px] shadow-lg">
      <p className="mb-1 text-fg">Gen {label}</p>
      <p className="text-cyan">GC CONTENT : {point.gc}%</p>
      <p className="text-violet">SURVIVAL : {point.survival}%</p>
      <p className="text-teal">STABILITY : {point.stability}%</p>
    </div>
  );
}
