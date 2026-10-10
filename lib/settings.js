/**
 * M2: Journal settings. Local-only under `tarot.settings.v1`.
 * { autosave: boolean, cap: number } — cap floor is 200 per spec.
 */
export const SETTINGS_KEY = "tarot.settings.v1";
export const MIN_CAP = 200;
export const DEFAULTS = { autosave: true, cap: 200 };

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadSettings() {
  if (!canStore()) return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    const autosave =
      typeof parsed.autosave === "boolean" ? parsed.autosave : DEFAULTS.autosave;
    const cap =
      Number.isFinite(Number(parsed.cap)) && Number(parsed.cap) >= MIN_CAP
        ? Math.floor(Number(parsed.cap))
        : DEFAULTS.cap;
    return { autosave, cap };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(partial) {
  const next = { ...loadSettings(), ...partial };
  if (!Number.isFinite(Number(next.cap)) || Number(next.cap) < MIN_CAP) {
    next.cap = Math.max(MIN_CAP, Math.floor(Number(next.cap)) || MIN_CAP);
  } else {
    next.cap = Math.floor(Number(next.cap));
  }
  next.autosave = !!next.autosave;
  if (canStore()) {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // Never throw into UI.
    }
  }
  return next;
}
