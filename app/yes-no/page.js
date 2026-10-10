import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";
import { getSpread } from "../../lib/spreads";

export const metadata = {
  title: "Yes / No Oracle · Tarot",
  description: "Pose a question of yes or no, shuffle, choose one blind card, and receive its omen.",
};

export default function YesNoPage() {
  const spread = getSpread("yes-no");
  return (
    <div className="mx-auto max-w-[960px] px-6 py-12 text-center">
      <h1 className="mb-3 font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        The Yes / No Oracle
      </h1>
      <p className="mx-auto mb-10 max-w-[38rem] leading-relaxed text-muted">
        Frame a question that thirsts for yes or no, then release it.
        Shuffle the deck, choose one card blind, and receive its{" "}
        <Gloss w="augury" />. Ask but once: to redraw until pleased is to
        unmake the <Gloss w="sortilege" />.
      </p>
      <DeckFan
        pickCount={spread.pickCount}
        spreadId={spread.id}
        title={spread.title}
        verdict={spread.verdict}
        intentPrompt={spread.intentPrompt}
      />
    </div>
  );
}
