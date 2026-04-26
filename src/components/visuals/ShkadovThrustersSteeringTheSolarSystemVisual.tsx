import React, { useEffect, useRef } from "react";

const copy = {
  es: {
    eyebrow: "Ingeniería Estelar",
    title: "Motor Shkadov",
    description:
      "Un reflector parcial altera la simetría de la radiación solar y genera un empuje lento, continuo y acumulativo sobre todo el sistema.",
    badge: "Empuje Estelar",
    mirror: "Espejo reflector",
    star: "Sol",
    thrust: "Vector de empuje",
    orbit: "Órbitas arrastradas",
    stat1: "Escala temporal",
    stat1Value: "Milenios a millones de años",
    stat2: "Fuente de empuje",
    stat2Value: "Presión de radiación asimétrica",
    stat3: "Firma Kardashev",
    stat3Value: "Infraestructura Tipo II",
  },
  en: {
    eyebrow: "Stellar Engineering",
    title: "Shkadov Thruster",
    description:
      "A partial reflector breaks the symmetry of solar radiation and creates a slow, continuous, cumulative thrust on the entire system.",
    badge: "Stellar Thrust",
    mirror: "Reflector",
    star: "Sun",
    thrust: "Thrust vector",
    orbit: "Dragged orbits",
    stat1: "Time scale",
    stat1Value: "Millennia to millions of years",
    stat2: "Thrust source",
    stat2Value: "Asymmetric radiation pressure",
    stat3: "Kardashev signature",
    stat3Value: "Type II infrastructure",
  },
} as const;

type Props = {
  lang?: keyof typeof copy;
};

function ShkadovCanvas({ lang }: { lang: "es" | "en" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 560;
    canvas.width = size;
    canvas.height = size;

    const cx = 220;
    const cy = size / 2;

    const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 16 * Math.cos(angle - Math.PI / 7), y2 - 16 * Math.sin(angle - Math.PI / 7));
      ctx.lineTo(x2 - 16 * Math.cos(angle + Math.PI / 7), y2 - 16 * Math.sin(angle + Math.PI / 7));
      ctx.closePath();
      ctx.fill();
    };

    const render = (now: number) => {
      const t = (now - startRef.current) / 1000;
      ctx.clearRect(0, 0, size, size);

      const bg = ctx.createLinearGradient(0, 0, size, size);
      bg.addColorStop(0, "#02050b");
      bg.addColorStop(1, "#07111f");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < 80; i += 1) {
        const x = (i * 73) % size;
        const y = (i * 41) % size;
        const pulse = 0.35 + 0.25 * Math.sin(t * 1.1 + i);
        ctx.fillStyle = `rgba(255,255,255,${pulse})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      const drift = Math.sin(t * 0.9) * 5;

      const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      starGlow.addColorStop(0, "rgba(255,245,200,0.95)");
      starGlow.addColorStop(0.3, "rgba(255,190,60,0.9)");
      starGlow.addColorStop(0.7, "rgba(255,120,0,0.18)");
      starGlow.addColorStop(1, "rgba(255,120,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fillStyle = starGlow;
      ctx.fill();

      const orbitRadii = [118, 152, 188];
      orbitRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx + 22, cy, r, r * 0.58, 0.18, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? "rgba(94,234,212,0.22)" : "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.setLineDash(idx === 0 ? [8, 8] : [0, 0]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      const reflectorAngle = -0.95 + Math.sin(t * 0.3) * 0.03;
      const reflectorRadius = 118;
      const mx = cx + Math.cos(reflectorAngle) * reflectorRadius;
      const my = cy + Math.sin(reflectorAngle) * reflectorRadius * 0.72;

      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(-0.55);
      const mirrorGrad = ctx.createLinearGradient(-12, -42, 12, 42);
      mirrorGrad.addColorStop(0, "rgba(186,230,253,0.95)");
      mirrorGrad.addColorStop(1, "rgba(56,189,248,0.35)");
      ctx.fillStyle = mirrorGrad;
      ctx.strokeStyle = "rgba(125,211,252,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -52);
      ctx.quadraticCurveTo(24, 0, -8, 52);
      ctx.quadraticCurveTo(-22, 0, -8, -52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < 9; i += 1) {
        const alpha = 0.12 + i * 0.04;
        ctx.strokeStyle = `rgba(125,211,252,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(mx - 6, my - 36 + i * 8);
        ctx.quadraticCurveTo(cx - 12, cy - 10 + i * 2, cx + 8, cy + drift * 0.4);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 34, 0, Math.PI * 2);
      ctx.fillStyle = "#fff7c7";
      ctx.fill();

      ctx.fillStyle = "rgba(251,191,36,0.9)";
      ctx.strokeStyle = "rgba(251,191,36,0.95)";
      ctx.lineWidth = 3;
      drawArrow(cx + 70, cy, cx + 250, cy);

      const waveOffset = 320 + Math.sin(t * 1.8) * 8;
      for (let i = 0; i < 3; i += 1) {
        ctx.strokeStyle = `rgba(251,191,36,${0.42 - i * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 92, cy - 22 + i * 22);
        ctx.bezierCurveTo(cx + 150, cy - 42 + i * 16, waveOffset, cy - 16 + i * 16, cx + 236, cy - 4 + i * 18);
        ctx.stroke();
      }

      const planets = [
        { orbit: 118, angle: t * 0.8, size: 5, color: "#67e8f9" },
        { orbit: 152, angle: t * 0.48 + 1.6, size: 6, color: "#c4b5fd" },
        { orbit: 188, angle: t * 0.34 + 3.1, size: 7, color: "#fda4af" },
      ];

      planets.forEach((p) => {
        const px = cx + 22 + Math.cos(p.angle) * p.orbit;
        const py = cy + Math.sin(p.angle) * p.orbit * 0.58;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.4, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.4);
        glow.addColorStop(0, p.color + "aa");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(226,232,240,0.85)";
      ctx.fillText(copy[lang].mirror, mx - 70, my - 62);
      ctx.fillText(copy[lang].star, cx - 12, cy + 58);
      ctx.fillText(copy[lang].thrust, cx + 162, cy - 18);
      ctx.fillText(copy[lang].orbit, cx + 108, cy + 122);

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [lang]);

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

export default function ShkadovThrustersSteeringTheSolarSystemVisual({ lang = "es" }: Props) {
  const t = copy[lang] ?? copy.es;

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#02040a] px-6 py-8 sm:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.10),transparent_42%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>

          <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-amber-400/25 bg-amber-400/10 py-2 pl-3 pr-6 shadow-[0_0_22px_rgba(251,191,36,0.10)]">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-100/70">
                {t.badge}
              </p>
              <p className="font-semibold text-amber-50">{t.thrust}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            {[
              { label: t.stat1, value: t.stat1Value },
              { label: t.stat2, value: t.stat2Value },
              { label: t.stat3, value: t.stat3Value },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full">
          <ShkadovCanvas lang={lang} />
        </div>
      </div>
    </section>
  );
}
