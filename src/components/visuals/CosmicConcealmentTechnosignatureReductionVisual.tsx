import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Protocolo de baja detectabilidad",
    title: "Civilizaciones que apagan su firma",
    description:
      "Una sociedad avanzada podría sobrevivir no mostrando poder, sino disipándolo con disciplina térmica, silencio electromagnético y actividad repartida.",
    badge: "Modo ocultamiento",
    leftLabel: "Emisión visible",
    rightLabel: "Ruido de fondo cósmico",
    stripTitle: "Tecnofirma residual",
    stripSubtitle: "Menos brillo, menos probabilidad de ser localizada",
    statA: "Infraestructura",
    statAValue: "Distribuida",
    statB: "Calor residual",
    statBValue: "Gestionado",
    statC: "Estrategia",
    statCValue: "Discreción activa",
  },
  en: {
    eyebrow: "Low-detectability protocol",
    title: "Civilizations that dim their signature",
    description:
      "An advanced society may survive not by displaying power, but by dissipating it through thermal discipline, electromagnetic silence, and distributed activity.",
    badge: "Concealment mode",
    leftLabel: "Visible emission",
    rightLabel: "Cosmic background noise",
    stripTitle: "Residual technosignature",
    stripSubtitle: "Less brightness, less chance of being found",
    statA: "Infrastructure",
    statAValue: "Distributed",
    statB: "Waste heat",
    statBValue: "Managed",
    statC: "Strategy",
    statCValue: "Active discretion",
  },
} as const;

type Lang = "es" | "en";

type Trace = {
  id: number;
  top: string;
  delay: string;
  duration: string;
  width: string;
  opacity: number;
};

function buildTraces(): Trace[] {
  return Array.from({ length: 24 }).map((_, index) => ({
    id: index,
    top: `${9 + index * 3.2}%`,
    delay: `${(index % 6) * 0.24}s`,
    duration: `${5 + (index % 4) * 0.55}s`,
    width: `${16 + (index % 7) * 8}%`,
    opacity: 0.1 + (index % 5) * 0.06,
  }));
}

export default function CosmicConcealmentTechnosignatureReductionVisual({
  lang = "es",
}: {
  lang?: Lang;
}) {
  const t = copy[lang] ?? copy.es;
  const [traces, setTraces] = useState<Trace[]>([]);

  useEffect(() => {
    setTraces(buildTraces());
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#050816,#02030a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_34%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-emerald-100">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-[34%] bg-gradient-to-r from-emerald-400/10 via-emerald-400/5 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-sky-500/10 via-sky-500/5 to-transparent" />

        <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
          <span>{t.leftLabel}</span>
          <span>{t.rightLabel}</span>
        </div>

        <div className="relative mt-5 h-[320px] overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(90deg,rgba(16,185,129,0.05),rgba(15,23,42,0.35)_48%,rgba(14,165,233,0.05))]">
          <div className="absolute inset-y-0 left-[22%] w-px bg-emerald-300/30" />
          <div className="absolute inset-y-0 left-[58%] w-px bg-white/10" />
          <div className="absolute inset-y-0 right-[13%] w-px bg-sky-300/18" />

          {traces.map((trace) => (
            <div
              key={trace.id}
              className="absolute left-[7%] h-[5px] rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-transparent animate-[fadeTrace_6s_linear_infinite]"
              style={{
                top: trace.top,
                width: trace.width,
                opacity: trace.opacity,
                animationDelay: trace.delay,
                animationDuration: trace.duration,
              }}
            />
          ))}

          <div className="absolute left-[10%] top-[18%] h-[62%] w-[18%] rounded-[24px] border border-emerald-300/20 bg-emerald-300/6 shadow-[0_0_40px_rgba(52,211,153,0.08)]" />
          <div className="absolute left-[38%] top-[12%] h-[76%] w-[19%] rounded-[24px] border border-slate-300/10 bg-slate-200/[0.04]" />
          <div className="absolute right-[8%] top-[14%] h-[72%] w-[25%] rounded-[24px] border border-sky-300/12 bg-sky-300/5" />

          <div className="absolute left-[12%] top-[24%] h-24 w-24 rounded-full border border-emerald-200/20 bg-emerald-300/8 blur-[1px]" />
          <div className="absolute left-[44%] top-[34%] h-20 w-20 rounded-full border border-slate-200/10 bg-white/[0.04] blur-[2px]" />
          <div className="absolute right-[18%] top-[28%] h-16 w-16 rounded-full border border-sky-200/12 bg-sky-300/8 blur-[2px]" />

          <div className="absolute left-[17%] top-[20%] h-[58%] w-[1px] bg-gradient-to-b from-transparent via-emerald-200/60 to-transparent" />
          <div className="absolute left-[46%] top-[16%] h-[66%] w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
          <div className="absolute right-[20%] top-[18%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-sky-200/30 to-transparent" />

          <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-l from-[#02030a] via-[#02030a]/78 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[44%] backdrop-blur-[2px]" />

          <div className="absolute left-[8%] bottom-6 right-[8%] flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-200/80">
                {t.stripTitle}
              </p>
              <p className="mt-2 text-sm text-slate-300">{t.stripSubtitle}</p>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[34%] rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300" />
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes fadeTrace {
                  0% { transform: translateX(0) scaleX(1); opacity: 0.14; }
                  50% { opacity: 0.55; }
                  100% { transform: translateX(210%) scaleX(0.55); opacity: 0; }
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
