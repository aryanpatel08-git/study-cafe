// Types for study sets, plus a longer sample set for the demo files.
export type Card = { q: string; a: string; p: number };
export type Question = { q: string; o: string[]; c: number; p: number };
export type Summary = { intro: string; terms: { t: string; d: string; p: string }[] };
export type Generated = { summary: Summary; cards: Card[]; quiz: Question[] };

export const SAMPLE_CARDS: Card[] = [
  { q: "What is the net ATP gain from glycolysis per glucose molecule?", a: "2 ATP (4 are made, 2 are used up).", p: 24 },
  { q: "Where in the cell does glycolysis take place?", a: "In the cytoplasm.", p: 23 },
  { q: "What are the end products of glycolysis?", a: "Two pyruvate, 2 net ATP and 2 NADH.", p: 24 },
  { q: "Does glycolysis require oxygen?", a: "No. It is anaerobic, so it works with or without oxygen.", p: 23 },
  { q: "What happens to pyruvate before it enters the Krebs cycle?", a: "It is converted into acetyl-CoA, releasing CO2 and making NADH.", p: 26 },
  { q: "Which molecule enters the Krebs cycle?", a: "Acetyl-CoA.", p: 27 },
  { q: "Where does the Krebs cycle occur?", a: "In the mitochondrial matrix.", p: 27 },
  { q: "What does one turn of the Krebs cycle produce?", a: "3 NADH, 1 FADH2, 1 ATP and 2 CO2.", p: 28 },
  { q: "Why does the Krebs cycle turn twice per glucose?", a: "One glucose makes two pyruvate, so two acetyl-CoA enter the cycle.", p: 28 },
  { q: "Where is the electron transport chain located?", a: "In the inner mitochondrial membrane.", p: 29 },
  { q: "Which molecule is the final electron acceptor in the electron transport chain?", a: "Oxygen.", p: 30 },
  { q: "What forms when oxygen accepts the electrons?", a: "Water.", p: 30 },
  { q: "What drives ATP synthase?", a: "The flow of protons (H+) down their gradient back into the matrix.", p: 31 },
  { q: "About how much ATP does one glucose yield in total?", a: "Roughly 30 to 32 ATP.", p: 33 },
  { q: "What does the cell do when oxygen is missing?", a: "It switches to fermentation so glycolysis can keep running.", p: 34 },
];

export const SAMPLE_QUIZ: Question[] = [
  { q: "Where does the Krebs cycle occur?", o: ["Cytoplasm", "Mitochondrial matrix", "Nucleus", "Cell membrane"], c: 1, p: 27 },
  { q: "Which stage produces the most ATP?", o: ["Glycolysis", "Krebs cycle", "Oxidative phosphorylation", "Fermentation"], c: 2, p: 31 },
  { q: "What is the end product of glycolysis?", o: ["Pyruvate", "Glucose", "Lactose", "Oxygen"], c: 0, p: 24 },
  { q: "Which molecule carries electrons to the transport chain?", o: ["ATP", "NADH", "DNA", "Pyruvate"], c: 1, p: 29 },
  { q: "What is the net ATP gain from glycolysis?", o: ["1", "2", "4", "36"], c: 1, p: 24 },
  { q: "Which molecule is the final electron acceptor?", o: ["Carbon dioxide", "Glucose", "Oxygen", "NAD+"], c: 2, p: 30 },
  { q: "What does pyruvate become before the Krebs cycle?", o: ["Lactate", "Acetyl-CoA", "Glucose", "Citrate"], c: 1, p: 26 },
  { q: "Where is the electron transport chain found?", o: ["Cytoplasm", "Mitochondrial matrix", "Inner mitochondrial membrane", "Cell wall"], c: 2, p: 29 },
  { q: "What powers ATP synthase?", o: ["A proton gradient", "Sunlight", "Heat", "Glucose directly"], c: 0, p: 31 },
  { q: "What happens to glycolysis when oxygen is missing?", o: ["It stops forever", "Fermentation lets it continue", "It moves to the nucleus", "It makes more ATP"], c: 1, p: 34 },
  { q: "How many CO2 are released per turn of the Krebs cycle?", o: ["0", "1", "2", "6"], c: 2, p: 28 },
  { q: "About how much ATP does one glucose yield overall?", o: ["2", "8", "30 to 32", "100"], c: 2, p: 33 },
];

export const SAMPLE_SUMMARY: Summary = {
  intro:
    "Cells turn glucose into ATP in three linked stages. Glycolysis splits glucose in the cytoplasm, the Krebs cycle runs in the mitochondrial matrix, and the electron transport chain makes most of the ATP.",
  terms: [
    { t: "Glycolysis", d: "glucose becomes pyruvate, net gain of 2 ATP.", p: "p. 23 to 24" },
    { t: "Krebs cycle", d: "acetyl-CoA is broken down and electron carriers are loaded.", p: "p. 27" },
    { t: "Electron transport chain", d: "oxygen accepts the electrons and water forms.", p: "p. 30" },
    { t: "Fermentation", d: "backup route that keeps glycolysis going without oxygen.", p: "p. 34" },
  ],
};
