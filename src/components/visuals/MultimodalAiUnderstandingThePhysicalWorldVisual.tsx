import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "IA + percepción",
    title: "Modelos que ya no solo leen",
    description:
      "La multimodalidad convierte texto, imagen, audio y espacio en una sola superficie de razonamiento operativo.",
    badge: "Fusión activa",
    panelTitle: "Capas sensoriales",
    panelBody:
      "Cada canal aporta una señal distinta. El reto no es sumar entradas, sino sincronizar contexto, tiempo y prioridad.",
    textLabel: "Texto",
    visionLabel: "Visión",
    audioLabel: "Audio",
    worldLabel: "Mundo físico",
    statA: "Entrada",
    statAValue: "4 canales",
    statB: "Riesgo",
    statBValue: "Desalineación",
    statC: "Ventaja",
    statCValue: "Contexto encarnado",
  },
  en: {
    eyebrow: "AI + perception",
    title: "Models that no longer only read",
    description:
      "Multimodality turns text, image, audio, and space into a single operational reasoning surface.",
    badge: "Fusion active",
    panelTitle: "Sensory layers",
    panelBody:
      "Each channel contributes a different signal. The hard part is not adding inputs, but synchronizing context, time, and priority.",
    textLabel: "Text",
    visionLabel: "Vision",
    audioLabel: "Audio",
    worldLabel: "Physical world",
    statA: "Input",
    statAValue: "4 channels",
    statB: "Risk",
    statBValue: "Misalignment",
    statC: "Advantage",
    statCValue: "Embodied context",
  },
} as const;

type Lang = "es" | "en";

type Pulse = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  width: string;
  opacity: number;
};

function buildPulses(): Pulse[] {
  return Array.from({ length: 18 }).map((_, index) => ({
    id: index,
    left: `${6 + index * 5}%`,
    delay: `${(index % 6) * 0.18}s`,
    duration: `${3.8 + (index % 4) * 0.45}s`,
    width: `${18 + (index % 5) * 6}px`,
    opacity: 0.16 + (index % 4) * 0.12,
  }));
}

export default function MultimodalAiUnderstandingThePhysicalWorldVisual({
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
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#071019,#03060b)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-sky-300/75">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-sky-300/15 bg-sky-300/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-sky-100">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/25 p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative h-[320px] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(15,23,42,0.85)_55%,rgba(249,115,22,0.08))]">
            <div className="absolute inset-y-0 left-[24%] w-px bg-sky-300/30" />
            <div className="absolute inset-y-0 left-[50%] w-px bg-white/10" />
            <div className="absolute inset-y-0 right-[20%] w-px bg-orange-300/20" />

            <div className="absolute left-[9%] top-[18%] h-[64%] w-[18%] rounded-[22px] border border-sky-300/20 bg-sky-300/8 shadow-[0_0_34px_rgba(56,189,248,0.12)]" />
            <div className="absolute left-[34%] top-[10%] h-[78%] w-[18%] rounded-[22px] border border-cyan-300/16 bg-cyan-300/6" />
            <div className="absolute right-[28%] top-[16%] h-[68%] w-[18%] rounded-[22px] border border-amber-300/16 bg-amber-300/6" />
            <div className="absolute right-[8%] top-[22%] h-[56%] w-[12%] rounded-[22px] border border-orange-300/16 bg-orange-300/8" />

            <div className="absolute left-[13%] top-[24%] h-20 w-20 rounded-full border border-sky-200/20 bg-sky-300/10 shadow-[0_0_24px_rgba(125,211,252,0.18)]" />
            <div className="absolute left-[39%] top-[34%] h-16 w-16 rounded-full border border-cyan-200/15 bg-cyan-300/8 blur-[1px]" />
            <div className="absolute right-[31%] top-[29%] h-16 w-16 rounded-full border border-amber-200/15 bg-amber-300/8 blur-[1px]" />
            <div className="absolute right-[8%] top-[36%] h-12 w-12 rounded-full border border-orange-200/15 bg-orange-300/10 blur-[1px]" />

            {pulses.map((pulse) => (
              <div
                key={pulse.id}
                className="absolute bottom-6 h-24 rounded-full bg-gradient-to-t from-sky-300/35 via-sky-200/16 to-transparent animate-[rise_4.8s_ease-in-out_infinite]"
                style={{
                  left: pulse.left,
                  width: pulse.width,
                  opacity: pulse.opacity,
                  animationDelay: pulse.delay,
                  animationDuration: pulse.duration,
                }}
              />
            ))}

            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#02060d] to-transparent" />
            <div className="absolute inset-x-[8%] bottom-6 flex items-end justify-between gap-3">
              <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-sky-100">
                {t.textLabel}
              </span>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100">
                {t.visionLabel}
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100">
                {t.audioLabel}
              </span>
              <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-orange-100">
                {t.worldLabel}
              </span>
            </div>

            <style
              dangerouslySetInnerHTML={{
                __html: `
                  @keyframes rise {
                    0% { transform: translateY(24px); opacity: 0; }
                    35% { opacity: 0.75; }
                    100% { transform: translateY(-220px); opacity: 0; }
                  }
                `,
              }}
            />
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
              {t.panelTitle}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{t.panelBody}</p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-sky-300/12 bg-sky-300/6 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-sky-200/80">
                    {t.textLabel}
                  </span>
                  <span className="h-2 w-20 rounded-full bg-sky-200/15">
                    <span className="block h-full w-[72%] rounded-full bg-sky-300" />
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-300/12 bg-cyan-300/6 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-200/80">
                    {t.visionLabel}
                  </span>
                  <span className="h-2 w-20 rounded-full bg-cyan-200/15">
                    <span className="block h-full w-[86%] rounded-full bg-cyan-300" />
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-300/12 bg-amber-300/6 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-200/80">
                    {t.audioLabel}
                  </span>
                  <span className="h-2 w-20 rounded-full bg-amber-200/15">
                    <span className="block h-full w-[58%] rounded-full bg-amber-300" />
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-300/12 bg-orange-300/6 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-orange-200/80">
                    {t.worldLabel}
                  </span>
                  <span className="h-2 w-20 rounded-full bg-orange-200/15">
                    <span className="block h-full w-[91%] rounded-full bg-orange-300" />
                  </span>
                </div>
              </div>
            </div>
          </div>
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
