import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Archivo Neurotech",
    title: "Transhumanismo e inteligencia artificial",
    description:
      "Una interfaz viva entre señales biológicas, memoria aumentada y decisión algorítmica.",
    badge: "Sinapsis activa",
    metricA: "Integración",
    metricB: "Autonomía",
    metricC: "Frontera",
    metricAValue: "cuerpo + modelo",
    metricBValue: "negociada",
    metricCValue: "mente extendida",
  },
  en: {
    eyebrow: "Neurotech archive",
    title: "Transhumanism and artificial intelligence",
    description:
      "A living interface between biological signals, augmented memory, and algorithmic decision-making.",
    badge: "Active synapse",
    metricA: "Integration",
    metricB: "Autonomy",
    metricC: "Frontier",
    metricAValue: "body + model",
    metricBValue: "negotiated",
    metricCValue: "extended mind",
  },
} as const;

type Lang = "es" | "en";

type Synapse = {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
};

function buildSynapses(count: number): Synapse[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    top: `${12 + Math.random() * 76}%`,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 4}s`,
  }));
}

export default function TranshumanismFusionArtificialIntelligenceVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [synapses, setSynapses] = useState<Synapse[]>([]);

  useEffect(() => {
    setSynapses(buildSynapses(52));
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(244,114,182,0.14),transparent_30%),linear-gradient(180deg,#05070d,#090711_60%,#020308)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-30" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10 animate-[spin_42s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-300/10 animate-[spin_32s_linear_infinite_reverse]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-200/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-slate-300">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 aspect-[16/10] min-h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-black/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_44%)]" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border border-cyan-200/20 bg-cyan-300/[0.03] shadow-[0_0_60px_rgba(34,211,238,0.14)]" />
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[26%] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border border-pink-200/20 bg-pink-300/[0.025]" />
        <div className="absolute left-1/2 top-[18%] h-[64%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <div className="absolute left-[18%] top-1/2 h-px w-[64%] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 rounded-full border border-white/10"
            style={{
              width: `${24 + index * 14}%`,
              height: `${24 + index * 14}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {synapses.map((synapse) => (
          <span
            key={synapse.id}
            className="absolute h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(125,211,252,0.85)] animate-[synapse_4s_ease-in-out_infinite]"
            style={{
              top: synapse.top,
              left: synapse.left,
              animationDelay: synapse.delay,
              animationDuration: synapse.duration,
            }}
          />
        ))}

        <div className="absolute left-[14%] top-[22%] h-[56%] w-[72%] rounded-full border border-dashed border-pink-300/20 animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-y-0 left-1/2 w-24 -translate-x-1/2 animate-[scan_6s_ease-in-out_infinite_alternate] bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent" />

        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n              @keyframes synapse {\n                0%, 100% { opacity: 0.2; transform: scale(0.72); }\n                50% { opacity: 1; transform: scale(1.35); }\n              }\n              @keyframes scan {\n                0% { transform: translateX(-220%); }\n                100% { transform: translateX(160%); }\n              }\n            ",
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        {[
          [t.metricA, t.metricAValue],
          [t.metricB, t.metricBValue],
          [t.metricC, t.metricCValue],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
              {label}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
