"use client";

import { useEffect, useRef } from "react";
import { A, drawWorker } from "../lib/workers";
import { buildBg, buildBeam, drawCounter, PATHS, posOn, depth } from "../lib/scene";
import { tri } from "../lib/workers";

export type CafeMode = "idle" | "focus" | "break";

type Props = {
  crew: (number | null)[]; // 3 slots, worker index or null
  mode: CafeMode;
  running: boolean;
  panicUntil: number; // performance.now() timestamp, 0 = calm
};

export default function CafeCanvas({ crew, mode, running, panicUntil }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The animation loop reads the latest props from this ref so it never restarts.
  const live = useRef({ crew, mode, running, panicUntil });
  live.current = { crew, mode, running, panicUntil };

  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const bg = buildBg();
    const beam = buildBeam();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const walkers = [
      { d: 0, ph: 0, m: 1, dir: 1 },
      { d: 120, ph: 2, m: 1, dir: 1 },
      { d: 300, ph: 4, m: 1, dir: 1 },
    ];
    const dust = Array.from({ length: 16 }, () => ({
      x: 420 + Math.random() * 560,
      y: 330 + Math.random() * 340,
      v: 4 + Math.random() * 8,
      r: 1.5 + Math.random() * 2,
    }));

    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { crew, mode, running, panicUntil } = live.current;
      const sc = Math.max(W / 1280, H / 720);
      const ox = (W - 1280 * sc) / 2;
      const oy = (H - 720 * sc) / 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(bg, 0, 0, 1280, 720);

      const pan = now < panicUntil;
      const items: { y: number; f: () => void }[] = [];
      crew.forEach((w, slot) => {
        if (w === null) return;
        const wk = walkers[slot];
        const moving = !reduce && (mode !== "focus" || running);
        const tgt = pan ? 3.2 : mode === "break" ? 0.7 : 1;
        wk.m += (tgt - wk.m) * Math.min(1, dt * 6);
        if (moving) {
          wk.d += dt * 34 * wk.m;
          wk.ph += dt * Math.min(24, 7 * wk.m);
        }
        const p1 = posOn(PATHS[slot], wk.d);
        const p2 = posOn(PATHS[slot], wk.d + 2);
        const dx = p2[0] - p1[0];
        if (Math.abs(dx) > 0.3) wk.dir = dx > 0 ? 1 : -1;
        const shake = pan ? Math.sin(now / 45 + slot * 2) * 2.5 : 0;
        const x = p1[0] + shake;
        const y = p1[1];
        const s = depth(y);
        const blink = ((now / 1000 + slot * 1.3) % 4) < 0.12;
        items.push({
          y,
          f: () => {
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(wk.dir * s, s);
            drawWorker(ctx, A[w], wk.ph, moving, pan, blink);
            ctx.restore();
            if (pan) {
              ctx.save();
              ctx.translate(x, y - 148 * s);
              ctx.scale(s, s);
              const bump = Math.sin(now / 90 + slot) * 2;
              ctx.fillStyle = "#fff";
              ctx.beginPath();
              ctx.arc(0, bump, 14, 0, 7);
              ctx.fill();
              tri(ctx, -4, bump + 12, 4, bump + 12, 0, bump + 20, "#fff");
              ctx.fillStyle = "#d1432b";
              ctx.font = "800 20px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText("!", 0, bump + 1);
              ctx.restore();
              ctx.save();
              ctx.translate(x + 34 * s * wk.dir, y - 110 * s + ((now / 6) % 40));
              ctx.scale(s, s);
              ctx.globalAlpha = 0.85;
              ctx.fillStyle = "#7cc4ea";
              ctx.beginPath();
              ctx.moveTo(0, -7);
              ctx.quadraticCurveTo(7, 2, 0, 7);
              ctx.quadraticCurveTo(-7, 2, 0, -7);
              ctx.fill();
              ctx.restore();
            }
          },
        });
      });
      items.push({ y: 505, f: () => drawCounter(ctx) });
      items.sort((a, b) => a.y - b.y);
      items.forEach((o) => o.f());
      ctx.drawImage(beam, 0, 0, 1280, 720);
      dust.forEach((d) => {
        if (!reduce) {
          d.y -= dt * d.v;
          d.x += Math.sin(now / 1400 + d.r) * dt * 6;
          if (d.y < 310) d.y = 690;
        }
        ctx.fillStyle = "rgba(255,248,224,.55)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 7);
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
