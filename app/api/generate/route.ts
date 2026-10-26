import { NextResponse } from "next/server";
import { chatJson, LlmError } from "../../lib/llm";

export const maxDuration = 60;

type Body = { title: string; unit: string; start: number; end: number; text: string };

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// Checks the AI's answer and drops anything malformed, so the app never shows broken items.
function clean(raw: any, start: number, end: number) {
  const page = (v: unknown) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? clamp(n, start, end) : start;
  };
  const seen = new Set<string>();
  const cards = (Array.isArray(raw?.cards) ? raw.cards : [])
    .map((c: any) => ({ q: str(c?.q), a: str(c?.a), p: page(c?.p) }))
    .filter((c: any) => c.q && c.a && !seen.has(c.q) && seen.add(c.q));
  const seenQ = new Set<string>();
  const quiz = (Array.isArray(raw?.quiz) ? raw.quiz : [])
    .map((k: any) => {
      const opts: string[] = Array.isArray(k?.o) ? k.o.map(str) : [];
      const c = Number(k?.c);
      if (opts.length !== 4 || opts.some((o) => !o) || !Number.isInteger(c) || c < 0 || c > 3) return null;
      if (new Set(opts).size !== 4) return null;
      const order = shuffle([0, 1, 2, 3]); // so the right answer isn't always in the same place
      return { q: str(k?.q), o: order.map((i) => opts[i]), c: order.indexOf(c), p: page(k?.p) };
    })
    .filter((k: any) => k && k.q && !seenQ.has(k.q) && seenQ.add(k.q));
  const terms = (Array.isArray(raw?.summary?.terms) ? raw.summary.terms : [])
    .map((t: any) => ({ t: str(t?.t), d: str(t?.d), p: str(t?.p) || "p. " + start }))
    .filter((t: any) => t.t && t.d);
  const intro = str(raw?.summary?.intro);
  if (!intro || terms.length < 2 || cards.length < 6 || quiz.length < 6) throw new LlmError("The AI's answer was incomplete.", 502);
  return { summary: { intro, terms }, cards, quiz };
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const text = str(body.text).slice(0, 12000);
  if (text.length < 100) return NextResponse.json({ error: "Not enough text in this section." }, { status: 400 });
  const start = Math.round(Number(body.start)) || 1;
  const end = Math.round(Number(body.end)) || start;

  // Longer sections get more questions: 12 to 20 flashcards, 10 to 20 quiz questions.
  const nCards = clamp(Math.round(text.length / 450), 12, 20);
  const nQuiz = clamp(Math.round(text.length / 550), 10, 20);

  const system =
    "You write study sets from lecture notes. Use ONLY the text provided. Never add outside facts. " +
    "Return a single JSON object and nothing else.";
  const user = `Lecture: ${str(body.title)}
Text below covers ${str(body.unit)} ${start} to ${end}. Each ${str(body.unit) === "slides" ? "slide" : "page"} starts with a marker like [Page 12].

Write:
- "summary": {"intro": 2 to 3 plain sentences, "terms": 4 to 8 items {"t": key term, "d": short definition, "p": "p. 12"}}
- "cards": EXACTLY ${nCards} flashcards {"q": question, "a": short answer, "p": marker number}
- "quiz": EXACTLY ${nQuiz} multiple choice questions {"q": question, "o": [4 options], "c": index 0-3 of the correct option, "p": marker number}

Rules:
- Spread questions across the WHOLE text so every important idea is covered, not just the start.
- Flashcards test recall of key terms, definitions, facts and steps. Quiz questions test understanding, comparisons and application, and must be different from the flashcards.
- Wrong options must be plausible but clearly wrong according to the text. All four options must be different.
- No questions about the lecture itself (such as "what slide is this"). No "all of the above".
- "p" must be a number that appears in a marker above.

TEXT:
${text}`;

  try {
    let last: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await chatJson(system, user, 4500);
        return NextResponse.json(clean(raw, start, end));
      } catch (e) {
        last = e;
        if (e instanceof LlmError && e.status !== 502) throw e; // don't retry key or rate-limit errors
      }
    }
    throw last;
  } catch (e) {
    const err = e instanceof LlmError ? e : new LlmError("Something went wrong writing your study set.", 502);
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
}
