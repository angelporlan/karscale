import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Memoria activa del modelo",
    title: "La ventana no es infinita",
    description:
      "A medida que crece el historial, sube el coste de atención y cae la nitidez de las señales realmente importantes.",
    badge: "Contexto en tiempo real",
    leftLabel: "Tokens recientes",
    rightLabel: "Tokens lejanos",
    stripTitle: "Señal útil",
    stripSubtitle: "Alta al principio, difusa al fondo",
    statA: "Precisión local",
    statAValue: "Alta",
    statB: "Coste atencional",
    statBValue: "Creciente",
    statC: "Riesgo",
    statCValue: "Olvido parcial",
  },
  en: {
    eyebrow: "Active model memory",
    title: "The window is not infinite",
    description:
      "As the history grows, attention cost rises and the sharpness of the most important signals starts to fade.",
    badge: "Live context trace",
    leftLabel: "Recent tokens",
    rightLabel: "Distant tokens",
    stripTitle: "Useful signal",
    stripSubtitle: "Sharp up front, diffuse in the back",
    statA: "Local precision",
    statAValue: "High",
    statB: "Attention cost",
    statBValue: "Rising",
    statC: "Risk",
    statCValue: "Partial forgetting",
  },
} as const;

type Lang = "es" | "en";

type Pulse = {
  id: number;
  top: string;
  delay: string;
  duration: string;
  width: string;
  opacity: number;
};

function buildPulses(): Pulse[] {
  return Array.from({ length: 26 }).map((_, index) => ({
    id: index,
    top: `${8 + index * 3.1}%`,
    delay: `${(index % 7) * 0.22}s`,
    duration: `${4 + (index % 5) * 0.6}s`,
    width: `${20 + (index % 6) * 9}%`,
    opacity: 0.16 + (index % 5) * 0.07,
  }));
}

export default function ContextWindowLimitsInLargeLanguageModelsVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    setPulses(buildPulses());
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#04111d,#02060d)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-cyan-300/75">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-100">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-cyan-400/12 via-cyan-400/5 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[35%] bg-gradient-to-l from-indigo-500/10 via-indigo-500/5 to-transparent" />

        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
          <span>{t.leftLabel}</span>
          <span>{t.rightLabel}</span>
        </div>

        <div className="relative mt-5 h-[320px] overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(90deg,rgba(34,211,238,0.06),rgba(15,23,42,0.35)_45%,rgba(99,102,241,0.06))]">
          <div className="absolute inset-y-0 left-[24%] w-px bg-cyan-300/40" />
          <div className="absolute inset-y-0 left-[58%] w-px bg-white/10" />
          <div className="absolute inset-y-0 right-[12%] w-px bg-indigo-300/20" />

          {pulses.map((pulse) => (
            <div
              key={pulse.id}
              className="absolute left-[6%] h-[6px] rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-transparent animate-[signal_5s_linear_infinite]"
              style={{
                top: pulse.top,
                width: pulse.width,
                opacity: pulse.opacity,
                animationDelay: pulse.delay,
                animationDuration: pulse.duration,
              }}
            />
          ))}

          <div className="absolute left-[10%] top-[18%] h-[64%] w-[20%] rounded-[24px] border border-cyan-300/20 bg-cyan-300/6 shadow-[0_0_40px_rgba(34,211,238,0.08)]" />
          <div className="absolute left-[39%] top-[12%] h-[76%] w-[18%] rounded-[24px] border border-sky-300/12 bg-sky-300/5" />
          <div className="absolute right-[10%] top-[14%] h-[72%] w-[24%] rounded-[24px] border border-indigo-300/12 bg-indigo-300/5" />

          <div className="absolute left-[13%] top-[22%] h-28 w-28 rounded-full border border-cyan-200/25 bg-cyan-300/10 shadow-[0_0_30px_rgba(103,232,249,0.18)]" />
          <div className="absolute left-[46%] top-[34%] h-20 w-20 rounded-full border border-sky-200/15 bg-sky-300/8 blur-[1px]" />
          <div className="absolute right-[18%] top-[30%] h-16 w-16 rounded-full border border-indigo-200/12 bg-indigo-300/8 blur-[2px]" />

          <div className="absolute inset-y-0 right-0 w-[42%] bg-gradient-to-l from-[#02060d] via-[#02060d]/72 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[46%] backdrop-blur-[2px]" />

          <div className="absolute left-[8%] bottom-6 right-[8%] flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">
                {t.stripTitle}
              </p>
              <p className="mt-2 text-sm text-slate-300">{t.stripSubtitle}</p>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300" />
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes signal {
                  0% { transform: translateX(0) scaleX(1); opacity: 0.1; }
                  45% { opacity: 0.85; }
                  100% { transform: translateX(250%) scaleX(0.6); opacity: 0; }
                }
              `,
            }}
          />
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
