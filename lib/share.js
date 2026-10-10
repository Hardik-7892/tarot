/**
 * M3: Share a reading via URL (?r=) + clipboard text.
 * Payload: { v:1, spreadId, labels, verdict, name, question, picks:[{cardId, orientation}] }
 * Encoded as base64url(JSON). No backend; links reopen the same page.
 */
import { byId } from "./cards";

const MAX_PICKS = 12;

function toB64url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(code) {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Encode a reading to a URL-safe string. Returns null on failure. */
export function encodeReading({ spreadId = "custom", labels = [], verdict = false, name = "", question = "", picks = [] }) {
  try {
    const payload = {
      v: 1,
      spreadId: String(spreadId).slice(0, 40),
      labels: labels.filter((l) => typeof l === "string").slice(0, MAX_PICKS).map((l) => l.slice(0, 40)),
      verdict: !!verdict,
      name: String(name ?? "").slice(0, 60),
      question: String(question ?? "").slice(0, 500),
      picks: picks.slice(0, MAX_PICKS).map((p) => ({
        c: p.cardId,
        o: p.orientation === "reversed" ? "r" : "u",
      })),
    };
    if (payload.picks.length === 0) return null;
    return toB64url(JSON.stringify(payload));
  } catch {
    return null;
  }
}

/** Decode + validate a shared code. Returns data or null. */
export function decodeReading(code) {
  try {
    if (typeof code !== "string" || code.length === 0 || code.length > 4000) return null;
    const parsed = JSON.parse(fromB64url(code));
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.picks)) return null;
    if (parsed.picks.length === 0 || parsed.picks.length > MAX_PICKS) return null;
    const picks = [];
    for (const p of parsed.picks) {
      if (!p || typeof p.c !== "string") return null;
      const card = byId(p.c);
      if (!card) return null;
      picks.push({ cardId: card.id, orientation: p.o === "r" ? "reversed" : "upright" });
    }
    return {
      spreadId: typeof parsed.spreadId === "string" && parsed.spreadId ? parsed.spreadId.slice(0, 40) : "custom",
      labels: Array.isArray(parsed.labels)
        ? parsed.labels.filter((l) => typeof l === "string").slice(0, MAX_PICKS)
        : [],
      verdict: !!parsed.verdict,
      name: typeof parsed.name === "string" ? parsed.name.slice(0, 60) : "",
      question: typeof parsed.question === "string" ? parsed.question.slice(0, 500) : "",
      picks,
    };
  } catch {
    return null;
  }
}

/** Human-readable reading text for clipboard sharing. */
export function formatReadingText({ spreadTitle = "Tarot reading", name = "", question = "", labels = [], verdict = false, picks = [] }) {
  const lines = [`— ${spreadTitle} —`];
  if (question) lines.push(`Question: ${question}`);
  if (name) lines.push(`For: ${name}`);
  picks.forEach((p, i) => {
    const card = byId(p.cardId);
    if (!card) return;
    const label = verdict ? "The Answer" : labels[i] ?? (picks.length === 1 ? "Your Card" : `Card ${i + 1}`);
    const orientation = p.orientation === "reversed" ? "Reversed" : "Upright";
    const meaning = p.orientation === "reversed" ? card.reversed : card.upright;
    lines.push(`\n${i + 1}. ${label} — ${card.name} (${orientation})\n${meaning}`);
    if (verdict) lines.push(`Omen: ${card.yesNo}`);
  });
  return lines.join("\n");
}
