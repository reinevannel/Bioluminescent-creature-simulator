/**
 * Lab state.
 *
 * Pattern to study:
 * 1. `model.ts` computes the next specimen (pure).
 * 2. This reducer stores that result. It does not call Math.random.
 * 3. Timers and localStorage live in the provider, beside the reducer —
 *    side effects do not belong inside a reducer.
 * 4. Screens call `useLab()`. They never reach into DNA arrays themselves.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  createSpecimen,
  simulateEvolution,
  statsFor,
  VARIANTS,
  withComplement,
  withMutations,
  withRandomSequence,
  type GenerationPoint,
  type Specimen,
} from "./model";
import { loadLab, saveLab } from "./storage";

const ARCHIVE_LIMIT = 24;

export type Phase = "idle" | "mutating" | "scanning";

interface LabState {
  ready: boolean;
  spec: Specimen;
  archive: Specimen[];
  selectedBase: number | null;
  phase: Phase;
  justSaved: boolean;
  evolution: GenerationPoint[];
  evolutionGen: number;
  evolutionRunning: boolean;
  announcement: string;
}

type Action =
  | { type: "hydrate"; spec: Specimen; archive: Specimen[] }
  | { type: "select-base"; index: number | null }
  | { type: "phase"; phase: Phase }
  | { type: "patch"; spec: Specimen; announcement: string }
  | { type: "swap"; spec: Specimen; announcement: string }
  | { type: "saved"; archive: Specimen[] }
  | { type: "saved-clear" }
  | { type: "clear-archive" }
  | { type: "evolution-start"; points: GenerationPoint[] }
  | { type: "evolution-tick" }
  | { type: "evolution-finish" };

const EMPTY: Specimen = {
  id: "#000",
  name: "Pila aequor",
  depth: 4000,
  dna: Array.from({ length: 22 }, () => "A"),
  mutations: 0,
  variant: "standard",
};

const initialState: LabState = {
  ready: false,
  spec: EMPTY,
  archive: [],
  selectedBase: null,
  phase: "idle",
  justSaved: false,
  evolution: [],
  evolutionGen: 0,
  evolutionRunning: false,
  announcement: "",
};

function reducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ready: true, spec: action.spec, archive: action.archive };
    case "select-base":
      return { ...state, selectedBase: action.index };
    case "phase":
      return { ...state, phase: action.phase, selectedBase: action.phase === "idle" ? state.selectedBase : null };
    case "patch":
      return { ...state, spec: action.spec, phase: "idle", announcement: action.announcement, justSaved: false };
    case "swap":
      return {
        ...state,
        spec: action.spec,
        phase: "idle",
        selectedBase: null,
        justSaved: false,
        evolution: [],
        evolutionGen: 0,
        evolutionRunning: false,
        announcement: action.announcement,
      };
    case "saved":
      return { ...state, archive: action.archive, justSaved: true, announcement: `${state.spec.id} preserved in the archive.` };
    case "saved-clear":
      return { ...state, justSaved: false };
    case "clear-archive":
      return { ...state, archive: [], announcement: "Archive cleared." };
    case "evolution-start":
      return { ...state, evolution: action.points, evolutionGen: 0, evolutionRunning: true, announcement: "Evolution running. Twenty generations." };
    case "evolution-tick":
      return { ...state, evolutionGen: Math.min(state.evolutionGen + 1, state.evolution.length - 1) };
    case "evolution-finish":
      return { ...state, evolutionRunning: false, evolutionGen: Math.max(0, state.evolution.length - 1), announcement: "Evolution complete." };
    default:
      return state;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface LabApi extends LabState {
  selectBase: (index: number | null) => void;
  mutate: (count: number) => void;
  randomize: () => void;
  complement: () => void;
  newSpecimen: () => void;
  save: () => void;
  clearArchive: () => void;
  openSpecimen: (specimen: Specimen) => void;
  runEvolution: () => void;
}

const LabContext = createContext<LabApi | null>(null);

export function LabProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const busy = useRef(false);
  const evolutionTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = loadLab();
    dispatch({
      type: "hydrate",
      spec: saved?.spec ?? createSpecimen(),
      archive: saved?.archive ?? [],
    });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    saveLab({ spec: state.spec, archive: state.archive });
  }, [state.ready, state.spec, state.archive]);

  useEffect(() => {
    return () => {
      if (evolutionTimer.current !== null) window.clearInterval(evolutionTimer.current);
    };
  }, []);

  const after = useCallback((ms: number, run: () => void) => {
    const delay = prefersReducedMotion() ? 0 : ms;
    window.setTimeout(() => {
      busy.current = false;
      run();
    }, delay);
  }, []);

  const mutate = useCallback((count: number) => {
    if (busy.current || stateRef.current.phase !== "idle") return;
    busy.current = true;
    dispatch({ type: "phase", phase: "mutating" });
    after(650, () => {
      const next = withMutations(stateRef.current.spec, count);
      const stats = statsFor(next.dna, next.mutations);
      dispatch({
        type: "patch",
        spec: next,
        announcement: `${count} substitution${count === 1 ? "" : "s"}. ${VARIANTS[next.variant].label}. Survival ${stats.survival} percent.`,
      });
    });
  }, [after]);

  const randomize = useCallback(() => {
    if (busy.current || stateRef.current.phase !== "idle") return;
    busy.current = true;
    dispatch({ type: "phase", phase: "mutating" });
    after(650, () => {
      const next = withRandomSequence(stateRef.current.spec);
      dispatch({ type: "patch", spec: next, announcement: "Sequence randomised. Mutation count reset." });
    });
  }, [after]);

  const complement = useCallback(() => {
    if (busy.current || stateRef.current.phase !== "idle") return;
    busy.current = true;
    dispatch({ type: "phase", phase: "scanning" });
    after(1300, () => {
      const next = withComplement(stateRef.current.spec);
      dispatch({ type: "patch", spec: next, announcement: "Complement strand written. Pairing rules A-T and C-G." });
    });
  }, [after]);

  const newSpecimen = useCallback(() => {
    if (busy.current) return;
    const next = createSpecimen();
    dispatch({ type: "swap", spec: next, announcement: `New specimen ${next.id}, ${next.name}.` });
  }, []);

  const save = useCallback(() => {
    const current = stateRef.current;
    const stamped: Specimen = { ...current.spec, savedAt: Date.now() };
    const index = current.archive.findIndex((item) => item.id === stamped.id);
    const next = index === -1
      ? [stamped, ...current.archive]
      : current.archive.map((item, i) => (i === index ? stamped : item));
    dispatch({ type: "saved", archive: next.slice(0, ARCHIVE_LIMIT) });
    window.setTimeout(() => dispatch({ type: "saved-clear" }), 2200);
  }, []);

  const clearArchive = useCallback(() => dispatch({ type: "clear-archive" }), []);

  const openSpecimen = useCallback((specimen: Specimen) => {
    dispatch({ type: "swap", spec: specimen, announcement: `Loaded ${specimen.id} from the archive.` });
  }, []);

  const selectBase = useCallback((index: number | null) => {
    dispatch({ type: "select-base", index });
  }, []);

  const runEvolution = useCallback(() => {
    const current = stateRef.current;
    if (current.evolutionRunning || busy.current) return;
    const points = simulateEvolution(current.spec, 20);
    dispatch({ type: "evolution-start", points });
    if (prefersReducedMotion()) {
      dispatch({ type: "evolution-finish" });
      return;
    }
    if (evolutionTimer.current !== null) window.clearInterval(evolutionTimer.current);
    evolutionTimer.current = window.setInterval(() => {
      const latest = stateRef.current;
      if (latest.evolutionGen >= points.length - 1) {
        if (evolutionTimer.current !== null) window.clearInterval(evolutionTimer.current);
        evolutionTimer.current = null;
        dispatch({ type: "evolution-finish" });
        return;
      }
      dispatch({ type: "evolution-tick" });
    }, 180);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;
      const key = event.key.toLowerCase();
      if (key === "m") mutate(1);
      else if (key === "r") randomize();
      else if (key === "c") complement();
      else if (key === "s") save();
      else if (key === "n") newSpecimen();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [complement, mutate, newSpecimen, randomize, save]);

  const api = useMemo<LabApi>(() => ({
    ...state,
    selectBase,
    mutate,
    randomize,
    complement,
    newSpecimen,
    save,
    clearArchive,
    openSpecimen,
    runEvolution,
  }), [
    state,
    selectBase,
    mutate,
    randomize,
    complement,
    newSpecimen,
    save,
    clearArchive,
    openSpecimen,
    runEvolution,
  ]);

  return <LabContext.Provider value={api}>{children}</LabContext.Provider>;
}

export function useLab(): LabApi {
  const value = useContext(LabContext);
  if (!value) throw new Error("useLab must be used inside LabProvider");
  return value;
}
