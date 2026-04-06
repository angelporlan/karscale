import React from "react";

const stars = [
  { top: "10%", left: "18%", size: "h-1 w-1", delay: "0s" },
  { top: "22%", left: "72%", size: "h-1.5 w-1.5", delay: "1.2s" },
  { top: "68%", left: "14%", size: "h-1 w-1", delay: "2.4s" },
  { top: "56%", left: "83%", size: "h-1.5 w-1.5", delay: "0.8s" },
  { top: "38%", left: "48%", size: "h-1 w-1", delay: "3s" },
  { top: "78%", left: "63%", size: "h-1 w-1", delay: "1.8s" },
];

const nodes = [
  { top: "18%", left: "28%", size: "h-3 w-3", color: "bg-cyan-300/80" },
  { top: "28%", left: "76%", size: "h-2.5 w-2.5", color: "bg-fuchsia-300/80" },
  { top: "62%", left: "22%", size: "h-2 w-2", color: "bg-amber-300/80" },
  { top: "70%", left: "68%", size: "h-3.5 w-3.5", color: "bg-rose-300/80" },
];

// Diccionario de traducciones
const i18n = {
  es: {
    modelType: "Modelo de Señal Activa",
    title: "Barrido de riesgo en el Bosque Oscuro",
    badge: "Escaneo de Amenazas",
    costTitle: "Costo de Emisión",
    costDesc: "Una sola señal fuerte puede delatar nuestra posición durante siglos.",
    costRef: "Ref: Mensaje de Arecibo (1974)",
    intentTitle: "Intención Desconocida",
    intentDesc: "No podemos inferir ética, límites ni motivaciones de una civilización avanzada, ni sus posibles acciones preventivas.",
    strategyTitle: "Resultado Estratégico",
    strategyDesc: "Escuchar es ciencia. Emitir puede ser una apuesta irreversible.",
    strategyRef: "Kardashov: Tipo 0.7 vs Tipo II",
  },
  en: {
    modelType: "Active Signal Model",
    title: "Dark Forest Risk Sweep",
    badge: "Threat Scan",
    costTitle: "Broadcast Cost",
    costDesc: "A single strong signal can give away our position for centuries.",
    costRef: "Ref: Arecibo Message (1974)",
    intentTitle: "Unknown Intent",
    intentDesc: "We cannot infer the ethics, limits, or motivations of an advanced civilization, nor their potential preemptive actions.",
    strategyTitle: "Strategic Result",
    strategyDesc: "Listening is science. Broadcasting might be an irreversible gamble.",
    strategyRef: "Kardashev: Type 0.7 vs Type II",
  },
};

// Añadimos la prop `lang` con 'es' por defecto
export default function DarkForestSignal({ lang = "es" }: { lang?: "es" | "en" }) {
  // Obtenemos los textos basados en el idioma actual
  const t = i18n[lang] || i18n["es"];

  return (
    <div className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#020408] px-6 py-8 sm:px-8">
      {/* Fondos y gradientes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom,rgba(244,63,94,0.08),transparent_38%)]" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Header del componente */}
      <div className="relative mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
            {t.modelType}
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
            {t.title}
          </h3>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-gray-300 hidden sm:block">
          {t.badge}
        </div>
      </div>

      {/* Interfaz del Radar */}
      <div className="relative mx-auto aspect-square max-w-[420px]">
        {/* Anillos estáticos */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[12%] rounded-full border border-white/10" />
        <div className="absolute inset-[24%] rounded-full border border-white/10" />
        <div className="absolute inset-[36%] rounded-full border border-white/10" />

        {/* Haz del radar: Animado con CSS puro */}
        <div
          className="absolute inset-[8%] rounded-full opacity-70 animate-[spin_10s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(34,211,238,0.30), rgba(34,211,238,0.02) 18%, transparent 28%, transparent 100%)",
          }}
        />

        {/* Núcleo central (La Tierra) */}
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_26px_rgba(252,211,77,0.95)]" />

        {/* Estrellas de fondo */}
        {stars.map((star) => (
          <div
            key={`${star.top}-${star.left}`}
            className={`absolute rounded-full bg-white/80 ${star.size} animate-pulse`}
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}

        {/* Nodos/Anomalías detectadas */}
        {nodes.map((node) => (
          <div
            key={`${node.top}-${node.left}`}
            className={`absolute rounded-full ${node.size} ${node.color} shadow-[0_0_18px_rgba(255,255,255,0.35)]`}
            style={{ top: node.top, left: node.left }}
          />
        ))}

        {/* Ejes visuales */}
        <div className="absolute left-1/2 top-[16%] h-[34%] w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/0 via-cyan-300/40 to-cyan-300/0" />
        <div className="absolute left-[16%] top-1/2 h-px w-[68%] -translate-y-1/2 bg-gradient-to-r from-cyan-300/0 via-cyan-300/30 to-cyan-300/0" />
      </div>

      {/* Paneles de datos actualizados */}
      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
              {t.costTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              {t.costDesc}
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">
            {t.costRef}
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
              {t.intentTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              {t.intentDesc}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
              {t.strategyTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              {t.strategyDesc}
            </p>
          </div>
          <p className="mt-4 text-xs text-cyan-400/70 italic">
            {t.strategyRef}
          </p>
        </div>
      </div>
    </div>
  );
}