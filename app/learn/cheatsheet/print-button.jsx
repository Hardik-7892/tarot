"use client";

/** M7: triggers the browser print dialog for the cheat-sheet. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="cursor-pointer rounded-full border border-goldbright bg-linear-to-b from-goldbright to-gold px-7 py-2.5 font-display text-lg font-bold text-[#14100a] transition hover:-translate-y-0.5 print:hidden"
    >
      Print cheat-sheet
    </button>
  );
}
