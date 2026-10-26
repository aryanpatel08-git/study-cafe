"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CafeCanvas, { CafeMode } from "./CafeCanvas";
import { A, portrait } from "../lib/workers";
import { SAMPLE_CARDS, SAMPLE_QUIZ, SAMPLE_SUMMARY, Generated } from "../lib/content";
import { parseFile, ParsedFile } from "../lib/parseFile";

type FileItem = { id: number; name: string; size: number; type: string; on: boolean; file?: File };
type QuizResult = { pct: number; right: number; pass: boolean; hired: string | null; pages: string };
type Preset = "p25" | "p50";

const PRESETS: Record<Preset, [number, number]> = { p25: [1500, 300], p50: [3000, 600] };
const STAGES = ["Summary", "Flashcards", "Quiz"];
const RING = 163.4;

const fmt = (s: number) => {
  s = Math.max(0, s);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
};
const sizeOf = (n: number) =>
  n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " KB";

function Portrait({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) portrait(ref.current, idx);
  }, [idx]);
  return <canvas ref={ref} />;
}

export default function StudyApp() {
  /* ----- screens and files ----- */
  const [welcome, setWelcome] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [queue, setQueue] = useState<FileItem[]>([]);
  const [qi, setQi] = useState(0);
  const [si, setSi] = useState(0);
  const [parsed, setParsed] = useState<Record<number, ParsedFile>>({});
  const [parsing, setParsing] = useState(false);
  const [gen, setGen] = useState<Record<string, Generated>>({});
  const [genErr, setGenErr] = useState<Record<string, string>>({});
  const inflight = useRef<Set<string>>(new Set());
  const uid = useRef(0);
  const [dragOver, setDragOver] = useState(false);

  /* ----- timer ----- */
  const [mode, setMode] = useState<CafeMode>("idle");
  const [running, setRunning] = useState(false);
  const [preset, setPreset] = useState<Preset>("p25");
  const [total, setTotal] = useState(PRESETS.p25[0]);
  const [left, setLeft] = useState(PRESETS.p25[0]);
  const [pendingBreak, setPendingBreak] = useState(false);

  /* ----- study ----- */
  const [stageIdx, setStageIdx] = useState(0);
  const [maxStage, setMaxStage] = useState(0);
  const [fc, setFc] = useState({ i: 0, shown: false, known: 0, done: false });
  const [qz, setQz] = useState<{
    target: number; running: boolean; i: number; right: number; picked: number; wrong: number[]; result: QuizResult | null;
  }>({ target: 80, running: false, i: 0, right: 0, picked: -1, wrong: [], result: null });

  /* ----- crew ----- */
  const [crew, setCrew] = useState<(number | null)[]>([0, 2, 1]);
  const [unlocked, setUnlocked] = useState(5);
  const [pending, setPending] = useState(-1);
  const [panicUntil, setPanicUntil] = useState(0);

  /* ----- toast ----- */
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const say = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }, []);
  const panic = useCallback(() => {
    setPanicUntil(performance.now() + 4500);
    say("Oh no! The crew is panicking.");
  }, [say]);

  const locked = mode === "focus";
  const crewCount = crew.filter((x) => x !== null).length;

  /* body classes drive the CSS (welcome / focus / break) */
  useEffect(() => {
    const b = document.body.classList;
    b.toggle("welcome", welcome);
    b.toggle("focus", mode === "focus");
    b.toggle("break", mode === "break");
  }, [welcome, mode]);

  /* ----- the clock: one tick per second, re-armed after every change ----- */
  const startBreak = useCallback(() => {
    const t = PRESETS[preset][1];
    setMode("break");
    setTotal(t);
    setLeft(t);
    setPendingBreak(false);
    setRunning(true);
    setPending(-1);
    window.scrollTo(0, 0);
  }, [preset]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (mode === "focus" && running && !pendingBreak) {
        if (left - 1 <= 0) {
          if (qz.running) {
            setPendingBreak(true);
            setLeft(0);
          } else startBreak();
        } else setLeft(left - 1);
      } else if (mode === "break") {
        if (left - 1 <= 0) {
          setMode("idle");
          setRunning(false);
          setTotal(PRESETS[preset][0]);
          setLeft(PRESETS[preset][0]);
          say("The cafe is open again. Set your crew, then start focus.");
        } else setLeft(left - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [mode, running, left, pendingBreak, qz.running, preset, startBreak, say]);

  const choosePreset = (p: Preset) => {
    if (mode !== "idle") return;
    setPreset(p);
    setTotal(PRESETS[p][0]);
    setLeft(PRESETS[p][0]);
  };
  const toggleTimer = () => {
    if (mode === "idle") {
      setMode("focus");
      setRunning(true);
      setPending(-1);
    } else if (mode === "focus") setRunning((r) => !r);
  };

  /* ----- files ----- */
  const addFiles = (list: { name: string; size: number }[]) => {
    let bad = 0;
    const add: FileItem[] = [];
    list.forEach((f) => {
      const m = /\.(pdf|pptx)$/i.exec(f.name);
      if (!m) { bad++; return; }
      if (files.some((x) => x.name === f.name && x.size === f.size) || add.some((x) => x.name === f.name && x.size === f.size)) return;
      add.push({ id: ++uid.current, name: f.name, size: f.size, type: m[1].toUpperCase(), on: true, file: f instanceof File ? f : undefined });
    });
    if (add.length) setFiles((fs) => [...fs, ...add]);
    if (bad) say(bad + " file" + (bad > 1 ? "s" : "") + " skipped. Only PDF and PowerPoint (.pptx) work.");
  };
  const move = (i: number, d: number) =>
    setFiles((fs) => {
      const n = [...fs];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });
  const selected = files.filter((f) => f.on);
  const openCafe = async () => {
    if (!selected.length || parsing) return;
    setParsing(true);
    const out: Record<number, ParsedFile> = {};
    for (const f of selected) {
      if (!f.file) continue;
      try {
        out[f.id] = await parseFile(f.file);
      } catch {
        say("Could not read " + f.name + ". It may be scanned or protected.");
      }
    }
    setParsed(out);
    setParsing(false);
    setQueue(selected);
    setQi(0);
    setSi(0);
    setFc({ i: 0, shown: false, known: 0, done: false });
    setStageIdx(0);
    setMaxStage(0);
    setQz((q) => ({ ...q, running: false, result: null }));
    setWelcome(false);
    window.scrollTo(0, 0);
  };

  /* ----- study actions ----- */
  const needFocus = () => {
    if (mode !== "focus") { say("Start focus first."); return true; }
    return false;
  };
  const gotoStage = (i: number) => {
    if (qz.running) return;
    if (i > 0 && needFocus()) return;
    setStageIdx(i);
  };
  const answerCard = (knew: boolean) => {
    if (!knew) panic();
    const known = fc.known + (knew ? 1 : 0);
    if (fc.i === cards.length - 1) setFc({ ...fc, known, shown: false, done: true });
    else setFc({ i: fc.i + 1, shown: false, known, done: false });
  };
  const pickOption = (j: number) => {
    if (qz.picked > -1) return;
    const ok = j === quizQs[qz.i].c;
    if (!ok) panic();
    setQz({ ...qz, picked: j, right: qz.right + (ok ? 1 : 0), wrong: ok ? qz.wrong : [...qz.wrong, quizQs[qz.i].p] });
  };
  const nextQuestion = () => {
    if (qz.i < quizQs.length - 1) { setQz({ ...qz, i: qz.i + 1, picked: -1 }); return; }
    const pct = Math.round((qz.right / quizQs.length) * 100);
    const pass = pct >= qz.target;
    let hired: string | null = null;
    if (pass && pct >= 70 && unlocked < A.length) {
      hired = A[unlocked].n;
      setUnlocked(unlocked + 1);
      say("New worker hired: " + hired);
    }
    const pages = pass ? "" : [...new Set(qz.wrong)].sort((a, b) => a - b).join(", ");
    setQz({ ...qz, running: false, result: { pct, right: qz.right, pass, hired, pages } });
    if (pendingBreak) startBreak();
  };
  const afterResult = () => {
    const passed = qz.result?.pass;
    setQz({ ...qz, result: null, running: false });
    if (passed && (hasMoreSections || qi < queue.length - 1)) {
      if (hasMoreSections) setSi(si + 1);
      else { setQi(qi + 1); setSi(0); }
      setFc({ i: 0, shown: false, known: 0, done: false });
      setStageIdx(0);
      setMaxStage(0);
    }
  };

  /* ----- crew actions ----- */
  const lockedNote = () => say("Crew changes happen before or after a break, not while you study.");
  const clickSlot = (s: number) => {
    if (locked) return lockedNote();
    if (pending > -1) {
      setCrew((c) => c.map((x, i) => (i === s ? pending : x)));
      setPending(-1);
    } else if (crewCount > 1) setCrew((c) => c.map((x, i) => (i === s ? null : x)));
    else say("Keep at least one worker on shift.");
  };
  const clickWorker = (i: number) => {
    if (locked) return lockedNote();
    const pos = crew.indexOf(i);
    if (pending === i) setPending(-1);
    else if (pos > -1) {
      if (crewCount > 1) setCrew((c) => c.map((x, k) => (k === pos ? null : x)));
      else say("Keep at least one worker on shift.");
    } else {
      const free = crew.indexOf(null);
      if (free > -1) setCrew((c) => c.map((x, k) => (k === free ? i : x)));
      else setPending(i);
    }
  };

  /* ----- pieces ----- */
  const frac = total ? left / total : 1;
  const ringFrac = Math.max(0, Math.min(1, mode === "break" ? 1 - frac : frac));
  const course = queue[qi];
  const pf = course ? parsed[course.id] : undefined;
  const secCount = pf ? pf.sections.length : 1;
  const sec = pf ? pf.sections[Math.min(si, pf.sections.length - 1)] : undefined;
  const hasMoreSections = !!pf && si < secCount - 1;
  const key = course && sec ? course.id + "-" + Math.min(si, secCount - 1) : "";
  const ready = pf ? gen[key] : undefined;
  const cards = ready?.cards ?? SAMPLE_CARDS;
  const quizQs = ready?.quiz ?? SAMPLE_QUIZ;
  const summary = ready?.summary ?? SAMPLE_SUMMARY;
  const waiting = !!pf && !ready;

  /* ask the AI to write this section's study set the first time we need it */
  useEffect(() => {
    if (welcome || !key || !sec || !pf || !course || gen[key] || genErr[key] || inflight.current.has(key)) return;
    inflight.current.add(key);
    const k = key;
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: course.name, unit: pf.unit, start: sec.start, end: sec.end, text: sec.text }),
    })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Something went wrong.");
        setGen((g) => ({ ...g, [k]: j }));
      })
      .catch((e) => setGenErr((g) => ({ ...g, [k]: e.message })))
      .finally(() => inflight.current.delete(k));
  }, [welcome, key, sec, pf, course, gen, genErr]);
  const retryGen = () => setGenErr((g) => { const n = { ...g }; delete n[key]; return n; });
  const nextName = hasMoreSections ? "section " + (si + 2) : qi < queue.length - 1 ? queue[qi + 1].name : null;

  const crewHint = locked
    ? "The shift is on. Swap workers at the next break."
    : pending > -1
      ? "Choose which worker " + A[pending].n + " should replace."
      : mode === "break"
        ? "Swap anyone you like before the cafe reopens."
        : "Set your crew before you start focusing. Max 3 on shift.";

  const crewPicker = (
    <aside className={"crew" + (locked ? " locked-ui" : "")} aria-label="Your crew">
      <h2>Your crew</h2>
      <p className="hint">{crewHint}</p>
      <div className="crewbody">
        <div className="shift">
          {crew.map((w, s) =>
            w === null ? (
              <div key={s} className="slot empty">Empty<small>Pick a worker</small></div>
            ) : (
              <button key={s} className={"slot" + (pending > -1 && !locked ? " target" : "")} aria-disabled={locked} onClick={() => clickSlot(s)}>
                <Portrait idx={w} />
                {A[w].n}
                <small>{locked ? "Working" : pending > -1 ? "Replace" : "On shift"}</small>
              </button>
            ),
          )}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Hired {unlocked} of {A.length} · on shift {crewCount} of 3
          </div>
          <div className="roster">
            {A.map((a, i) => {
              const lock = i >= unlocked;
              const on = crew.includes(i);
              return (
                <button
                  key={i}
                  className={"w" + (lock ? " locked" : "") + (on ? " on" : "") + (pending === i ? " pending" : "")}
                  disabled={lock}
                  aria-disabled={locked}
                  aria-label={lock ? "Locked worker" : a.n + (on ? ", on shift" : "")}
                  onClick={() => clickWorker(i)}
                >
                  <Portrait idx={i} />
                  {lock ? "Locked" : a.n}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );

  /* ----- stage bodies ----- */
  let stage: React.ReactNode;
  if (waiting) {
    stage = genErr[key] ? (
      <>
        <h3>The crew hit a snag</h3>
        <div className="msg review">{genErr[key]}</div>
        <div className="row"><button className="btn primary" onClick={retryGen}>Try again</button></div>
      </>
    ) : (
      <>
        <h3>Writing your study set</h3>
        <p>The crew is reading {pf!.unit} {sec!.start} to {sec!.end} and writing a summary, flashcards and a quiz. This takes about 20 seconds.</p>
        <div className="prog"><i style={{ width: "60%" }} /></div>
      </>
    );
  } else if (stageIdx === 0) {
    stage = (
      <>
        <h3>Summary</h3>
        <p>{summary.intro}</p>
        <ul className="terms">
          {summary.terms.map((t) => (
            <li key={t.t}><b>{t.t}</b>: {t.d} <span className="src">{t.p}</span></li>
          ))}
        </ul>
        <p className="src">{cards.length} flashcards and {quizQs.length} quiz questions are ready for this section.</p>
        {mode === "focus" ? (
          <div className="row">
            <button className="btn primary" onClick={() => { setStageIdx(1); setMaxStage((m) => Math.max(m, 1)); }}>I have read it</button>
          </div>
        ) : (
          <div className="msg review">Start focus first. Flashcards open once the timer is running.</div>
        )}
      </>
    );
  } else if (stageIdx === 1) {
    if (fc.done) {
      const pct = Math.round((fc.known / cards.length) * 100);
      const ok = pct >= 80;
      stage = (
        <>
          <h3>Flashcards done</h3>
          <p>You knew {fc.known} of {cards.length} ({pct}%).</p>
          <div className={"msg " + (ok ? "ok" : "review")}>
            {ok ? "That clears the 80% minimum. The quiz is open." : "You need 80% to move on. Missed cards come back first."}
          </div>
          <div className="row">
            {ok ? (
              <button className="btn primary" onClick={() => { setStageIdx(2); setMaxStage(2); setQz((q) => ({ ...q, result: null })); }}>Go to the quiz</button>
            ) : (
              <button className="btn primary" onClick={() => setFc({ i: 0, shown: false, known: 0, done: false })}>Replay cards</button>
            )}
          </div>
        </>
      );
    } else {
      const c = cards[fc.i];
      stage = (
        <>
          <div className="eyebrow">Card {fc.i + 1} of {cards.length}</div>
          <div className="q">{c.q}</div>
          {fc.shown && <div className="answer">{c.a} <span className="src">p. {c.p}</span></div>}
          <div className="row">
            {fc.shown ? (
              <>
                <button className="btn" onClick={() => answerCard(false)}>Missed it</button>
                <button className="btn primary" onClick={() => answerCard(true)}>Got it</button>
              </>
            ) : (
              <button className="btn primary" onClick={() => setFc({ ...fc, shown: true })}>Show answer</button>
            )}
          </div>
          <div className="count">Known so far: {fc.known} of {cards.length}. You need 80% to unlock the next step.</div>
        </>
      );
    }
  } else if (!qz.running && !qz.result) {
    stage = (
      <>
        <h3>Section quiz</h3>
        <p>The AI writes these questions from your course pages. Pick the score you are aiming for. You pass at or above it.</p>
        <div className="targets" role="group" aria-label="Target score">
          {[60, 70, 80, 90, 100].map((t) => (
            <button key={t} className="btn" aria-pressed={qz.target === t} style={qz.target === t ? { background: "var(--ink)", color: "var(--cream)" } : undefined} onClick={() => setQz({ ...qz, target: t })}>{t}%</button>
          ))}
        </div>
        <div className="row">
          <button className="btn primary" onClick={() => setQz({ ...qz, running: true, i: 0, right: 0, picked: -1, wrong: [], result: null })}>Start quiz</button>
        </div>
        <p className="src">{quizQs.length} questions, scored by the app. Missed ones tell you which pages to review. A new worker is hired for any pass at 70% or higher. A wrong answer sends the crew into a panic.</p>
      </>
    );
  } else if (qz.running) {
    const k = quizQs[qz.i];
    stage = (
      <>
        <div className="eyebrow">Question {qz.i + 1} of {quizQs.length} · target {qz.target}%</div>
        <div className="q">{k.q}</div>
        <div className="opts">
          {k.o.map((o, j) => {
            let cl = "opt";
            if (qz.picked > -1) { if (j === k.c) cl += " right"; else if (j === qz.picked) cl += " wrong"; }
            return (
              <button key={j} className={cl} disabled={qz.picked > -1} onClick={() => pickOption(j)}>
                {o}
                {qz.picked > -1 && j === k.c ? " (correct)" : ""}
                {qz.picked > -1 && j === qz.picked && j !== k.c ? " (your answer)" : ""}
              </button>
            );
          })}
        </div>
        {qz.picked > -1 && (
          <div className="row">
            <button className="btn primary" onClick={nextQuestion}>{qz.i === quizQs.length - 1 ? "See result" : "Next question"}</button>
          </div>
        )}
        <div className="src">Source: page {k.p}</div>
      </>
    );
  } else {
    const r = qz.result!;
    stage = (
      <>
        <h3>Quiz result</h3>
        <p className="q">{r.pct}% ({r.right} of {quizQs.length})</p>
        <div className={"msg " + (r.pass ? "ok" : "review")}>
          {r.pass
            ? "You hit your " + qz.target + "% target. " + (nextName ? "Up next: " + nextName : "That was the last file in your plan.")
            : "Not at " + qz.target + "% yet. Review pages " + r.pages + " and try again with new questions."}
        </div>
        {r.hired && <div className="msg ok">New worker hired: {r.hired}. You can put them on shift at the next break.</div>}
        <div className="row">
          <button className="btn primary" onClick={afterResult}>
            {r.pass ? (nextName ? "Next" : "Back to the start") : "Try again"}
          </button>
        </div>
      </>
    );
  }

  const label = pendingBreak
    ? "Break starts after this quiz"
    : mode === "focus" ? (running ? "Focus" : "Paused") : mode === "break" ? "Lunch break" : "Ready to focus";

  return (
    <>
      <div className="scene" aria-hidden="true">
        <CafeCanvas crew={crew} mode={mode} running={running} panicUntil={panicUntil} />
      </div>

      <header className="top">
        <div className="brand">Study Cafe</div>
        <span className={"tag" + (mode === "break" ? " closed" : "")}>{mode === "break" ? "Closed" : "Open"}</span>
      </header>

      {/* Welcome: import, choose, order */}
      <section className="panel" id="welcome" aria-label="Choose what to study">
        <div>
          <div className="eyebrow">Welcome</div>
          <h2 style={{ fontSize: 24, marginTop: 6 }}>What are we studying today?</h2>
          <p className="hint" style={{ fontSize: 14 }}>
            Add your course files, tick the ones you want, and set the order you want to study them in. Each file gets its own summary, flashcards and quiz.
          </p>
          <div
            className={"drop" + (dragOver ? " over" : "")}
            onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(Array.from(e.dataTransfer.files)); }}
          >
            <b>Drop PDF or PowerPoint files here</b>
            <span className="or">or</span>
            <div className="row" style={{ margin: 0, justifyContent: "center" }}>
              <label className="btn primary" htmlFor="fileIn">Choose files</label>
              <button className="btn" onClick={() => addFiles([
                { name: "Biology 201 lecture slides.pdf", size: 3300000 },
                { name: "Chapter 4 reading.pdf", size: 1800000 },
                { name: "Week 5 slides.pptx", size: 5200000 },
              ])}>Add a sample course</button>
            </div>
            <input id="fileIn" type="file" accept=".pdf,.pptx" multiple hidden onChange={(e) => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
          </div>
          <p className="src" style={{ marginTop: 12 }}>Files are read in your browser and split into sections on your device.</p>
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="eyebrow">{files.length ? "Study order · " + selected.length + " of " + files.length + " selected" : "Your study plan"}</div>
          <ol className="files">
            {files.length === 0 && <li className="emptyf">No files yet. Add some on the left to build your study plan.</li>}
            {files.map((f, i) => (
              <li key={f.id} className={"f" + (f.on ? "" : " off")}>
                <input type="checkbox" checked={f.on} aria-label={"Study " + f.name} onChange={(e) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, on: e.target.checked } : x)))} />
                <span className="num">{f.on ? files.slice(0, i + 1).filter((x) => x.on).length : "-"}</span>
                <div className="fn"><b>{f.name}</b><small>{f.type} · {sizeOf(f.size)}</small></div>
                <button className="btn ib" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">Up</button>
                <button className="btn ib" disabled={i === files.length - 1} onClick={() => move(i, 1)} aria-label="Move down">Down</button>
                <button className="btn ib" onClick={() => setFiles((fs) => fs.filter((x) => x.id !== f.id))} aria-label="Remove">Remove</button>
              </li>
            ))}
          </ol>
          <div className="row">
            <button className="btn primary" disabled={!selected.length || parsing} onClick={openCafe}>
              {parsing ? "Reading your files..." : selected.length ? "Open the cafe with " + selected.length + " file" + (selected.length > 1 ? "s" : "") : "Pick at least one file"}
            </button>
          </div>
        </div>
      </section>

      {/* Study panel */}
      <main className="panel" id="panel">
        <section className="study" aria-label="Study session">
          <div className="bar">
            <div className="course">
              <div className="eyebrow">
                {course
                  ? "File " + (qi + 1) + " of " + queue.length +
                    (pf && sec ? " · section " + (si + 1) + " of " + secCount + " · " + pf.unit + " " + sec.start + " to " + sec.end : "") +
                    (nextName ? " · up next: " + nextName : " · last one") +
                    (pf ? "" : " · sample questions")
                  : "File 1 of 1"}
              </div>
              <h2>{course ? course.name.replace(/\.[^.]+$/, "") : "Your course"}</h2>
              {mode === "idle" && (
                <button className="btn" style={{ marginTop: 8, minHeight: 32, fontSize: 12 }} onClick={() => setWelcome(true)}>Change files or order</button>
              )}
            </div>
            <div className="timer">
              <svg className="ring" viewBox="0 0 64 64" aria-hidden="true">
                <circle className="tr" cx="32" cy="32" r="26" />
                <circle className="pr" cx="32" cy="32" r="26" transform="rotate(-90 32 32)" strokeDasharray={RING} strokeDashoffset={RING * (1 - ringFrac)} />
              </svg>
              <div>
                <div className="time" role="timer">{fmt(left)}</div>
                <small>{label}</small>
              </div>
              <div className="seg" role="group" aria-label="Pomodoro length">
                <button className="btn" disabled={mode !== "idle"} aria-pressed={preset === "p25"} onClick={() => choosePreset("p25")}>25 / 5</button>
                <button className="btn" disabled={mode !== "idle"} aria-pressed={preset === "p50"} onClick={() => choosePreset("p50")}>50 / 10</button>
              </div>
              {mode !== "break" && (
                <button className="btn primary" onClick={toggleTimer}>
                  {mode === "idle" ? "Start focus" : running ? "Pause" : "Resume"}
                </button>
              )}
            </div>
          </div>
          <div className="stages" role="group" aria-label="Section steps">
            {STAGES.map((n, i) => (
              <button
                key={n}
                className={"stage" + (i < maxStage ? " done" : "")}
                aria-current={i === stageIdx ? "step" : undefined}
                disabled={i > maxStage}
                onClick={() => gotoStage(i)}
              >
                {i + 1}. {n}{i > maxStage ? " (locked)" : ""}
              </button>
            ))}
          </div>
          <div className="card">{stage}</div>
        </section>
        <div id="crewSlot">{mode !== "break" && crewPicker}</div>
      </main>

      <section className="dock" aria-label="Lunch break">
        <div className="dockhead">
          <div className="big">{fmt(left)}</div>
          <p><b>Lunch break.</b> The cafe is closed while you rest. Stretch, drink some water, and swap your crew before it reopens.</p>
        </div>
        <div className="prog"><i style={{ width: Math.round((1 - left / total) * 100) + "%" }} /></div>
        <div>{mode === "break" && crewPicker}</div>
      </section>

      <div className={"toast" + (toast ? " on" : "")} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
