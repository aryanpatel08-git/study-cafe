# Study Cafe

Turn your course PDFs and slide decks into a cozy study session. Upload your lecture files, and a crew of animal baristas keeps the cafe running while you work through AI-written summaries, flashcards and quizzes, one section at a time.

**Live demo:** https://study-cafe-gamma.vercel.app

![Study Cafe](docs/cafe.png)

## What it does

- **Import your own files.** Drop in PDFs and PowerPoint (.pptx) files, tick the ones you want, and put them in the order you want to study them.
- **Splits big files into sections.** Each file is read in your browser and cut into sections of about 2,000 tokens, with page or slide markers kept so every question can point back to its source.
- **AI-written study sets.** For each section, the AI writes a summary, 12 to 20 flashcards and 10 to 20 multiple-choice questions. Longer sections get more questions, and they are spread across the whole text.
- **A pomodoro that is part of the game.** Choose 25/5 or 50/10. Focus time runs inside a cozy hand-drawn cafe. When the timer ends, the cafe closes for a mandatory lunch break and the study window fades away.
- **A crew that reacts to you.** Pass a quiz at 70% or higher to hire a new worker (15 in total, 3 on shift at a time). Crew changes are only allowed before or after a break. Get an answer wrong and the crew panics and runs around faster.
- **Mastery gates.** You need 80% on the flashcards to unlock the quiz, and you choose your own target score for the quiz.
- **Remembers your progress.** Hired workers, your crew and every generated study set are saved in your browser, so coming back never re-spends AI calls.

## Screenshots

| Welcome | Studying | Lunch break |
| --- | --- | --- |
| ![Welcome screen](docs/welcome.png) | ![Study session](docs/study.png) | ![Lunch break](docs/break.png) |

## How it works

```
PDF / PPTX  ->  parsed in the browser (unpdf, jszip)
            ->  split into sections with [Page N] markers
            ->  one section sent to /api/generate
            ->  Groq (Qwen) returns JSON: summary, flashcards, quiz
            ->  the server validates every item, shuffles answer positions
            ->  the app scores everything itself
```

A few decisions worth explaining:

- **Bring your own key.** The AI runs on each visitor's own free Groq key, stored only in their browser, so one person can never use up everyone's quota. The server just forwards the key to Groq and never stores or logs it.
- **The AI never grades anything.** Multiple-choice scoring and mastery gates are plain code, so results are predictable and don't burn tokens.
- **Validated output.** The API route checks the shape of every flashcard and question, drops anything malformed, removes duplicates, and retries once if the model returns broken JSON.
- **Built for free-tier limits.** Study sets are generated one section at a time, the next section is prepared in the background, and results are cached locally.
- **Hand-drawn scene.** The cafe, the 15 animal workers and their walking paths are drawn with the Canvas API. There are no image assets.

## Tech

Next.js (App Router), TypeScript, React, Canvas 2D, Groq API (OpenAI-compatible), unpdf, JSZip. Deployed on Vercel.

## Run it locally

```bash
git clone https://github.com/aryanpatel08-git/study-cafe.git
cd study-cafe
npm install
```

For local development you can put a key in `.env.local` so you don't have to paste it into the page:

```
GROQ_API_KEY=your_key_here
```

```bash
npm run dev
```

Then open http://localhost:3000. In production the server key is ignored and every visitor uses their own.

You can get a free Groq key at https://console.groq.com/keys.

## Known limits

- Scanned PDFs (pictures of pages with no text) can't be read yet.
- Uploaded files aren't saved between visits, but generated study sets are. Re-adding the same file reuses them.
- The free Groq plan has tight per-minute limits, so a "busy" message sometimes appears. Trying again after a few seconds works.

## Ideas for next

- OCR for scanned PDFs
- Spaced repetition for missed flashcards
- Study modes: step by step or all sections together
- More workers and cafe themes
