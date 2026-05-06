import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Archivo Kardashev",
    title: "Escala microdimensional de Barrow",
    description:
      "Una lectura visual de la civilización que avanza hacia moléculas, átomos y núcleos en lugar de solo hacia estrellas.",
    badge: "Resolución activa",
    metricA: "Dirección",
    metricB: "Escala",
    metricC: "Pregunta",
    metricAValue: "Hacia dentro",
    metricBValue: "Microdimensional",
    metricCValue: "Precisión",
  },
  en: {
    eyebrow: "Kardashev archive",
    title: "Barrow microdimensional scale",
    description:
      "A visual reading of civilization moving toward molecules, atoms, and nuclei instead of only toward stars.",
    badge: "Resolution active",
    metricA: "Direction",
    metricB: "Scale",
    metricC: "Question",
    metricAValue: "Inward",
    metricBValue: "Microdimensional",
    metricCValue: "Precision",
  },
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

const shells = [
  { label: "planet", className: "inset-[7%] border-cyan-300/18" },
  { label: "city", className: "inset-[20%] border-white/14" },
  { label: "cell", className: "inset-[34%] border-fuchsia-300/18" },
  { label: "atom", className: "inset-[48%] border-emerald-300/22" },
];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    top: (Math.random() * 100).toFixed(2) + "%",
    left: (Math.random() * 100).toFixed(2) + "%",
    opacity: 0.18 + Math.random() * 0.58,
    size: Math.random() > 0.82 ? "medium" : "small",
    delay: (Math.random() * 4).toFixed(2) + "s",
  }));
}

export default function BarrowScaleInverseKardashevVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(buildParticles(96));
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_20%_15%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_80%_5%,rgba(217,70,239,0.14),transparent_28%),linear-gradient(180deg,#050816,#02040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_44%)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-teal-300/80">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.2),transparent_38%)]" />

        {shells.map((shell, index) => (
          <div
            key={shell.label}
            className={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border " +
              shell.className +
              (index % 2 === 0
                ? " animate-[spin_30s_linear_infinite]"
                : " animate-[spin_22s_linear_infinite_reverse]")
            }
          />
        ))}

        <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_38px_rgba(110,231,183,0.9)]" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/25 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[62%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-teal-300/35 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-px w-[62%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-fuchsia-300/35 to-transparent" />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className={
              "absolute rounded-full bg-white " +
              (particle.size === "medium" ? "h-1.5 w-1.5" : "h-[3px] w-[3px]") +
              " animate-[pulse_2.4s_ease-in-out_infinite]"
            }
            style={{
              top: particle.top,
              left: particle.left,
              opacity: particle.opacity,
              animationDelay: particle.delay,
            }}
          />
        ))}

        <div className="absolute inset-x-0 top-[16%] h-20 animate-[barrowScan_6.5s_ease-in-out_infinite_alternate] bg-gradient-to-b from-transparent via-emerald-300/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes barrowScan {
                0% { transform: translateY(-80%); }
                100% { transform: translateY(420%); }
              }
            `,
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
