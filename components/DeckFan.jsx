"use client";

import { useMemo, useState } from "react";
import { CARD_IDS, byId } from "../lib/cards";
import { drawOrientation, shuffleDeck } from "../lib/shuffle";
import TarotCard from "./TarotCard";
import styles from "./DeckFan.module.css";

/**
 * Blind pick deck. A shuffled fan of identical facedown backs.
 * The user selects `pickCount` backs, then flips each to reveal.
 * With `verdict`, the reveal is read as an omen for a yes or no question.
 * Shuffle lives in lib/shuffle.js (crypto-random Fisher–Yates).
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

export default function DeckFan({ pickCount = 1, title = "Choose", verdict = false, onComplete }) {
  const [order, setOrder] = useState(() => shuffleDeck(CARD_IDS));
  const [picked, setPicked] = useState([]);
  const [revealed, setRevealed] = useState({});
  const [shuffling, setShuffling] = useState(false);

  const fan = useMemo(() => order.slice(0, 12), [order]);

  const reshuffle = () => {
    setShuffling(true);
    window.setTimeout(() => {
      setOrder(shuffleDeck(CARD_IDS));
      setPicked([]);
      setRevealed({});
      setShuffling(false);
    }, 450);
  };

  const pick = (deckIndex) => {
    if (picked.includes(deckIndex) || picked.length >= pickCount) return;
    const cardId = fan[deckIndex];
    const entry = { deckIndex, cardId, orientation: drawOrientation() };
    const next = [...picked, entry];
    setPicked(next);
    if (next.length === pickCount) onComplete?.(next);
  };

  const done = picked.length >= pickCount;

  return (
    <section aria-label={title} className="flex flex-col items-center gap-7">
      <div className="flex flex-col items-center gap-3 text-center">
        <button type="button" onClick={reshuffle} disabled={shuffling} className={shuffleBtn}>
          {shuffling ? "Shuffling…" : "⟳ Shuffle the Deck"}
        </button>
        <p aria-live="polite" className="m-0 max-w-[34rem] text-[0.95rem] text-muted">
          {done
            ? "Your cards are chosen. Select each one to reveal it."
            : verdict
              ? "Hold your question of yes or no in mind, then touch one card. Every back is identical."
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
        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          {picked.map((p, n) => {
            const card = byId(p.cardId);
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
                    {verdict ? "The Answer" : pickLabel(pickCount, n)}
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
          <button type="button" onClick={reshuffle} className={`${shuffleBtn} self-center`}>
            Draw Again
          </button>
        </div>
      )}
    </section>
  );
}

function pickLabel(count, n) {
  if (count === 1) return "Your Card";
  return ["Past", "Present", "Future"][n] ?? `Card ${n + 1}`;
}
