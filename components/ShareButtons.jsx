"use client";

import { useState } from "react";
import { encodeReading, formatReadingText } from "../lib/share";

/**
 * M3: Copy link (?r=), copy text, or native share for a completed reading.
 */
const btnGhost =
  "cursor-pointer rounded-full border border-gold/55 px-5 py-1.5 text-sm font-semibold text-parchment transition hover:border-goldbright hover:text-goldbright";

export default function ShareButtons({ picks = [], meta, labels = [], verdict = false, spreadTitle = "Tarot reading" }) {
  const [notice, setNotice] = useState("");
  if (!picks.length) return null;

  const { name = "", question = "", spreadId = "custom" } = meta ?? {};

  const buildLink = () => {
    const code = encodeReading({ spreadId, labels, verdict, name, question, picks });
    if (!code) return null;
    const { origin, pathname } = window.location;
    return `${origin}${pathname}?r=${code}`;
  };

  const copy = async (text, okMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(okMsg);
    } catch {
      setNotice("Copy was blocked by the browser — long-press to copy manually.");
    }
  };

  const copyLink = () => {
    const link = buildLink();
    if (!link) {
      setNotice("Could not build the link for this reading.");
      return;
    }
    copy(link, "Link copied — anyone opening it sees these exact cards.");
  };

  const copyText = () => {
    copy(
      formatReadingText({ spreadTitle, name, question, labels, verdict, picks }),
      "Reading copied as text."
    );
  };

  const nativeShare = async () => {
    const link = buildLink();
    if (!link) {
      setNotice("Could not build the link for this reading.");
      return;
    }
    try {
      await navigator.share({
        title: spreadTitle,
        text: formatReadingText({ spreadTitle, name, question, labels, verdict, picks }),
        url: link,
      });
    } catch {
      // User dismissed the sheet, or share failed: stay silent.
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="mx-auto flex w-full max-w-[32rem] flex-col items-center gap-3 rounded-[14px] border border-moon/20 p-5 text-center">
      <strong className="font-display text-lg text-parchment">Share this reading</strong>
      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={copyLink} className={btnGhost}>
          Copy link
        </button>
        <button type="button" onClick={copyText} className={btnGhost}>
          Copy text
        </button>
        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={btnGhost}>
            Share…
          </button>
        )}
      </div>
      {notice && (
        <p aria-live="polite" className="m-0 text-sm text-goldbright">
          {notice}
        </p>
      )}
    </div>
  );
}
