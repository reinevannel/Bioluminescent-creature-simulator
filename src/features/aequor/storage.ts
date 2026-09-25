/**
 * Archive persistence.
 *
 * localStorage is enough here: one visitor, one browser, no account.
 * The shape is validated before it is trusted — stored JSON can be old or edited.
 */

import { isSpecimen, type Specimen } from "./model";

const KEY = "aequor-lab-v1";

export interface SavedLab {
  spec: Specimen;
  archive: Specimen[];
}

export function loadLab(): SavedLab | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as { spec?: unknown; archive?: unknown };
    if (!isSpecimen(record.spec)) return null;
    const archive = Array.isArray(record.archive) ? record.archive.filter(isSpecimen) : [];
    return { spec: record.spec, archive };
  } catch {
    return null;
  }
}

export function saveLab(lab: SavedLab): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lab));
  } catch {
    /* Private mode or a full disk should not crash the lab. */
  }
}
