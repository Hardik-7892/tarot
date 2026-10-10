import BirthCardCalc from "./calc";

export const metadata = {
  title: "Birth Card Calculator · Tarot",
  description:
    "Add your birthdate digits, reduce to a Major Arcana card, and meet the archetype you were born under.",
};

export default function BirthCardPage() {
  return <BirthCardCalc />;
}
