/**
 * Genomics model — pure functions, no React.
 *
 * The interface only displays what these functions
 * return, so you can reason about (and later test) the science without
 * opening a component.
 *
 * Fictional but consistent rules:
 * - A strand is 22 bases: A, T, C, G.
 * - A pairs with T (2 hydrogen bonds). C pairs with G (3 bonds).
 * - GC% = (G + C) / length. More GC → more stable under pressure.
 * - Each mutation nudges survival and stability down.
 * - Variant bands: 0–2 Standard, 3–7 Mutated, 8–14 Evolved, 15+ Rare.
 */

export type Base = "A" | "T" | "C" | "G";
export type Variant = "standard" | "mutated" | "evolved" | "rare";

export interface Specimen {
  id: string;
  name: string;
  /** Collection depth in metres. */
  depth: number;
  dna: Base[];
  mutations: number;
  variant: Variant;
  savedAt?: number;
}

export interface GenomicStats {
  /** Guanine + cytosine percent. Drives the other three numbers. */
  gc: number;
  survival: number;
  stability: number;
  depthAdapt: number;
}

export interface GenerationPoint {
  gen: number;
  gc: number;
  survival: number;
  stability: number;
}

export const DNA_LENGTH = 22;
export const BASES: readonly Base[] = ["A", "T", "C", "G"];

export const BASE_INFO: Record<
  Base,
  { name: string; pair: Base; bonds: number; note: string }
> = {
  A: {
    name: "Adenine",
    pair: "T",
    bonds: 2,
    note: "Pairs via 2 H-bonds. Dominant in luciferase-encoding regions of bioluminescent organisms.",
  },
  T: {
    name: "Thymine",
    pair: "A",
    bonds: 2,
    note: "Found in depth-adaptation gene clusters of Pila aequor. Stabilises at high pressure.",
  },
  C: {
    name: "Cytosine",
    pair: "G",
    bonds: 3,
    note: "3 H-bond pairs. High GC ratio indicates thermostability under abyssal conditions.",
  },
  G: {
    name: "Guanine",
    pair: "C",
    bonds: 3,
    note: "Controls chromatophore activation and bioluminescent pulse timing in abyssal specimens.",
  },
};

export const VARIANTS: Record<
  Variant,
  { badge: string; label: string; title: string; detail: string }
> = {
  standard: {
    badge: "STD",
    label: "Standard",
    title: "Protoform",
    detail: "0–2 mutations · Teal glow · Base morphology",
  },
  mutated: {
    badge: "MUT",
    label: "Mutated",
    title: "Divergent",
    detail: "3–7 mutations · Neon rose · Spikes & chaos",
  },
  evolved: {
    badge: "EVO",
    label: "Evolved",
    title: "Apex",
    detail: "8–14 mutations · Violet · Crown appendages",
  },
  rare: {
    badge: "RARE",
    label: "Rare",
    title: "Crystal",
    detail: "15+ mutations · Ice cyan · Geometric lattice",
  },
};

export const SPECIES = [
  "Pila aequor var. abyssus",
  "Pila aequor var. luminosa",
  "Pila aequor var. profunda",
  "Pila aequor var. crystallis",
  "Pila aequor var. umbra",
  "Pila aequor var. velox",
] as const;

/** Chart strokes. Kept here so Recharts (which needs a colour string) stays in sync with the CSS tokens. */
export const INK = {
  cyan: "#00F5D4",
  violet: "#9D4EFF",
  teal: "#4ECDC4",
  rose: "#FF2E6C",
  muted: "#A0D8E8",
  fg: "#E0F8FF",
  surface: "#0A1321",
} as const;

function roll(max: number): number {
  return Math.floor(Math.random() * max);
}

function clampStat(value: number): number {
  return Math.min(99, Math.max(5, Math.round(value)));
}

export function randomBase(): Base {
  return BASES[roll(BASES.length)];
}

export function randomSequence(length = DNA_LENGTH): Base[] {
  return Array.from({ length }, randomBase);
}

export function complementOf(base: Base): Base {
  return BASE_INFO[base].pair;
}

export function variantFor(mutations: number): Variant {
  if (mutations >= 15) return "rare";
  if (mutations >= 8) return "evolved";
  if (mutations >= 3) return "mutated";
  return "standard";
}

export function statsFor(dna: Base[], mutations: number): GenomicStats {
  const gcCount = dna.filter((base) => base === "G" || base === "C").length;
  const gc = Math.round((gcCount / dna.length) * 100);
  return {
    gc,
    survival: clampStat(40 + gc * 0.4 - mutations * 2),
    stability: clampStat(50 + gc * 0.3 - mutations * 1.5),
    depthAdapt: clampStat(35 + gc * 0.45 - mutations * 0.8),
  };
}

export function createSpecimen(): Specimen {
  return {
    id: `#${String(roll(999) + 1).padStart(3, "0")}`,
    name: SPECIES[roll(SPECIES.length)],
    depth: roll(8000) + 500,
    dna: randomSequence(),
    mutations: 0,
    variant: "standard",
  };
}

/** Substitute `count` random positions. A base can be "mutated" into itself — biology is noisy. */
export function withMutations(specimen: Specimen, count: number): Specimen {
  const dna = specimen.dna.slice();
  for (let i = 0; i < count; i += 1) {
    dna[roll(dna.length)] = randomBase();
  }
  const mutations = specimen.mutations + count;
  return { ...specimen, dna, mutations, variant: variantFor(mutations) };
}

export function withRandomSequence(specimen: Specimen): Specimen {
  return {
    ...specimen,
    dna: randomSequence(specimen.dna.length),
    mutations: 0,
    variant: "standard",
  };
}

/** Watson–Crick complement. Does not count as a mutation — the backbone is rewritten, not damaged. */
export function withComplement(specimen: Specimen): Specimen {
  return { ...specimen, dna: specimen.dna.map(complementOf) };
}

/**
 * Twenty generations beyond the current specimen.
 * Each step applies 1–3 substitutions, then records GC, survival and stability.
 */
export function simulateEvolution(specimen: Specimen, generations = 20): GenerationPoint[] {
  const points: GenerationPoint[] = [];
  let current = specimen;
  for (let gen = 0; gen <= generations; gen += 1) {
    const stats = statsFor(current.dna, current.mutations);
    points.push({
      gen,
      gc: stats.gc,
      survival: stats.survival,
      stability: stats.stability,
    });
    if (gen < generations) {
      current = withMutations(current, roll(3) + 1);
    }
  }
  return points;
}

export function isBase(value: unknown): value is Base {
  return value === "A" || value === "T" || value === "C" || value === "G";
}

export function isVariant(value: unknown): value is Variant {
  return value === "standard" || value === "mutated" || value === "evolved" || value === "rare";
}

export function isSpecimen(value: unknown): value is Specimen {
  if (!value || typeof value !== "object") return false;
  const specimen = value as Specimen;
  return (
    typeof specimen.id === "string" &&
    typeof specimen.name === "string" &&
    typeof specimen.depth === "number" &&
    typeof specimen.mutations === "number" &&
    isVariant(specimen.variant) &&
    Array.isArray(specimen.dna) &&
    specimen.dna.length > 0 &&
    specimen.dna.every(isBase)
  );
}
