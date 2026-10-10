"use client";

import { useMemo, useState } from "react";
import { CARD_IDS, byId } from "../lib/cards";
import { drawOrientation, shuffleDeck } from "../lib/shuffle";
import { decodeReading } from "../lib/share";
import TarotCard from "./TarotCard";
import IntentStep from "./IntentStep";
import JournalPanel from "./JournalPanel";
import ShareButtons from "./ShareButtons";
import styles from "./DeckFan.module.css";

/**
 * Blind pick deck. A shuffled fan of identical facedown backs.
 * M1: gated behind IntentStep (optional name/question), generic
 * `labels` per position instead of hardcoded Past/Present/Future.
 * M3: opens shared readings (?r=) in reveal mode, no shuffle needed.
 * The user selects `pickCount` backs, then flips each to reveal.
 * With `verdict`, the reveal is read as an omen for a yes or no question.
 * Shuffle lives in lib/shuffle.js (crypto-random Fisher–Yates).
 * onComplete(picks, { name, question, spreadId }) — context for M2/M3.
 */
const shuffleBtn =
  "cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-7 py-3 font-display text-lg font-bold tracking-wide text-[#14100a] shadow-[0_6px_24px_rgba(212,175,55,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)] disabled:cursor-wait disabled:opacity-60";

const VERDICTS = {
  Yes: {
    text: "The Omen Says Yes",
    cls: "border-[#7ba05b]/70 bg-[#7ba05b]/10 text-[#b8e6b8] shadow-[0_0_24px_rgba(123,160,91,0.25)]",
  },
  No: {
    text: "The Omen Says No",
    cls: "border-[#8e2f32]/80 bg-[#8e2f32]/10 text-[#e8a0a0] shadow-[0_0_24px_rgba(142,47,50,0.25)]",
  },
  Unclear: {
    text: "The Veil Holds: Unclear",
    cls: "border-moon/50 bg-moon/10 text-moon shadow-[0_0_24px_rgba(201,207,232,0.15)]",
  },
};

export default function DeckFan({
  pickCount = 1,
  labels = [],
  spreadId = "custom",
  intentPrompt,
  title = "Choose",
  verdict = false,
  onComplete,
}) {
  // M3: a shared link (?r=) bypasses intent + shuffle entirely.
  const [shared, setShared] = useState(() => readSharedParam());
  const [intent, setIntent] = useState(null);
  const [order, setOrder] = useState(() => shuffleDeck(CARD_IDS));
  const [picked, setPicked] = useState([]);
  const [shuffling, setShuffling] = useState(false);

  const fan = useMemo(() => order.slice(0, 12), [order]);

  const reshuffle = () => {
    setShuffling(true);
    window.setTimeout(() => {
      setOrder(shuffleDeck(CARD_IDS));
      setPicked([]);
      setShuffling(false);
    }, 450);
  };

  /** Leave a shared reading and start a fresh draw on this page. */
  const drawOwn = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("r");
      window.history.replaceState(null, "", url.toString());
    } catch {
      // URL API unavailable: shared view still clears below.
    }
    setShared(null);
    setIntent(null);
    setPicked([]);
    setOrder(shuffleDeck(CARD_IDS));
  };

  const pick = (deckIndex) => {
    if (picked.includes(deckIndex) || picked.length >= pickCount) return;
    const cardId = fan[deckIndex];
    const entry = { deckIndex, cardId, orientation: drawOrientation() };
    const next = [...picked, entry];
    setPicked(next);
    if (next.length === pickCount)
      onComplete?.(next, {
        name: intent?.name ?? "",
        question: intent?.question ?? "",
        spreadId,
      });
  };

  const done = picked.length >= pickCount;

  if (shared) {
    if (!shared.ok) {
      return (
        <section aria-label={title} className="flex flex-col items-center gap-5 text-center">
          <div className="w-full max-w-[32rem] rounded-[14px] border border-[#8e2f32]/70 bg-[#8e2f32]/10 p-6">
            <p className="m-0 mb-4 leading-relaxed">
              This shared link looks broken — the cards couldn&apos;t be read.
              It may have been cut off when copying.
            </p>
            <button type="button" onClick={drawOwn} className={shuffleBtn}>
              Draw your own instead
            </button>
          </div>
        </section>
      );
    }
    const d = shared.data;
    const items = d.picks.map((p, i) => ({ deckIndex: i, cardId: p.cardId, orientation: p.orientation }));
    const viewLabels = d.labels.length > 0 ? d.labels : labels;
    const viewVerdict = typeof d.verdict === "boolean" ? d.verdict : verdict;
    const sharedKey = `shared|${d.spreadId}|${d.picks.map((p) => `${p.cardId}:${p.orientation}`).join(",")}`;
    return (
      <section aria-label={title} className="flex flex-col items-center gap-7">
        <p className="m-0 max-w-[34rem] text-center text-[0.95rem] leading-relaxed text-muted">
          This is a shared reading
          {d.question ? (
            <>
              {" "}— <span className="italic">“{d.question}”</span>
              {d.name ? <span> · {d.name}</span> : null}
            </>
          ) : d.name ? (
            <> for {d.name}</>
          ) : null}
          . Select each card to reveal it.
        </p>
        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          <RevealFigures items={items} labels={viewLabels} verdict={viewVerdict} pickCount={items.length} />
        </div>
        <JournalPanel
          key={sharedKey}
          picks={d.picks}
          meta={{ name: d.name, question: d.question, spreadId: d.spreadId }}
          labels={viewLabels}
          readingKey={sharedKey}
        />
        <ShareButtons
          picks={d.picks}
          meta={{ name: d.name, question: d.question, spreadId: d.spreadId }}
          labels={viewLabels}
          verdict={viewVerdict}
          spreadTitle={title}
        />
        <button type="button" onClick={drawOwn} className={shuffleBtn}>
          Draw your own
        </button>
      </section>
    );
  }

  if (!intent) {
    return (
      <section aria-label={title} className="flex flex-col items-center gap-7">
        <IntentStep
          prompt={intentPrompt}
          onBegin={(v) => {
            setIntent(v);
            setOrder(shuffleDeck(CARD_IDS));
            setPicked([]);
          }}
        />
      </section>
    );
  }

  return (
    <section aria-label={title} className="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center gap-3 text-center">
        <button type="button" onClick={reshuffle} disabled={shuffling} className={shuffleBtn}>
          {shuffling ? "Shuffling…" : "⟳ Shuffle the Deck"}
        </button>
        {(intent.name || intent.question) && (
          <p className="m-0 max-w-[34rem] text-[0.95rem] leading-relaxed text-muted">
            {intent.question ? (
              <>
                <span className="italic">“{intent.question}”</span>
                {intent.name ? <span> · {intent.name}</span> : null}
              </>
            ) : (
              <span>{intent.name}</span>
            )}{" "}
            <button
              type="button"
              onClick={() => setIntent(null)}
              className="cursor-pointer bg-transparent p-0 text-sm text-moon underline underline-offset-2 hover:text-goldbright"
            >
              Edit
            </button>
          </p>
        )}
        <p aria-live="polite" className="m-0 max-w-[34rem] text-[0.95rem] text-muted">
          {done
            ? "Your cards are chosen. Select each one to reveal it."
            : verdict
              ? "Touch one card. Every back is identical."
              : `Touch ${pickCount === 1 ? "one card" : `${pickCount - picked.length} card${pickCount - picked.length === 1 ? "" : "s"}`} from the fan. Every back is identical.`}
        </p>
      </div>

      {!done ? (
        <ul className={`${styles.fan} ${shuffling ? styles.shuffling : ""}`} role="list">
          {fan.map((id, i) => {
            const taken = picked.some((p) => p.deckIndex === i);
            return (
              <li key={`${id}-${i}`} style={{ "--tilt": `${(i - 5.5) * 4}deg`, "--lift": `${Math.abs(i - 5.5) * 7}px` }}>
                <button
                  type="button"
                  className={`${styles.back} ${taken ? styles.taken : ""}`}
                  onClick={() => pick(i)}
                  disabled={taken}
                  aria-label={taken ? `Card ${i + 1} already chosen` : `Choose card ${i + 1} of 12, lying facedown`}
                >
                  <span aria-hidden="true">☾</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex w-full flex-wrap items-start justify-center gap-8">
          <RevealFigures items={picked} labels={labels} verdict={verdict} pickCount={pickCount} />
          <button type="button" onClick={reshuffle} className={`${shuffleBtn} self-center`}>
            Draw Again
          </button>
          </div>
          <JournalPanel
            key={`${spreadId}|${picked.map((p) => `${p.cardId}:${p.orientation}`).join(",")}`}
            picks={picked.map((p) => ({ cardId: p.cardId, orientation: p.orientation }))}
            meta={{ name: intent.name, question: intent.question, spreadId }}
            labels={labels}
            readingKey={`${spreadId}|${picked.map((p) => `${p.cardId}:${p.orientation}`).join(",")}`}
          />
          <ShareButtons
            picks={picked.map((p) => ({ cardId: p.cardId, orientation: p.orientation }))}
            meta={{ name: intent.name, question: intent.question, spreadId }}
            labels={labels}
            verdict={verdict}
            spreadTitle={title}
          />
        </div>
      )}
    </section>
  );
}

function resolveLabel(labels, count, n) {
  if (labels[n]) return labels[n];
  if (count === 1) return "Your Card";
  return `Card ${n + 1}`;
}

/** Read ?r= on first render (client only; null during prerender). */
function readSharedParam() {
  if (typeof window === "undefined") return null;
  try {
    const code = new URLSearchParams(window.location.search).get("r");
    if (!code) return null;
    const data = decodeReading(code);
    return data ? { ok: true, data } : { ok: false };
  } catch {
    return null;
  }
}

/** Facedown-to-reveal card grid, reused by own draws and shared readings. */
function RevealFigures({ items, labels, verdict, pickCount }) {
  const [revealed, setRevealed] = useState({});
  return (
    <>
      {items.map((p, n) => {
        const card = byId(p.cardId);
        if (!card) return null;
        const omen = verdict ? VERDICTS[card.yesNo] : null;
        return (
          <figure key={p.deckIndex} className="m-0 flex max-w-[280px] flex-col items-center gap-4">
            <TarotCard
              card={card}
              orientation={p.orientation}
              startFlipped={false}
              size="md"
              onFlip={(open) => setRevealed((r) => ({ ...r, [n]: open }))}
            />
            <figcaption className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-gold">
                {verdict ? "The Answer" : resolveLabel(labels, pickCount, n)}
              </span>
              {revealed[n] ? (
                <>
                  {omen && (
                    <strong
                      aria-live="polite"
                      className={`rounded-xl border px-4 py-2 font-display text-2xl leading-snug text-balance ${omen.cls}`}
                    >
                      {omen.text}
                    </strong>
                  )}
                  <strong className="font-display text-2xl text-parchment">{card.name}</strong>
                  <span className="text-xs uppercase tracking-[0.2em] text-moon">
                    {p.orientation === "reversed" ? "Reversed" : "Upright"}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed">
                    {p.orientation === "reversed" ? card.reversed : card.upright}
                  </span>
                </>
              ) : (
                <span className="italic text-muted">Select the card to reveal it…</span>
              )}
            </figcaption>
          </figure>
        );
      })}
    </>
  );
}
