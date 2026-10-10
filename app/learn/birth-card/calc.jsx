"use client";

import { useState } from "react";
import Link from "next/link";
import { MAJOR_ARCANA } from "../../../lib/cards";
import TarotCard from "../../../components/TarotCard";
import Gloss from "../../../components/Gloss";

const digitSum = (n) => String(Math.abs(n)).split("").reduce((a, d) => a + Number(d), 0);

/**
 * M5: Birth / soul card. Sum birthdate digits, reduce until <= 22,
 * then map 1–21 to the Majors and 22 to The Fool (0).
 * Result is shareable via ?d=YYYY-MM-DD. Client-only, no storage.
 */
export function reduceBirthdate(iso) {
  const digits = String(iso).replace(/\D/g, "");
  if (digits.length < 8) return null;
  const steps = [];
  let n = digits.split("").reduce((a, d) => a + Number(d), 0);
  steps.push(n);
  while (n > 22) {
    n = digitSum(n);
    steps.push(n);
  }
  return { total: steps[0], steps, final: n };
}

export function cardForNumber(n) {
  return MAJOR_ARCANA.find((c) => c.number === (n === 22 ? 0 : n)) ?? null;
}

function readDateParam() {
  if (typeof window === "undefined") return "";
  try {
    const d = new URLSearchParams(window.location.search).get("d") ?? "";
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "";
  } catch {
    return "";
  }
}

export default function BirthCardCalc() {
  const [date, setDate] = useState(() => readDateParam());
  const [notice, setNotice] = useState("");

  const result = date ? reduceBirthdate(date) : null;
  const card = result ? cardForNumber(result.final) : null;
  const valid = !!card;

  const copyLink = async () => {
    if (!valid) return;
    try {
      const { origin, pathname } = window.location;
      await navigator.clipboard.writeText(`${origin}${pathname}?d=${date}`);
      setNotice("Link to this result copied.");
    } catch {
      setNotice("Copy was blocked by the browser.");
    }
  };

  return (
    <div className="mx-auto max-w-[800px] px-6 py-12">
      <h1 className="mb-3 text-center font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Birth Card
      </h1>
      <p className="mx-auto mb-8 max-w-[36rem] text-center leading-relaxed text-muted">
        One <Gloss w="numinous" /> archetype for your birthdate: add every
        digit, reduce until it fits the 22 Majors, and meet the card you were
        born under. A mirror, not a verdict.
      </p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto mb-8 flex w-full max-w-[32rem] flex-col gap-4 rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6"
      >
        <label htmlFor="birth-date" className="text-xs uppercase tracking-[0.25em] text-gold">
          Your birthdate
        </label>
        <input
          id="birth-date"
          type="date"
          value={date}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => {
            setDate(e.target.value);
            setNotice("");
          }}
          className="rounded-xl border border-gold/40 bg-abyss px-4 py-3 text-lg text-ink"
          style={{ colorScheme: "dark" }}
        />
        <p className="m-0 text-center text-sm italic text-muted">
          Stays in this page — nothing is stored or sent anywhere.
        </p>
      </form>

      {date && !valid && (
        <p className="text-center text-goldbright">
          That date doesn&apos;t parse. Pick it from the calendar above.
        </p>
      )}

      {valid && (
        <section aria-live="polite" aria-label="Your birth card" className="flex flex-col items-center gap-5 text-center">
          <TarotCard card={card} startFlipped={true} size="lg" interactive={false} />
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-gold">
              {result.steps.join(" → ")}
            </p>
            <h2 className="mb-2 font-display text-3xl text-parchment">{card.name}</h2>
            <p className="mx-auto mb-4 max-w-[34rem] font-display text-xl italic leading-relaxed text-goldbright">
              {card.essence}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/cards/${card.id}`}
                className="font-semibold text-moon hover:text-goldbright"
              >
                Read the full meaning →
              </Link>
              <button
                type="button"
                onClick={copyLink}
                className="cursor-pointer rounded-full border border-gold/55 px-5 py-1.5 text-sm font-semibold text-parchment transition hover:border-goldbright hover:text-goldbright"
              >
                Copy link to this result
              </button>
            </div>
            {notice && <p className="mt-2 text-sm text-goldbright">{notice}</p>}
          </div>
        </section>
      )}
    </div>
  );
}
