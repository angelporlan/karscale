import React, { useEffect, useState } from "react";

const copy = {
  es: {
    eyebrow: "Archivo Cosmos",
    title: "Estrellas de neutrones y púlsares: relojes cósmicos",
    description:
      "Una visual animada para leer Estrellas de neutrones y púlsares: relojes cósmicos desde Cosmos / Celestial Mechanics.",
    badge: "Pulso estable",
    metricA: "Frecuencia",
    metricB: "Escala",
    metricC: "Densidad",
    metricAValue: "716 Hz",
    metricBValue: "Estelar",
    metricCValue: "Extrema",
  },
  en: {
    eyebrow: "Cosmos archive",
    title: "Neutron Stars and Pulsars: Cosmic Clocks",
    description:
      "An animated visual for reading Neutron Stars and Pulsars: Cosmic Clocks through Cosmos / Celestial Mechanics.",
    badge: "Stable pulse",
    metricA: "Frequency",
    metricB: "Scale",
    metricC: "Density",
    metricAValue: "716 Hz",
    metricBValue: "Stellar",
    metricCValue: "Extreme",
  },
} as const;

type Lang = "es" | "en";

type Pulse = {
  id: number;
  angle: number;
  radius: number;
  delay: string;
  duration: string;
};

function buildPulses(count: number): Pulse[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    angle: (360 / count) * index,
    radius: 24 + (index % 6) * 8,
    delay: (index * 0.12).toFixed(2) + "s",
    duration: (2.4 + (index % 5) * 0.18).toFixed(2) + "s",
  }));
}

export default function NeutronStarsPulsarsVisual({ lang = "es" }: { lang?: Lang }) {
  const t = copy[lang] ?? copy.es;
  const [pulses, setPulses] = useState<Pulse[]>([]);

  useEffect(() => {
    setPulses(buildPulses(30));
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_30%),linear-gradient(180deg,#020617,#02030a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_44%)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-sky-200/80">{t.eyebrow}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{t.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{t.description}</p>
        </div>

        <div className="rounded-full border border-cyan-200/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-slate-300">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.2),rgba(2,6,23,0.92))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_36%)]" />
        <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.95),rgba(125,211,252,0.7)_28%,rgba(29,78,216,0.32)_58%,transparent_72%)] shadow-[0_0_80px_rgba(56,189,248,0.32)]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/15 animate-[spin_14s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-300/10 animate-[spin_22s_linear_infinite_reverse]" />

        <div className="absolute left-1/2 top-1/2 h-3 w-[46%] -translate-y-1/2 origin-left rounded-full bg-gradient-to-r from-cyan-200/90 via-sky-300/45 to-transparent blur-[1px] animate-[beam_2.1s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-3 w-[46%] -translate-y-1/2 origin-left rotate-180 rounded-full bg-gradient-to-r from-fuchsia-200/90 via-indigo-300/40 to-transparent blur-[1px] animate-[beam_2.1s_ease-in-out_infinite]" />

        {pulses.map((pulse) => (
          <span
            key={pulse.id}
            className="absolute left-1/2 top-1/2 block rounded-full border border-cyan-200/20"
            style={{
              width: `${pulse.radius}%`,
              height: `${pulse.radius}%`,
              transform: `translate(-50%, -50%) rotate(${pulse.angle}deg)`,
              animation: `pulseRing ${pulse.duration} ease-out ${pulse.delay} infinite`,
            }}
          />
        ))}

        <div className="absolute inset-x-[12%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/55 to-transparent" />
        <div className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-indigo-300/35 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
          <span>magnetosphere</span>
          <span>timing array</span>
          <span>relativistic beam</span>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html:
              "@keyframes beam{0%,100%{opacity:.55;transform:translateY(-50%) scaleX(.92)}50%{opacity:1;transform:translateY(-50%) scaleX(1.05)}}@keyframes pulseRing{0%{opacity:.65}100%{opacity:0;transform:translate(-50%,-50%) scale(1.8)}}",
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{t.metricA}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricAValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{t.metricB}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricBValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{t.metricC}</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricCValue}</p>
        </div>
      </div>
    </section>
  );
}
