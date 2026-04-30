import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Archivo Cosmos",
    title: "Colapso, rebote y geometría final",
    description:
      "Una visual sobre la contracción cósmica, la densidad creciente y la intuición de que un universo podría terminar cerrándose sobre sí mismo.",
    badge: "Crunch / Bounce",
    phaseA: "Expansión",
    phaseB: "Punto crítico",
    phaseC: "Contracción",
    statA: "Geometría",
    statAValue: "Cerrada",
    statB: "Destino",
    statBValue: "Compresión térmica",
    statC: "Modelo",
    statCValue: "Cíclico",
  },
  en: {
    eyebrow: "Cosmos archive",
    title: "Collapse, rebound, and final geometry",
    description:
      "A visual about cosmic contraction, rising density, and the intuition that a universe may eventually curve back into itself.",
    badge: "Crunch / Bounce",
    phaseA: "Expansion",
    phaseB: "Critical point",
    phaseC: "Contraction",
    statA: "Geometry",
    statAValue: "Closed",
    statB: "Fate",
    statBValue: "Thermal compression",
    statC: "Model",
    statCValue: "Cyclic",
  },
} as const;

type Lang = "es" | "en";

type Arc = {
  id: number;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
};

function buildArcs(): Arc[] {
  return Array.from({ length: 7 }).map((_, index) => ({
    id: index,
    size: 24 + index * 10,
    delay: `${index * 0.18}s`,
    duration: `${6 + index * 0.45}s`,
    opacity: 0.1 + index * 0.06,
  }));
}

export default function BigCrunchCyclicUniverseVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [arcs, setArcs] = useState<Arc[]>([]);

  useEffect(() => {
    setArcs(buildArcs());
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.16),transparent_24%),linear-gradient(180deg,#050816,#02030a_78%,#12040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:34px_34px] opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(244,63,94,0.16),transparent_28%)]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-amber-200/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-amber-200/15 bg-amber-200/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-50">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-sky-400/10 via-sky-400/5 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-rose-400/12 via-orange-300/6 to-transparent" />

        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.85),rgba(2,6,23,0.96))]">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />

            <div className="absolute left-[18%] top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-sky-300/25 bg-sky-300/10 shadow-[0_0_45px_rgba(56,189,248,0.18)] animate-[orbitPulse_6s_ease-in-out_infinite]" />
            <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_36px_rgba(251,191,36,0.9)]" />
            <div className="absolute right-[16%] top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-rose-300/25 bg-rose-300/10 shadow-[0_0_52px_rgba(251,113,133,0.22)] animate-[collapsePulse_4.6s_ease-in-out_infinite]" />

            <div className="absolute left-[29%] top-1/2 h-[2px] w-[18%] -translate-y-1/2 bg-gradient-to-r from-sky-300/70 to-amber-200/70" />
            <div className="absolute right-[28%] top-1/2 h-[2px] w-[18%] -translate-y-1/2 bg-gradient-to-r from-amber-200/80 to-rose-300/80" />

            {arcs.map((arc) => (
              <div
                key={arc.id}
                className="absolute left-1/2 top-1/2 rounded-full border border-orange-200/20"
                style={{
                  width: `${arc.size}%`,
                  height: `${arc.size}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: arc.opacity,
                  animation: `ringShift ${arc.duration} linear ${arc.delay} infinite`,
                }}
              />
            ))}

            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              <span>{t.phaseA}</span>
              <span>{t.phaseB}</span>
              <span>{t.phaseC}</span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
                {t.phaseA}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-500" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
                {t.phaseB}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[48%] rounded-full bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500" />
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
                {t.phaseC}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-rose-300 via-orange-300 to-red-400" />
              </div>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes orbitPulse {
                0%, 100% { transform: translateY(-50%) scale(0.94); opacity: 0.72; }
                50% { transform: translateY(-50%) scale(1.06); opacity: 1; }
              }
              @keyframes collapsePulse {
                0%, 100% { transform: translateY(-50%) scale(0.92); opacity: 0.64; }
                50% { transform: translateY(-50%) scale(1.12); opacity: 1; }
              }
              @keyframes ringShift {
                0% { transform: translate(-50%, -50%) scale(0.82); opacity: 0; }
                25% { opacity: 0.24; }
                100% { transform: translate(-50%, -50%) scale(1.28); opacity: 0; }
              }
            `,
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.statA}
          </p>
          <p className="mt-3 text-sm text-slate-200">{t.statAValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.statB}
          </p>
          <p className="mt-3 text-sm text-slate-200">{t.statBValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.statC}
          </p>
          <p className="mt-3 text-sm text-slate-200">{t.statCValue}</p>
        </div>
      </div>
    </section>
  );
}
