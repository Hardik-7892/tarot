"use client";

import { useState } from "react";
import Link from "next/link";
import { CARDS } from "../../../lib/cards";
import TarotCard from "../../../components/TarotCard";

/** Crypto-random int in [0, n). Falls back to Math.random during prerender. */
function randIndex(n) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % n;
  }
  return Math.floor(Math.random() * n);
}

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * M6: Flashcards. One random card per round; distractors come from the same
 * arcana (same suit for minors) so guessing takes real knowledge.
 * Score lives in state only — nothing is stored.
 */
function buildRound() {
  const card = CARDS[randIndex(CARDS.length)];
  const samePool = CARDS.filter(
    (c) => c.id !== card.id && (card.arcana === "major" ? c.arcana === "major" : c.suit === card.suit)
  );
  const pool = [...(samePool.length >= 3 ? samePool : CARDS.filter((c) => c.id !== card.id))];
  const options = [card];
  while (options.length < 4 && pool.length > 0) {
    options.push(pool.splice(randIndex(pool.length), 1)[0]);
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = randIndex(i + 1);
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { card, options };
}

const btnBase =
  "cursor-pointer rounded-xl border px-5 py-3 text-left transition disabled:cursor-default";

export default function Quiz() {
  const [round, setRound] = useState(() => buildRound());
  const [phase, setPhase] = useState("ask");
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState("");
  const [typedOk, setTypedOk] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [mode, setMode] = useState("choice");

  const { card } = round;
  const answered = phase === "answered";

  const grade = (ok) => {
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
      streak: ok ? s.streak + 1 : 0,
    }));
    setPhase("answered");
  };

  const answerChoice = (i) => {
    if (answered) return;
    setPicked(i);
    grade(round.options[i].id === card.id);
  };

  const answerTyped = (e) => {
    e?.preventDefault();
    if (answered) return;
    const ok = normalize(typed) === normalize(card.name);
    setTypedOk(ok);
    grade(ok);
  };

  const next = () => {
    setRound(buildRound());
    setPhase("ask");
    setPicked(null);
    setTyped("");
    setTypedOk(null);
  };

  const switchMode = (m) => {
    if (m === mode) return;
    setMode(m);
    setRound(buildRound());
    setPhase("ask");
    setPicked(null);
    setTyped("");
    setTypedOk(null);
  };

  const lastCorrect =
    mode === "choice"
      ? picked !== null && round.options[picked]?.id === card.id
      : typedOk === true;

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Card Quiz
      </h1>
      <p className="mx-auto mb-6 max-w-[36rem] text-center leading-relaxed text-muted">
        The back of a random card, drawn from all 78. Name it — then read its
        essence. Wrong answers teach more than right ones here.
      </p>

      <div className="mx-auto mb-8 flex max-w-[32rem] flex-wrap items-center justify-center gap-2">
        <span aria-live="polite" className="mr-2 text-sm tabular-nums text-muted">
          {score.correct}/{score.total} · streak {score.streak}
        </span>
        {(["choice", "type"]).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => switchMode(m)}
            className={
              mode === m
                ? "cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-4 py-1.5 text-sm font-bold text-[#14100a]"
                : "cursor-pointer rounded-full border border-gold/35 bg-transparent px-4 py-1.5 text-sm text-ink hover:border-goldbright hover:text-goldbright"
            }
          >
            {m === "choice" ? "Multiple choice" : "Type it"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setScore({ correct: 0, total: 0, streak: 0 })}
          className="cursor-pointer bg-transparent p-1 text-sm text-moon underline underline-offset-2 hover:text-goldbright"
        >
          Reset score
        </button>
      </div>

      <div className="mb-6 flex justify-center">
        <TarotCard
          key={card.id + phase}
          card={card}
          startFlipped={answered}
          size="md"
          interactive={false}
        />
      </div>

      {!answered && mode === "choice" && (
        <div role="group" aria-label="Which card is this?" className="mx-auto grid max-w-[32rem] gap-2">
          {round.options.map((o, i) => (
            <button key={o.id} type="button" onClick={() => answerChoice(i)} className={`${btnBase} border-gold/40 bg-abyss text-ink hover:border-goldbright hover:text-goldbright`}>
              <span className="mr-3 text-gold">{["A", "B", "C", "D"][i]}.</span>
              {o.name}
            </button>
          ))}
        </div>
      )}

      {!answered && mode === "type" && (
        <form onSubmit={answerTyped} className="mx-auto flex max-w-[32rem] gap-2">
          <label htmlFor="quiz-answer" className="sr-only">
            Card name
          </label>
          <input
            id="quiz-answer"
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="e.g. Three of Swords"
            className="min-w-0 flex-1 rounded-xl border border-gold/40 bg-abyss px-4 py-3 text-lg text-ink placeholder:text-muted"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-xl border border-goldbright bg-linear-to-b from-goldbright to-gold px-6 py-3 font-display text-lg font-bold text-[#14100a] transition hover:-translate-y-0.5"
          >
            Check
          </button>
        </form>
      )}

      {answered && (
        <section aria-live="polite" aria-label="Result" className="mx-auto mt-2 flex max-w-[32rem] flex-col items-center gap-3 text-center">
          <p className={`m-0 font-display text-2xl ${lastCorrect ? "text-[#b8e6b8]" : "text-[#e8a0a0]"}`}>
            {lastCorrect ? "Correct — well read." : `Not quite — this is ${card.name}.`}
          </p>
          <p className="m-0 font-display text-lg italic leading-relaxed text-goldbright">
            {card.essence}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={next}
              className="cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-7 py-2.5 font-display text-lg font-bold text-[#14100a] transition hover:-translate-y-0.5"
            >
              Next card
            </button>
            <Link
              href={`/cards/${card.id}`}
              className="self-center font-semibold text-moon hover:text-goldbright"
            >
              Full meaning →
            </Link>
          </div>
        </section>
      )}

      {answered && (
        <div className="mx-auto mt-6 grid max-w-[32rem] gap-2 opacity-80">
          {round.options.map((o, i) => {
            const isAnswer = o.id === card.id;
            const isPick = mode === "choice" && picked === i;
            return (
              <div
                key={o.id}
                className={`${btnBase} ${
                  isAnswer
                    ? "border-[#7ba05b]/70 text-[#b8e6b8]"
                    : isPick
                      ? "border-[#8e2f32]/80 text-[#e8a0a0]"
                      : "border-gold/20 text-muted"
                }`}
              >
                <span className="mr-3">{["A", "B", "C", "D"][i]}.</span>
                {o.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
