import JournalView from "./view";

export const metadata = {
  title: "Reading Journal · Tarot",
  description:
    "Your saved tarot readings, stored only in this browser. Filter, export, or clear your history.",
};

export default function JournalPage() {
  return <JournalView />;
}
