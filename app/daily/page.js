import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";
import { getSpread } from "../../lib/spreads";

export const metadata = {
  title: "Daily Draw · Tarot",
  description: "Pick one blind card from the shuffled fan and reveal its meaning.",
};

export default function DailyPage() {
  const spread = getSpread("daily");
  return (
    <div className="mx-auto max-w-[960px] px-6 py-12 text-center">
      <h1 className="mb-3 font-display text-[clamp(2.2rem,5vw,3.2rem)] text-parchment">
        Daily Draw
      </h1>
      <p className="mx-auto mb-10 max-w-[38rem] leading-relaxed text-muted">
        Every visit shuffles anew from the <Gloss w="aleatory" /> deep. Choose
        one card lying facedown. Then turn it over for its upright or reversed counsel.
      </p>
      <DeckFan
        pickCount={spread.pickCount}
        spreadId={spread.id}
        title={spread.title}
        intentPrompt={spread.intentPrompt}
      />
    </div>
  );
}
