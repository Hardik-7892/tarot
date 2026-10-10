"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { byId } from "../../lib/cards";
import {
  clearJournal,
  exportJournalJSON,
  exportJournalText,
  loadJournal,
  removeEntry,
  trimToCap,
} from "../../lib/journal";
import { MIN_CAP, loadSettings, saveSettings } from "../../lib/settings";

const btnGhost =
  "cursor-pointer rounded-full border border-gold/55 px-5 py-1.5 text-sm font-semibold text-parchment transition hover:border-goldbright hover:text-goldbright disabled:cursor-not-allowed disabled:opacity-50";

export default function JournalView() {
  // localStorage is synchronous: lazy init avoids mount effects entirely.
  const [entries, setEntries] = useState(() => loadJournal());
  const [settings, setSettings] = useState(() => loadSettings());
  const [query, setQuery] = useState("");
  const [spread, setSpread] = useState("all");
  const [capInput, setCapInput] = useState(() => String(loadSettings().cap));
  const [pendingCap, setPendingCap] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [notice, setNotice] = useState("");

  const spreads = useMemo(
    () => ["all", ...Array.from(new Set(entries.map((e) => e.spreadId)))],
    [entries]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const inSpread = spread === "all" || e.spreadId === spread;
      if (!inSpread) return false;
      if (!q) return true;
      const cardNames = e.picks
        .map((p) => byId(p.cardId)?.name?.toLowerCase() ?? "")
        .join(" ");
      return (
        (e.name ?? "").toLowerCase().includes(q) ||
        (e.question ?? "").toLowerCase().includes(q) ||
        (e.note ?? "").toLowerCase().includes(q) ||
        cardNames.includes(q)
      );
    });
  }, [entries, query, spread]);

  const flash = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(""), 4000);
  };

  const download = (filename, text, type) => {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const doDelete = (id) => {
    setEntries(removeEntry(id));
    setPendingDelete(null);
  };

  const doClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    setEntries(clearJournal());
    setConfirmClear(false);
    flash("Journal cleared. Settings kept.");
  };

  const applyCap = () => {
    const parsed = Math.floor(Number(capInput));
    if (!Number.isFinite(parsed) || parsed < MIN_CAP) {
      flash(`Cap must be at least ${MIN_CAP}.`);
      setCapInput(String(settings.cap));
      return;
    }
    if (parsed === settings.cap) return;
    if (parsed < entries.length) {
      setPendingCap(parsed); // open guard modal
      return;
    }
    setSettings(saveSettings({ cap: parsed }));
    flash(`Cap set to ${parsed}.`);
  };

  const confirmCapCut = () => {
    const n = pendingCap;
    setEntries(trimToCap(n));
    setSettings(saveSettings({ cap: n }));
    setPendingCap(null);
    flash(`Cap lowered to ${n}. Oldest readings removed.`);
  };

  const toggleAutosave = () => setSettings(saveSettings({ autosave: !settings.autosave }));

  const copyText = async (text, okMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      flash(okMsg);
    } catch {
      flash("Copy blocked by the browser — use Export instead.");
    }
  };

  return (
    <div className="mx-auto max-w-[860px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Reading Journal
      </h1>
      <p className="mx-auto mb-8 max-w-[36rem] text-center leading-relaxed text-muted">
        Saved only in this browser — nothing leaves your device. Use names to
        tell people apart on a shared device.
      </p>

      {/* Controls */}
      <div className="mb-6 grid gap-4 rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="journal-search" className="text-xs uppercase tracking-[0.25em] text-gold">
              Search
            </label>
            <input
              id="journal-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, question, card, note…"
              className="rounded-xl border border-gold/40 bg-abyss px-4 py-2.5 text-ink placeholder:text-muted"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="journal-spread" className="text-xs uppercase tracking-[0.25em] text-gold">
              Spread
            </label>
            <select
              id="journal-spread"
              value={spread}
              onChange={(e) => setSpread(e.target.value)}
              className="rounded-xl border border-gold/40 bg-abyss px-4 py-2.5 text-ink"
            >
              {spreads.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All spreads" : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => download("tarot-journal.json", exportJournalJSON(), "application/json")} className={btnGhost} disabled={entries.length === 0}>
            Export JSON
          </button>
          <button type="button" onClick={() => download("tarot-journal.txt", exportJournalText(), "text/plain")} className={btnGhost} disabled={entries.length === 0}>
            Export TXT
          </button>
          <button type="button" onClick={() => copyText(exportJournalText(), "Journal copied as text.")} className={btnGhost} disabled={entries.length === 0}>
            Copy
          </button>
          <button type="button" onClick={doClear} className={`${btnGhost} border-[#8e2f32]/70`}>
            {confirmClear ? "Click again to confirm clear" : "Clear history"}
          </button>
          {confirmClear && (
            <button type="button" onClick={() => setConfirmClear(false)} className={btnGhost}>
              Cancel
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-3 border-t border-gold/20 pt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="journal-cap" className="text-xs uppercase tracking-[0.25em] text-gold">
              Cap (min {MIN_CAP})
            </label>
            <input
              id="journal-cap"
              type="number"
              min={MIN_CAP}
              step={1}
              value={capInput}
              onChange={(e) => setCapInput(e.target.value)}
              className="w-32 rounded-xl border border-gold/40 bg-abyss px-4 py-2 text-ink"
            />
          </div>
          <button type="button" onClick={applyCap} className={btnGhost}>
            Set cap
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={settings.autosave}
              onChange={toggleAutosave}
              className="h-4 w-4 accent-[#d4af37]"
            />
            Autosave new readings
          </label>
        </div>
        {Number(capInput) > 1000 && (
          <p className="m-0 text-sm text-goldbright">
            Large caps use more browser storage. JSON export is a good backup.
          </p>
        )}
        <p aria-live="polite" className="m-0 text-sm text-muted">
          {entries.length} of {settings.cap} saved
          {notice ? ` · ${notice}` : ""}
        </p>
      </div>

      {/* Cap-lowering guard */}
      {pendingCap !== null && (
        <div role="alertdialog" aria-modal="true" aria-labelledby="cap-guard-title" className="mb-6 rounded-[14px] border border-[#8e2f32]/70 bg-[#8e2f32]/10 p-5">
          <h2 id="cap-guard-title" className="mb-2 font-display text-xl text-parchment">
            Lower the cap?
          </h2>
          <p className="mb-4 leading-relaxed">
            You have {entries.length} readings. Lowering the cap to {pendingCap} will
            delete the {entries.length - pendingCap} oldest. This cannot be undone
            (export first if unsure).
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={confirmCapCut} className={btnGhost}>
              Delete oldest &amp; continue
            </button>
            <button type="button" onClick={() => { setPendingCap(null); setCapInput(String(settings.cap)); }} className={btnGhost}>
              Keep {entries.length}
            </button>
          </div>
        </div>
      )}

      {/* Entries */}
      {results.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <p>{entries.length === 0 ? "No readings saved yet." : "No readings match your search."}</p>
          <p>
            <Link href="/daily" className="font-semibold text-moon hover:text-goldbright">
              Draw a card →
            </Link>
          </p>
        </div>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {results.map((e) => (
            <li key={e.id} className="rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-5">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <strong className="font-display text-lg text-parchment">
                  {e.spreadId}
                </strong>
                <span className="text-sm text-muted">
                  {new Date(e.at).toLocaleString()}
                  {e.name ? ` · ${e.name}` : ""}
                </span>
              </div>
              {e.question && <p className="mb-2 italic leading-relaxed">“{e.question}”</p>}
              <ul className="m-0 mb-2 flex list-disc flex-col gap-1 pl-5 leading-relaxed">
                {e.picks.map((p, i) => {
                  const card = byId(p.cardId);
                  return (
                    <li key={i}>
                      <Link href={`/cards/${p.cardId}`} className="font-semibold text-moon hover:text-goldbright">
                        {card ? card.name : p.cardId}
                      </Link>{" "}
                      <span className="text-sm uppercase tracking-[0.15em] text-gold">
                        {p.orientation}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {e.note && <p className="mb-2 text-sm leading-relaxed text-muted">Note: {e.note}</p>}
              {pendingDelete === e.id ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => doDelete(e.id)} className={`${btnGhost} border-[#8e2f32]/70`}>
                    Confirm delete
                  </button>
                  <button type="button" onClick={() => setPendingDelete(null)} className={btnGhost}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setPendingDelete(e.id)} className={btnGhost}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
