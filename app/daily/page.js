import DeckFan from "../../components/DeckFan";
import Gloss from "../../components/Gloss";
import styles from "./draw.module.css";

export const metadata = {
  title: "Daily Draw · Tarot",
  description: "Pick one blind card from the shuffled fan and reveal its meaning.",
};

export default function DailyPage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Daily Draw</h1>
      <p className={styles.lede}>
        Every visit shuffles anew from the <Gloss w="aleatory" /> deep. Choose
        one card lying facedown. Then turn it over for its upright or reversed counsel.
      </p>
      <DeckFan pickCount={1} title="Daily draw" />
    </div>
  );
}
