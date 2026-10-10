"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { saveEntry, updateNote } from "../lib/journal";
import { loadSettings, saveSettings } from "../lib/settings";

/**
 * M2: Post-draw save UI. Rendered by DeckFan once picks are complete.
 * - autosave ON: saves once per readingKey, shows "Saved" + note field.
 * - autosave OFF: shows Save button, idempotent (repeat clicks -> notice).
 * readingKey must change per reading (parent builds from picks).
 */
export default function JournalPanel({ picks = [], meta, labels = [], readingKey }) {
  const { name = "", question = "", spreadId = "custom" } = meta ?? {};
  const [settings, setSettings] = useState(() => loadSettings());
  const [savedId, setSavedId] = useState(null);
  const [dropped, setDropped] = useState(0);
  const [notice, setNotice] = useState("");
  const [note, setNote] = useState("");
  // Guard so StrictMode / re-renders save at most once per reading.
  // (Parent also remounts this panel per readingKey, so no reset effect.)
  const doneKey = useRef(null);

  // Autosave once per reading: intentional sync to external localStorage.
  useEffect(() => {
    if (!picks.length || !settings.autosave) return;
    if (doneKey.current === readingKey) return;
    doneKey.current = readingKey;
    const { entry, dropped: d } = saveEntry({
      spreadId,
      name,
      question,
      note: "",
      picks,
    });
    setSavedId(entry.id);
    setDropped(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingKey, settings.autosave]);

  const manualSave = () => {
    if (savedId) {
      setNotice("Already saved to your journal.");
      return;
    }
    doneKey.current = readingKey;
    const { entry, dropped: d } = saveEntry({ spreadId, name, question, note: "", picks });
    setSavedId(entry.id);
    setDropped(d);
    setNotice("");
  };

  const toggleAutosave = () => {
    const next = saveSettings({ autosave: !settings.autosave });
    setSettings(next);
  };

  const saveNote = () => {
    if (!savedId) return;
    updateNote(savedId, note);
    setNotice("Note saved.");
  };

  return (
    <div className="mx-auto w-full max-w-[32rem] rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-5 text-left">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <strong className="font-display text-lg text-parchment">
          {savedId ? "Saved to journal ✓" : "Save this reading?"}
        </strong>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={settings.autosave}
            onChange={toggleAutosave}
            className="h-4 w-4 accent-[#d4af37]"
          />
          Autosave
        </label>
      </div>

      <p className="m-0 mb-3 text-sm italic text-muted">
        Saved only in this browser — nothing leaves your device.
      </p>

      {!savedId && !settings.autosave && (
        <button
          type="button"
          onClick={manualSave}
          className="cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-6 py-2 font-display text-base font-bold text-[#14100a] transition hover:-translate-y-0.5"
        >
          Save reading
        </button>
      )}

      {savedId && (
        <>
          {dropped > 0 && (
            <p className="mb-3 text-sm text-goldbright">
              Journal was full — removed {dropped} oldest{" "}
              {dropped === 1 ? "reading" : "readings"} to stay under your cap.
            </p>
          )}
          <label
            htmlFor="journal-note"
            className="mb-1 block text-xs uppercase tracking-[0.25em] text-gold"
          >
            Reflection note <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="journal-note"
            rows={2}
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="One line tonight: what landed?"
            className="mb-2 w-full resize-y rounded-xl border border-gold/40 bg-abyss px-4 py-2.5 text-ink placeholder:text-muted"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={saveNote}
              className="cursor-pointer rounded-full border border-gold/55 px-5 py-1.5 text-sm font-semibold text-parchment transition hover:border-goldbright hover:text-goldbright"
            >
              Save note
            </button>
            <Link
              href="/journal"
              className="text-sm font-semibold text-moon hover:text-goldbright"
            >
              Open journal →
            </Link>
          </div>
        </>
      )}

      {notice && (
        <p aria-live="polite" className="m-0 mt-3 text-sm text-goldbright">
          {notice}
        </p>
      )}
    </div>
  );
}
