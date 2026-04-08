import React, { useEffect, useRef, useState } from "react";

const copy = {
  es: {
    eyebrow: "Evaluación de Rendimiento",
    title: "Mythos",
    subtitle: "El salto exponencial",
    description:
      "Comparativa de rendimiento entre Opus 4.6 y el nuevo Mythos, evaluado sobre los benchmarks más exigentes (SW Bench, GPQA, Humanity Last Exam).",
    currentLabel: "Nuevo umbral",
    currentValue: "Capacidad Agéntica",
    categories: ["Razonamiento Extremo", "Código (Agente)", "Ciberseguridad", "Sistemas", "Matemáticas", "Conocimiento General"],
    legendPrev: "Opus 4.6",
    legendMythos: "Mythos",
    score: "Puntuación",
    avgPrev: "Media Opus 4.6",
    avgMythos: "Mythos",
    improvement: "Mejora",
  },
  en: {
    eyebrow: "Performance Evaluation",
    title: "Mythos",
    subtitle: "The exponential leap",
    description:
      "Performance comparison between Opus 4.6 and the new Mythos, evaluated across the most demanding benchmarks (SW Bench, GPQA, Humanity Last Exam).",
    currentLabel: "New threshold",
    currentValue: "Agentic Capacity",
    categories: ["Extreme Reasoning", "Code (Agentic)", "Cybersecurity", "Systems", "Math", "General Knowledge"],
    legendPrev: "Opus 4.6",
    legendMythos: "Mythos",
    score: "Score",
    avgPrev: "Opus 4.6 avg",
    avgMythos: "Mythos",
    improvement: "Improvement",
  },
} as const;

type Props = {
  lang?: keyof typeof copy;
};

// Datos ajustados basados en el salto generacional masivo comentado en el video.
// Mythos satura código (94%) y da saltos de +20/30 puntos en razonamiento extremo frente a Opus 4.6.
const CATEGORIES = [
  { key: "reasoning", prev: 53, mythos: 77 }, // Ref Humanity Last Exam / SW Bench Pro
  { key: "code",      prev: 65, mythos: 94 }, // Ref SW Bench Verified
  { key: "cyber",     prev: 15, mythos: 84 }, // Ref Firefox Zero-day exploit success (15.2% -> 84%)
  { key: "systems",   prev: 65, mythos: 82 }, // Ref Terminal Bench 2.0 (65.4% -> 82%)
  { key: "math",      prev: 68, mythos: 88 }, 
  { key: "knowledge", prev: 74, mythos: 92 }, 
];

const BAR_H = 38;
const BAR_GAP = 14;
const INNER_GAP = 4;
const LABEL_W = 125; // Ampliado un poco para las nuevas etiquetas
const SCORE_W = 44;
const CHART_H = CATEGORIES.length * (BAR_H * 2 + INNER_GAP + BAR_GAP) - BAR_GAP + 20;

// Radar chart dimensions
const R_SIZE = 260;
const R_CX = R_SIZE / 2;
const R_CY = R_SIZE / 2;
const R_MAX = 100;
const R_LEVELS = 4;
const R_RADIUS = 100;

function polarToCart(angle: number, r: number, cx: number, cy: number) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

function radarPoints(values: number[], r: number, cx: number, cy: number) {
  const n = values.length;
  return values
    .map((v, i) => {
      const angle = (i / n) * Math.PI * 2;
      const rr = (v / R_MAX) * r;
      const p = polarToCart(angle, rr, cx, cy);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

// Animated bar component
function AnimatedBar({
  prev,
  mythos,
  label,
  score,
  animProg,
}: {
  prev: number;
  mythos: number;
  label: string;
  score: string;
  animProg: number; // 0..1
}) {
  const maxW = `calc(100% - ${LABEL_W + SCORE_W}px)`;
  const prevW = `${Math.round(prev * animProg)}%`;
  const mythosW = `${Math.round(mythos * animProg)}%`;

  return (
    <div style={{ marginBottom: BAR_GAP }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: INNER_GAP }}>
        <span
          style={{
            width: LABEL_W,
            fontSize: 11,
            color: "var(--color-text-secondary)",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: BAR_H / 2,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: prevW,
              height: "100%",
              background: "rgba(180,178,169,0.45)",
              borderRadius: 4,
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <span
          style={{
            width: SCORE_W,
            fontSize: 11,
            color: "rgba(180,178,169,0.6)",
            textAlign: "right",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(prev * animProg)}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: LABEL_W, flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            height: BAR_H / 2,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: mythosW,
              height: "100%",
              background: "linear-gradient(90deg, #7f77dd, #afa9ec)",
              borderRadius: 4,
              boxShadow: animProg > 0.1 ? "0 0 12px rgba(127,119,221,0.6)" : "none",
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <span
          style={{
            width: SCORE_W,
            fontSize: 12,
            fontWeight: 500,
            color: "#afa9ec",
            textAlign: "right",
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(mythos * animProg)}
        </span>
      </div>
    </div>
  );
}

function RadarChart({ progress, lang }: { progress: number; lang: "es" | "en" }) {
  const t = copy[lang];
  const n = CATEGORIES.length;
  const prevVals = CATEGORIES.map((c) => c.prev);
  const mythosVals = CATEGORIES.map((c) => Math.round(c.mythos * progress));
  const prevValsAnim = CATEGORIES.map((c) => Math.round(c.prev * progress));

  const gridLines = Array.from({ length: R_LEVELS }, (_, i) => {
    const r = (R_RADIUS * (i + 1)) / R_LEVELS;
    return Array.from({ length: n }, (_, j) => {
      const angle = (j / n) * Math.PI * 2;
      const p = polarToCart(angle, r, R_CX, R_CY);
      return `${p.x},${p.y}`;
    }).join(" ");
  });

  return (
    <svg
      viewBox={`0 0 ${R_SIZE} ${R_SIZE}`}
      width="100%"
      style={{ maxWidth: R_SIZE, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Radar chart comparing Opus 4.6 to Mythos across six benchmark categories"
    >
      {/* Grid polygons */}
      {gridLines.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={1}
        />
      ))}

      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2;
        const outer = polarToCart(angle, R_RADIUS, R_CX, R_CY);
        return (
          <line
            key={i}
            x1={R_CX}
            y1={R_CY}
            x2={outer.x}
            y2={outer.y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}

      {/* Prev area (Opus) */}
      <polygon
        points={radarPoints(prevValsAnim, R_RADIUS, R_CX, R_CY)}
        fill="rgba(180,178,169,0.08)"
        stroke="rgba(180,178,169,0.35)"
        strokeWidth={1.5}
      />

      {/* Mythos area */}
      <polygon
        points={radarPoints(mythosVals, R_RADIUS, R_CX, R_CY)}
        fill="rgba(127,119,221,0.18)"
        stroke="#7f77dd"
        strokeWidth={2}
        style={{ filter: progress > 0.1 ? "drop-shadow(0 0 6px rgba(127,119,221,0.5))" : "none" }}
      />

      {/* Axis labels */}
      {t.categories.map((cat, i) => {
        const angle = (i / n) * Math.PI * 2;
        const p = polarToCart(angle, R_RADIUS + 18, R_CX, R_CY);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="rgba(180,178,169,0.7)"
          >
            {cat}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={R_CX} cy={R_CY} r={3} fill="#7f77dd" />
    </svg>
  );
}

export default function BenchmarkComparisonVisual({ lang = "es" }: Props) {
  const t = copy[lang];
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const DURATION = 1400; // ms

  useEffect(() => {
    const animate = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / DURATION, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const avgPrev = Math.round(
    (CATEGORIES.reduce((s, c) => s + c.prev, 0) / CATEGORIES.length) * progress
  );
  const avgMythos = Math.round(
    (CATEGORIES.reduce((s, c) => s + c.mythos, 0) / CATEGORIES.length) * progress
  );
  const improvement = Math.round(
    ((CATEGORIES.reduce((s, c) => s + (c.mythos - c.prev), 0) / CATEGORIES.length) / 
     (CATEGORIES.reduce((s, c) => s + c.prev, 0) / CATEGORIES.length)) * 100 * progress
  );

  return (
    <section
      className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#02040a] px-6 py-8 sm:px-10"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(127,119,221,0.1),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(175,169,236,0.06),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-purple-400">
              {t.eyebrow}
            </p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t.title}
              <span className="ml-3 text-base font-normal text-slate-400">{t.subtitle}</span>
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              {t.description}
            </p>
          </div>

          {/* Current level badge */}
          <div className="inline-flex flex-shrink-0 items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 py-2 pl-3 pr-5 shadow-[0_0_20px_rgba(127,119,221,0.12)]">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-400" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-purple-200/70">
                {t.currentLabel}
              </p>
              <p className="font-semibold text-purple-100">{t.currentValue}</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: t.avgPrev, value: avgPrev, color: "text-slate-400", border: "border-white/5" },
            { label: t.avgMythos, value: avgMythos, color: "text-purple-300", border: "border-purple-500/20" },
            { label: t.improvement, value: `+${improvement}%`, color: "text-emerald-400", border: "border-emerald-500/20" },
          ].map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border ${s.border} bg-white/[0.02] p-4 text-center backdrop-blur-sm`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {s.label}
              </p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${s.color}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main content: bars + radar */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
          {/* Bar chart */}
          <div>
            {/* Legend */}
            <div className="mb-4 flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-sm"
                  style={{ width: 12, height: 12, background: "rgba(180,178,169,0.45)" }}
                />
                <span className="text-xs text-slate-400">{t.legendPrev}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-sm"
                  style={{
                    width: 12,
                    height: 12,
                    background: "linear-gradient(90deg, #7f77dd, #afa9ec)",
                    boxShadow: "0 0 6px rgba(127,119,221,0.5)",
                  }}
                />
                <span className="text-xs text-purple-300">{t.legendMythos}</span>
              </div>
            </div>

            {CATEGORIES.map((cat, i) => (
              <AnimatedBar
                key={cat.key}
                prev={cat.prev}
                mythos={cat.mythos}
                label={t.categories[i]}
                score={t.score}
                animProg={progress}
              />
            ))}
          </div>

          {/* Radar chart */}
          <div className="flex items-center justify-center lg:w-[280px]">
            <RadarChart progress={progress} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}