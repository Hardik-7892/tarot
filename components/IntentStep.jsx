"use client";

import { useState } from "react";

/**
 * M1: Intent-first ritual gate.
 * Pause copy + optional name/question. Empty allowed.
 * Calls onBegin({ name, question }) with trimmed strings.
 */
export default function IntentStep({
  prompt = "Pause. Hold one question lightly in mind. Breathe once, then shuffle when ready.",
  confirmLabel = "Shuffle the Deck",
  initialName = "",
  initialQuestion = "",
  onBegin,
}) {
  const [name, setName] = useState(initialName);
  const [question, setQuestion] = useState(initialQuestion);

  const submit = (e) => {
    e?.preventDefault();
    onBegin?.({ name: name.trim(), question: question.trim() });
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-[32rem] flex-col gap-4 rounded-[14px] border border-gold/25 bg-linear-to-b from-abyss2 to-abyss p-6 text-left"
    >
      <p className="m-0 text-center font-display text-xl italic leading-relaxed text-parchment">
        {prompt}
      </p>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="intent-name"
          className="text-xs uppercase tracking-[0.25em] text-gold"
        >
          Name <span className="text-muted">(optional)</span>
        </label>
        <input
          id="intent-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={60}
          placeholder="e.g. Robin — helps on shared devices"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-gold/40 bg-abyss px-4 py-2.5 text-ink placeholder:text-muted"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="intent-question"
          className="text-xs uppercase tracking-[0.25em] text-gold"
        >
          Question <span className="text-muted">(optional)</span>
        </label>
        <textarea
          id="intent-question"
          name="question"
          rows={3}
          maxLength={500}
          placeholder="What should I understand about…?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="resize-y rounded-xl border border-gold/40 bg-abyss px-4 py-2.5 leading-relaxed text-ink placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-7 py-3 font-display text-lg font-bold tracking-wide text-[#14100a] shadow-[0_6px_24px_rgba(212,175,55,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)]"
      >
        {confirmLabel}
      </button>
      <p className="m-0 text-center text-sm italic text-muted">
        Both fields are optional. Nothing leaves this device.
      </p>
    </form>
  );
}
