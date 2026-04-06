import React, { useEffect, useState } from "react";

type Star = {
  id: number;
  top: string;
  left: string;
  opacity: number;
  size: string;
};

const generateStars = (count: number): Star[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.1,
    size: Math.random() > 0.8 ? "h-1 w-1" : "h-[2px] w-[2px]",
  }));

const i18n = {
  es: {
    modelType: "Modelo Estadistico SETI",
    title: "El Gran Filtro Cosmico",
    badge: "Analisis de Vacio",
    probTitle: "Probabilidad Teorica",
    probDesc: "Millones de mundos habitables en la Via Lactea segun la Ecuacion de Drake.",
    probRef: "100.000 Millones de Estrellas",
    filterTitle: "El Gran Filtro",
    filterDesc: "Una barrera evolutiva o tecnologica que impide la colonizacion interestelar.",
    silenceTitle: "El Gran Silencio",
    silenceDesc: "Cero senales o tecnofirmas detectadas tras decadas de escucha activa.",
    silenceRef: "Paradoja de Fermi (1950)",
  },
  en: {
    modelType: "SETI Statistical Model",
    title: "The Great Cosmic Filter",
    badge: "Void Analysis",
    probTitle: "Theoretical Probability",
    probDesc: "Millions of habitable worlds in the Milky Way according to the Drake Equation.",
    probRef: "100 Billion Stars",
    filterTitle: "The Great Filter",
    filterDesc: "An evolutionary or technological barrier that prevents interstellar colonization.",
    silenceTitle: "The Great Silence",
    silenceDesc: "Zero signals or technosignatures detected after decades of active listening.",
    silenceRef: "Fermi Paradox (1950)",
  },
};

export default function FermiParadoxVisual({ lang = "es" }: { lang?: "es" | "en" }) {
  const t = i18n[lang] || i18n.es;
  const [backgroundStars, setBackgroundStars] = useState<Star[]>([]);

  useEffect(() => {
    setBackgroundStars(generateStars(150));
  }, []);

  return (
    <div className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#020408] px-6 py-8 font-body sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.32em] text-sky-400/80">
            {t.modelType}
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
            {t.title}
          </h3>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-gray-300 sm:block">
          {t.badge}
        </div>
      </div>

      <div className="relative mx-auto aspect-[4/3] w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/5 bg-black/40 shadow-inner">
        {backgroundStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-slate-300"
            style={{
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              width: star.size.includes("h-1") ? "4px" : "2px",
              height: star.size.includes("h-1") ? "4px" : "2px",
            }}
          />
        ))}

        <div className="absolute left-0 top-1/2 z-10 h-px w-full bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <div className="absolute left-0 top-1/2 z-10 h-8 w-full -translate-y-1/2 bg-gradient-to-b from-red-500/0 via-red-500/10 to-red-500/0" />

        <div className="absolute left-[20%] top-[65%] h-2 w-2 rounded-full bg-red-400/40" />
        <div className="absolute left-[80%] top-[75%] h-1.5 w-1.5 rounded-full bg-red-400/30" />
        <div className="absolute left-[45%] top-[55%] h-2.5 w-2.5 rounded-full bg-red-400/50" />

        <div className="absolute left-[50%] top-[35%] z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
          <div className="absolute inset-0 -m-[10px] rounded-full border border-sky-400/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-0 -m-[20px] rounded-full border border-sky-400/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
        </div>

        <div className="absolute left-0 top-0 z-10 h-[20%] w-full animate-[scan_6s_ease-in-out_infinite_alternate] border-b border-sky-500/20 bg-gradient-to-b from-sky-500/0 via-sky-500/10 to-sky-500/0" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes scan {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(500%); }
              }
            `,
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
              {t.probTitle}
            </p>
            <p className="mt-3 font-body text-sm leading-6 text-gray-300">{t.probDesc}</p>
          </div>
          <p className="mt-4 font-body text-xs italic text-gray-400">{t.probRef}</p>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-red-400/80">
              {t.filterTitle}
            </p>
            <p className="mt-3 font-body text-sm leading-6 text-gray-300">{t.filterDesc}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500">
              {t.silenceTitle}
            </p>
            <p className="mt-3 font-body text-sm leading-6 text-gray-300">{t.silenceDesc}</p>
          </div>
          <p className="mt-4 font-body text-xs italic text-sky-400/70">{t.silenceRef}</p>
        </div>
      </div>
    </div>
  );
}
