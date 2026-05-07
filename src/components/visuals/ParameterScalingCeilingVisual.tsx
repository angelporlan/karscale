import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Frontera de escalamiento",
    title: "Más parámetros, menor margen",
    description:
      "La ganancia ya no depende solo del tamaño: datos, herramientas, memoria y verificación empiezan a definir el rendimiento útil.",
    badge: "Curva activa",
    axisLeft: "Rendimiento",
    axisBottom: "Parámetros",
    plateau: "Zona de retornos decrecientes",
    statA: "Tamaño",
    statAValue: "Sigue importando",
    statB: "Cuello de botella",
    statBValue: "Calidad y coste",
    statC: "Siguiente salto",
    statCValue: "Arquitectura",
  },
  en: {
    eyebrow: "Scaling frontier",
    title: "More parameters, smaller margins",
    description:
      "Gains no longer depend on size alone: data, tools, memory, and verification increasingly define useful performance.",
    badge: "Live curve",
    axisLeft: "Performance",
    axisBottom: "Parameters",
    plateau: "Diminishing returns zone",
    statA: "Scale",
    statAValue: "Still matters",
    statB: "Bottleneck",
    statBValue: "Quality and cost",
    statC: "Next jump",
    statCValue: "Architecture",
  },
} as const;

type Lang = "es" | "en";

type Node = {
  id: number;
  top: string;
  left: string;
  delay: string;
  size: string;
};

function buildNodes(): Node[] {
  return Array.from({ length: 42 }).map((_, index) => ({
    id: index,
    top: `${12 + ((index * 19) % 72)}%`,
    left: `${8 + ((index * 13) % 84)}%`,
    delay: `${(index % 9) * 0.18}s`,
    size: index % 7 === 0 ? "h-2 w-2" : "h-1.5 w-1.5",
  }));
}

export default function ParameterScalingCeilingVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    setNodes(buildNodes());
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#07111f,#02040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_85%_25%,rgba(168,85,247,0.16),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-cyan-100">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_55%,rgba(14,165,233,0.12),transparent_36%)]" />

        <div className="relative h-[340px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(2,6,23,0.9))]">
          <div className="absolute bottom-12 left-12 top-10 w-px bg-white/20" />
          <div className="absolute bottom-12 left-12 right-10 h-px bg-white/20" />
          <p className="absolute left-4 top-6 -rotate-90 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
            {t.axisLeft}
          </p>
          <p className="absolute bottom-4 right-10 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
            {t.axisBottom}
          </p>

          <div className="absolute bottom-[22%] left-[18%] h-[46%] w-[68%]">
            <div className="absolute bottom-0 left-0 h-[5px] w-[28%] rotate-[-28deg] rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.55)]" />
            <div className="absolute bottom-[27%] left-[24%] h-[5px] w-[31%] rotate-[-15deg] rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.45)]" />
            <div className="absolute bottom-[43%] left-[50%] h-[5px] w-[32%] rotate-[-4deg] rounded-full bg-violet-300 shadow-[0_0_24px_rgba(196,181,253,0.38)]" />
            <div className="absolute bottom-[48%] left-[76%] h-[5px] w-[20%] rotate-[2deg] rounded-full bg-fuchsia-300/80" />
          </div>

          <div className="absolute right-[9%] top-[24%] rounded-2xl border border-fuchsia-300/15 bg-fuchsia-300/10 px-4 py-3 text-right">
            <p className="max-w-40 font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-100">
              {t.plateau}
            </p>
          </div>

          {nodes.map((node) => (
            <span
              key={node.id}
              className={`${node.size} absolute rounded-full bg-cyan-100/70 animate-[pulse_2.8s_ease-in-out_infinite]`}
              style={{
                top: node.top,
                left: node.left,
                animationDelay: node.delay,
              }}
            />
          ))}

          <div className="absolute inset-x-0 top-[18%] h-px bg-gradient-to-r from-transparent via-fuchsia-300/25 to-transparent" />
          <div className="absolute inset-x-0 top-[52%] h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
          <div className="absolute inset-y-0 right-[22%] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
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
