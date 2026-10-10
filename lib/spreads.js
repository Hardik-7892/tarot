/**
 * M4: Single source of truth for every ritual on the site.
 * /daily and /yes-no keep their canonical URLs; the five spreads below
 * get pages at /spread/[id]. Journal + share read spreadId/labels from here.
 */
export const SPREADS = [
  {
    id: "daily",
    title: "Daily Draw",
    href: "/daily",
    pickCount: 1,
    labels: [],
    verdict: false,
    intentPrompt:
      "Pause. What should today be about? Hold it lightly, then shuffle when ready.",
    description:
      "One blind pick, every visit. A small mirror for the day ahead.",
  },
  {
    id: "past-present-future",
    title: "Past · Present · Future",
    href: "/spread/past-present-future/",
    pickCount: 3,
    labels: ["Past", "Present", "Future"],
    verdict: false,
    intentPrompt:
      "Hold a question lightly in mind. Three positions: roots, weather, and trajectory.",
    description:
      "Roots, weather, trajectory. Read left to right as one sentence: where it began, where it stands, where it leans.",
  },
  {
    id: "love",
    title: "You · Them · Us",
    href: "/spread/love/",
    pickCount: 3,
    labels: ["You", "Them", "Us"],
    verdict: false,
    intentPrompt:
      "Bring one bond to mind — no names needed. Three cards: you, them, and what you share.",
    description:
      "For bonds of any kind: friendship, family, romance. You, them, and the third thing you make together.",
  },
  {
    id: "career",
    title: "Strength · Challenge · Advice",
    href: "/spread/career/",
    pickCount: 3,
    labels: ["Strength", "Challenge", "Advice"],
    verdict: false,
    intentPrompt:
      "Bring one work question. Three cards: the strength you stand on, the challenge crossing you, and one counsel.",
    description:
      "Work, craft, money, study. Strength you stand on, the challenge crossing you, and one piece of counsel.",
  },
  {
    id: "decision",
    title: "Option A · Option B · Counsel",
    href: "/spread/decision/",
    pickCount: 3,
    labels: ["Option A", "Option B", "Counsel"],
    verdict: false,
    intentPrompt:
      "Frame one decision with two real options. Three cards: path A, path B, and counsel.",
    description:
      "Two paths laid side by side, plus counsel. Read A and B as full stories before weighing the third card.",
  },
  {
    id: "celtic-cross",
    title: "Celtic Cross",
    href: "/spread/celtic-cross/",
    pickCount: 10,
    labels: [
      "Present",
      "Challenge",
      "Past",
      "Future",
      "Goal",
      "Foundation",
      "Self",
      "Surroundings",
      "Hopes & Fears",
      "Outcome",
    ],
    verdict: false,
    intentPrompt:
      "Choose one question that deserves depth. Ten cards — read slowly. This spread rewards patience.",
    description:
      "The classic ten-card mirror: heart, crossing, roots, crown, aim, foundation, self, surroundings, hopes and fears, outcome. Give it a quiet half hour.",
  },
  {
    id: "yes-no",
    title: "Yes / No Oracle",
    href: "/yes-no",
    pickCount: 1,
    labels: [],
    verdict: true,
    intentPrompt:
      "Frame a question that thirsts for yes or no, then release it. Shuffle when ready — ask but once.",
    description:
      "One card, one omen. Ask but once: to redraw until pleased is to unmake the reading.",
  },
];

/** Ids rendered as pages under /spread/[id]. Daily + yes-no keep canonical URLs. */
export const SPREAD_PAGE_IDS = [
  "past-present-future",
  "love",
  "career",
  "decision",
  "celtic-cross",
];

export const getSpread = (id) => SPREADS.find((s) => s.id === id);
