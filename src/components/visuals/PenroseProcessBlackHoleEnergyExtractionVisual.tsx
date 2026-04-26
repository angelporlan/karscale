import React, { useEffect, useState } from "react";

const copy = {
  "es": {
    "eyebrow": "Archivo Kardashev",
    "title": "El Proceso Penrose: ExtracciÃ³n de EnergÃ­a de Agujeros Negros",
    "description": "Una visual animada para leer El Proceso Penrose: ExtracciÃ³n de EnergÃ­a de Agujeros Negros desde Kardashev / Type 3.",
    "badge": "Escaneo activo",
    "metricA": "SeÃ±al",
    "metricB": "Escala",
    "metricC": "Horizonte",
    "metricAValue": "1.0x",
    "metricBValue": "Kardashev",
    "metricCValue": "Type 3"
  },
  "en": {
    "eyebrow": "Kardashev archive",
    "title": "El Proceso Penrose: ExtracciÃ³n de EnergÃ­a de Agujeros Negros",
    "description": "An animated visual for reading El Proceso Penrose: ExtracciÃ³n de EnergÃ­a de Agujeros Negros through Kardashev / Type 3.",
    "badge": "Active scan",
    "metricA": "Signal",
    "metricB": "Scale",
    "metricC": "Horizon",
    "metricAValue": "1.0x",
    "metricBValue": "Kardashev",
    "metricCValue": "Type 3"
  }
} as const;

type Lang = "es" | "en";

type Particle = {
  id: number;
  top: string;
  left: string;
  opacity: number;
  size: "small" | "medium";
  delay: string;
};

const rings = ["inset-0", "inset-[10%]", "inset-[22%]", "inset-[34%]"];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    top: (Math.random() * 100).toFixed(2) + "%",
    left: (Math.random() * 100).toFixed(2) + "%",
    opacity: 0.2 + Math.random() * 0.55,
    size: Math.random() > 0.78 ? "medium" : "small",
    delay: (Math.random() * 4).toFixed(2) + "s",
  }));
}

export default function PenroseProcessBlackHoleEnergyExtractionVisual({ lang = "es" }: { lang?: Lang }) {
  const t = copy[lang] ?? copy.es;
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(buildParticles(120));
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,#050816,#02040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-sky-300/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-slate-300">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.22),transparent_38%)]" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15 animate-[spin_28s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/15 animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_36px_rgba(103,232,249,0.9)]" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[pulse_6s_ease-in-out_infinite]" />

        {rings.map((ring, index) => (
          <div
            key={ring}
            className={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border " +
              (index % 2 === 0 ? "border-cyan-300/10" : "border-fuchsia-300/10") +
              " " +
              ring
            }
          />
        ))}

        {particles.map((particle) => (
          <span
            key={particle.id}
            className={
              "absolute rounded-full bg-white " +
              (particle.size === "medium" ? "h-1.5 w-1.5" : "h-[3px] w-[3px]") +
              " animate-[pulse_2.5s_ease-in-out_infinite]"
            }
            style={{
              top: particle.top,
              left: particle.left,
              opacity: particle.opacity,
              animationDelay: particle.delay,
            }}
          />
        ))}

        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute inset-x-0 top-[18%] h-24 animate-[scan_7s_ease-in-out_infinite_alternate] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        <style
          dangerouslySetInnerHTML={{
            __html: "\n              @keyframes scan {\n                0% { transform: translateY(-80%); }\n                100% { transform: translateY(420%); }\n              }\n            ",
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricA}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricAValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricB}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricBValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricC}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricCValue}</p>
        </div>
      </div>
    </section>
  );
}

