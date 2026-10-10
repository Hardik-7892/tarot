/**
 * M2: Local-only reading journal. No backend, no cookies.
 * Stored newest-first under `tarot.journal.v1` in localStorage.
 * Entry: { id, at, spreadId, name, question, note, picks:[{cardId, orientation}] }
 */
import { byId } from "./cards";
import { loadSettings } from "./settings";

export const JOURNAL_KEY = "tarot.journal.v1";

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random.toString(36).slice(2, 10)}`;
}

export function loadJournal() {
  if (!canStore()) return [];
  try {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(entries) {
  if (!canStore()) return;
  try {
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked: keep in-memory only, never throw into UI.
  }
}

/**
 * Save one reading. Enforces cap (drops oldest). Idempotent per id.
 * Returns { entry, dropped, already }.
 */
export function saveEntry({ spreadId = "custom", name = "", question = "", note = "", picks = [] }) {
  const entries = loadJournal();
  const { cap } = loadSettings();
  const cleanPicks = picks.map((p) => ({
    cardId: p.cardId,
    orientation: p.orientation === "reversed" ? "reversed" : "upright",
  }));
  const entry = {
    id: uid(),
    at: new Date().toISOString(),
    spreadId,
    name: String(name ?? "").slice(0, 60),
    question: String(question ?? "").slice(0, 500),
    note: String(note ?? "").slice(0, 2000),
    picks: cleanPicks,
  };
  const next = [entry, ...entries];
  let dropped = 0;
  while (next.length > cap) {
    next.pop();
    dropped += 1;
  }
  persist(next);
  return { entry, dropped };
}

export function updateNote(id, note) {
  const entries = loadJournal().map((e) =>
    e.id === id ? { ...e, note: String(note ?? "").slice(0, 2000) } : e
  );
  persist(entries);
  return entries;
}

export function removeEntry(id) {
  const next = loadJournal().filter((e) => e.id !== id);
  persist(next);
  return next;
}

export function clearJournal() {
  persist([]);
  return [];
}

/** Keep newest `keep` entries (newest-first). Used by cap-lowering confirm. */
export function trimToCap(keep) {
  const next = loadJournal().slice(0, Math.max(0, keep));
  persist(next);
  return next;
}

export function exportJournalJSON() {
  return JSON.stringify(loadJournal(), null, 2);
}

function cardLabel(cardId, orientation) {
  const card = byId(cardId);
  const name = card ? card.name : cardId;
  return `${name} (${orientation === "reversed" ? "Reversed" : "Upright"})`;
}

export function formatEntryText(e) {
  const date = new Date(e.at).toLocaleString();
  const lines = [
    `— ${e.spreadId} · ${date} —`,
    e.name ? `Name: ${e.name}` : null,
    e.question ? `Question: ${e.question}` : null,
    ...e.picks.map(
      (p, i) => `${i + 1}. ${cardLabel(p.cardId, p.orientation)}`
    ),
    e.note ? `Note: ${e.note}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function exportJournalText() {
  const entries = loadJournal();
  if (entries.length === 0) return "No readings saved yet.";
  return entries.map(formatEntryText).join("\n\n");
}
