import { useNavigate } from "../../lib/nav";
import { Archive, X } from "lucide-react";
import { useState } from "react";
import { useLab } from "./lab-context";
import { Creature } from "./creature";
import { EmptyState } from "./primitives";
import { statsFor, VARIANTS, type Specimen } from "./model";

export function ArchiveView() {
  const lab = useLab();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  function open(specimen: Specimen) {
    lab.openSpecimen(specimen);
    navigate("/");
  }

  function clear() {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 2800);
      return;
    }
    lab.clearArchive();
    setConfirming(false);
  }

  return (
    <div className="motion-enter mx-auto max-w-6xl px-4 pt-8 pb-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-fg">Specimen Archive</h1>
          <p className="mt-1 font-mono text-xs text-muted/50">
            {lab.archive.length} specimen{lab.archive.length === 1 ? "" : "s"} preserved
          </p>
        </div>
        {lab.archive.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 items-center gap-1 font-mono text-xs text-rose/80 hover:text-rose"
          >
            <X className="size-3" aria-hidden="true" />
            {confirming ? "Confirm clear" : "Clear all"}
          </button>
        ) : null}
      </div>

      {lab.archive.length === 0 ? (
        <EmptyState
          icon={<Archive className="size-8" aria-hidden="true" />}
          title="No specimens archived yet."
          detail='Use “Save to Archive” in the Lab.'
        />
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lab.archive.map((specimen) => (
            <li key={`${specimen.id}-${specimen.savedAt ?? 0}`}>
              <ArchiveCard specimen={specimen} onOpen={() => open(specimen)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ArchiveCard({ specimen, onOpen }: { specimen: Specimen; onOpen: () => void }) {
  const variant = VARIANTS[specimen.variant];
  const stats = statsFor(specimen.dna, specimen.mutations);
  const preview = specimen.dna.slice(0, 14);

  return (
    <button
      type="button"
      onClick={onOpen}
      data-variant={specimen.variant}
      className="w-full rounded-2xl border border-glow-soft bg-linear-to-br from-surface to-elevated p-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      aria-label={`Open ${specimen.id}, ${specimen.name}, ${variant.label}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-bold text-fg">{specimen.id}</p>
          <p className="mt-0.5 text-[10px] text-muted/50 italic">{specimen.name}</p>
        </div>
        <span className="rounded border border-glow-soft bg-glow-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-glow">
          {variant.badge}
        </span>
      </div>

      <div className="flex justify-center">
        <Creature variant={specimen.variant} mutations={specimen.mutations} size={110} labelled={false} />
      </div>

      <div className="mt-1 mb-3 flex flex-wrap items-center" aria-hidden="true">
        {preview.map((base, index) => (
          <span key={index} className="flex items-center">
            <span
              data-base={base}
              className="grid size-4 place-items-center rounded-full border font-mono text-[7px] font-bold"
              style={{ borderColor: "var(--base)", color: "var(--base)", background: "color-mix(in srgb, var(--base) 16%, transparent)" }}
            >
              {base}
            </span>
            {index < preview.length - 1 ? <span className="h-px w-1 bg-phosphate/40" /> : null}
          </span>
        ))}
        {specimen.dna.length > preview.length ? (
          <span className="grid size-4 place-items-center rounded-full border border-muted/15 font-mono text-[7px] text-muted/60">
            +{specimen.dna.length - preview.length}
          </span>
        ) : null}
      </div>

      <dl className="grid grid-cols-2 gap-2 border-t border-cyan/10 pt-3 font-mono">
        <Stat term="GC" value={`${stats.gc}%`} className="text-cyan" />
        <Stat term="SURV" value={`${stats.survival}%`} className="text-violet" />
        <Stat term="MUTS" value={`×${specimen.mutations}`} className={specimen.mutations > 0 ? "text-rose" : "text-muted"} />
        <Stat term="DEPTH" value={`${(specimen.depth / 1000).toFixed(1)}km`} className="text-teal" />
      </dl>
    </button>
  );
}

function Stat({ term, value, className }: { term: string; value: string; className: string }) {
  return (
    <div>
      <dt className="text-[9px] text-muted/40">{term}</dt>
      <dd className={`text-xs font-bold ${className}`}>{value}</dd>
    </div>
  );
}
