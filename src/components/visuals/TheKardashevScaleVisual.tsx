import React, { useEffect, useRef } from "react";

const copy = {
  es: {
    eyebrow: "Modelo Teórico Energético",
    title: "La Escala de Kardashov",
    description:
      "Clasificación que mide el grado de evolución tecnológica de una civilización basándose en la cantidad de energía que es capaz de aprovechar y manipular.",
    currentLabel: "Nivel Actual (Humanidad)",
    currentValue: "Tipo 0.73",
    t1: "Tipo I",
    t1Desc: "Planetaria",
    t1Energy: "10¹⁶ W",
    t2: "Tipo II",
    t2Desc: "Estelar",
    t2Energy: "10²⁶ W",
    t3: "Tipo III",
    t3Desc: "Galáctica",
    t3Energy: "10³⁶ W",
  },
  en: {
    eyebrow: "Theoretical Energy Model",
    title: "The Kardashev Scale",
    description:
      "Classification that measures a civilization's level of technological advancement based on the amount of energy it is able to harness and manipulate.",
    currentLabel: "Current Level (Humanity)",
    currentValue: "Type 0.73",
    t1: "Type I",
    t1Desc: "Planetary",
    t1Energy: "10¹⁶ W",
    t2: "Type II",
    t2Desc: "Stellar",
    t2Energy: "10²⁶ W",
    t3: "Type III",
    t3Desc: "Galactic",
    t3Energy: "10³⁶ W",
  },
} as const;

type Props = {
  lang?: keyof typeof copy;
};

const planets = [
  { names: { es: "Mercurio", en: "Mercury" }, color: "#b5b5b5", size: 4, orbit: 52, speed: 4.1, tilt: 7, initAngle: 0.4 },
  { names: { es: "Venus", en: "Venus" }, color: "#e8cda0", size: 6, orbit: 72, speed: 6.5, tilt: 15, initAngle: 1.2 },
  { names: { es: "Tierra", en: "Earth" }, color: "#4fa3e0", size: 7, orbit: 96, speed: 10, tilt: 0, initAngle: 2.4 },
  { names: { es: "Marte", en: "Mars" }, color: "#c1440e", size: 5, orbit: 120, speed: 13.5, tilt: -10, initAngle: 3.8 },
  { names: { es: "Júpiter", en: "Jupiter" }, color: "#c88b3a", size: 13, orbit: 154, speed: 22, tilt: 5, initAngle: Math.PI },
  { names: { es: "Saturno", en: "Saturn" }, color: "#e4d191", size: 11, orbit: 190, speed: 34, tilt: -8, initAngle: Math.PI * 1.4 },
  { names: { es: "Urano", en: "Uranus" }, color: "#7de8e8", size: 9, orbit: 224, speed: 50, tilt: 12, initAngle: Math.PI * 1.8 },
  { names: { es: "Neptuno", en: "Neptune" }, color: "#5b7fde", size: 8, orbit: 256, speed: 70, tilt: -5, initAngle: Math.PI * 0.7 },
];

function SolarSystem({ lang }: { lang: "es" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const SIZE = 560;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;

    const draw = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Deep space background glow
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, SIZE / 2);
      bg.addColorStop(0, "rgba(255,200,60,0.04)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Orbits
      planets.forEach((p) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.orbit, p.orbit * 0.92, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Saturn ring (before planet render)
      const saturn = planets[5];
      const saturnAngle = saturn.initAngle + (elapsed / saturn.speed) * Math.PI * 2;
      const saturnX = cx + Math.cos(saturnAngle) * saturn.orbit;
      const saturnY = cy + Math.sin(saturnAngle) * saturn.orbit * 0.92;
      ctx.save();
      ctx.translate(saturnX, saturnY);
      ctx.rotate(-0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, saturn.size * 2.4, saturn.size * 0.65, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(228,209,145,0.45)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Sun
      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 34);
      sunGlow.addColorStop(0, "#fff7c2");
      sunGlow.addColorStop(0.3, "#ffe566");
      sunGlow.addColorStop(0.7, "#ffa500");
      sunGlow.addColorStop(1, "rgba(255,100,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun corona pulse
      const pulse = 1 + Math.sin(elapsed * 2) * 0.04;
      const corona = ctx.createRadialGradient(cx, cy, 20, cx, cy, 52 * pulse);
      corona.addColorStop(0, "rgba(255,200,60,0.25)");
      corona.addColorStop(1, "rgba(255,120,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 52 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      // Sun core
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#fff9d0";
      ctx.fill();

      // Planets
      planets.forEach((p, i) => {
        const angle = p.initAngle + (elapsed / p.speed) * Math.PI * 2;
        const px = cx + Math.cos(angle) * p.orbit;
        const py = cy + Math.sin(angle) * p.orbit * 0.92;

        // Glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.5);
        glow.addColorStop(0, p.color + "99");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Planet body
        const grad = ctx.createRadialGradient(px - p.size * 0.3, py - p.size * 0.3, 0, px, py, p.size);
        grad.addColorStop(0, lighten(p.color));
        grad.addColorStop(1, darken(p.color));
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Earth has a small "moon" dot
        if (i === 2) {
          const moonAngle = elapsed * 3;
          const mx = px + Math.cos(moonAngle) * 14;
          const my = py + Math.sin(moonAngle) * 14;
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#cccccc";
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        maxWidth: 560,
        height: "auto",
        display: "block",
        margin: "0 auto",
      }}
    />
  );
}

function lighten(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + 60);
  const g = Math.min(255, ((n >> 8) & 0xff) + 60);
  const b = Math.min(255, (n & 0xff) + 60);
  return `rgb(${r},${g},${b})`;
}
function darken(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 40);
  const g = Math.max(0, ((n >> 8) & 0xff) - 40);
  const b = Math.max(0, (n & 0xff) - 40);
  return `rgb(${r},${g},${b})`;
}

export default function TheKardashevScaleVisual({ lang = "es" }: Props) {
  const t = copy[lang] ?? copy.es;

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#02040a] px-6 py-8 sm:px-10">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,180,0,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(90,120,255,0.07),transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        {/* Left Column */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-amber-400">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>

          {/* Current level badge */}
          <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-amber-500/30 bg-amber-500/10 py-2 pl-3 pr-6 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-200/70">
                {t.currentLabel}
              </p>
              <p className="font-semibold text-amber-100">{t.currentValue}</p>
            </div>
          </div>

          {/* Planet legend */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2">
            {planets.map((p) => (
              <div key={p.names.es} className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: Math.max(6, p.size * 0.7),
                    height: Math.max(6, p.size * 0.7),
                    backgroundColor: p.color,
                    boxShadow: `0 0 6px ${p.color}88`,
                  }}
                />
                <span className="text-xs text-slate-400">{p.names[lang]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Solar System Canvas */}
        <div className="relative w-full">
          <SolarSystem lang={lang} />
        </div>
      </div>

      {/* Bottom scale bar */}
      <div className="relative mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
        <div className="relative flex w-full items-end justify-between">
          {/* Background track */}
          <div className="absolute bottom-6 left-0 right-0 h-[2px] bg-white/10" />
          {/* Filled progress */}
          <div className="absolute bottom-6 left-0 h-[2px] w-[24%] bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_#f59e0b]" />

          {[
            { label: t.t1, desc: t.t1Desc, energy: t.t1Energy, color: "text-amber-400/80" },
            { label: t.t2, desc: t.t2Desc, energy: t.t2Energy, color: "text-fuchsia-400/60" },
            { label: t.t3, desc: t.t3Desc, energy: t.t3Energy, color: "text-purple-400/60" },
          ].map((node, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-3">
              <div className="text-center">
                <p className="font-mono text-xs font-bold text-white">{node.label}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{node.desc}</p>
              </div>
              <div
                className="h-3 w-3 rounded-full border-2 border-[#02040a]"
                style={{
                  backgroundColor: i === 0 ? "#f59e0b" : i === 1 ? "rgba(192,38,211,0.5)" : "rgba(139,92,246,0.5)",
                  boxShadow: i === 0 ? "0 0 10px #f59e0b" : "none",
                  outline: `2px solid ${i === 0 ? "rgba(245,158,11,0.3)" : i === 1 ? "rgba(192,38,211,0.1)" : "rgba(139,92,246,0.1)"}`,
                  outlineOffset: 2,
                }}
              />
              <p className={`absolute -bottom-6 font-mono text-[10px] ${node.color}`}>
                {node.energy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}