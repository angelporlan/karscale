import React, { useEffect, useRef, useState } from "react";

const copy = {
  es: {
    eyebrow: "Civilizacion Tipo II · Kardashov",
    title: "Esfera de Dyson",
    description:
      "Megaestructura hipotetica que rodea una estrella para capturar casi toda su energia radiante y convertirla en infraestructura util para una civilizacion avanzada.",
    badge: "Captura energetica activa",
    modes: {
      shell: "Esfera completa",
      swarm: "Enjambre",
      ring: "Anillo",
    },
    stats: {
      energy: "Energia captada",
      satellites: "Satelites activos",
      coverage: "Cobertura",
      temperature: "Temperatura panel",
    },
  },
  en: {
    eyebrow: "Type II Civilization · Kardashev",
    title: "Dyson Sphere",
    description:
      "A hypothetical megastructure built around a star to harvest nearly all of its radiant output and turn stellar power into usable infrastructure.",
    badge: "Active energy capture",
    modes: {
      shell: "Full shell",
      swarm: "Swarm",
      ring: "Ring",
    },
    stats: {
      energy: "Energy captured",
      satellites: "Active satellites",
      coverage: "Coverage",
      temperature: "Panel temperature",
    },
  },
} as const;

type Lang = keyof typeof copy;
type Mode = "shell" | "swarm" | "ring";

type Props = {
  lang?: Lang;
};

type ShellSat = {
  kind: "shell";
  nx: number;
  ny: number;
  nz: number;
  size: number;
};

type SwarmSat = {
  kind: "swarm";
  lat: number;
  lon: number;
  rFactor: number;
  speed: number;
  size: number;
};

type RingSat = {
  kind: "ring";
  phase: number;
  tilt: number;
  rFactor: number;
  speed: number;
  size: number;
};

type Sat = ShellSat | SwarmSat | RingSat;

type ProjectedSat = {
  sat: Sat;
  sx: number;
  sy: number;
  z: number;
};

const MODE_STATS: Record<
  Mode,
  { energy: string; coverage: string; temperature: string }
> = {
  shell: {
    energy: "3.8 × 10^26 W",
    coverage: "99.8%",
    temperature: "~300 K",
  },
  swarm: {
    energy: "1.2 × 10^26 W",
    coverage: "68.4%",
    temperature: "~340 K",
  },
  ring: {
    energy: "6.4 × 10^25 W",
    coverage: "22.1%",
    temperature: "~480 K",
  },
};

function createShellSats(count: number): Sat[] {
  const sats: Sat[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;

    sats.push({
      kind: "shell",
      nx: r * Math.cos(theta),
      ny: y,
      nz: r * Math.sin(theta),
      size: 3.5 + Math.random() * 2,
    });
  }

  return sats;
}

function createSwarmSats(count: number): Sat[] {
  const sats: Sat[] = [];

  for (let i = 0; i < count; i += 1) {
    sats.push({
      kind: "swarm",
      lat: (Math.random() - 0.5) * Math.PI,
      lon: Math.random() * Math.PI * 2,
      rFactor: 0.85 + Math.random() * 0.3,
      speed: 0.08 + Math.random() * 0.18,
      size: 2 + Math.random() * 3,
    });
  }

  return sats;
}

function createRingSats(): Sat[] {
  const ringDefs = [
    { count: 60, tilt: 0, r: 1, speed: 0.22 },
    { count: 48, tilt: Math.PI / 3, r: 1, speed: -0.18 },
    { count: 40, tilt: -Math.PI / 4, r: 1, speed: 0.26 },
  ];

  return ringDefs.flatMap((definition) =>
    Array.from({ length: definition.count }, (_, index) => ({
      kind: "ring" as const,
      phase: (index / definition.count) * Math.PI * 2,
      tilt: definition.tilt,
      rFactor: definition.r,
      speed: definition.speed,
      size: 3.5,
    })),
  );
}

function createSats(mode: Mode): Sat[] {
  if (mode === "shell") return createShellSats(180);
  if (mode === "swarm") return createSwarmSats(220);
  return createRingSats();
}

function getSatPosition(sat: Sat, time: number) {
  if (sat.kind === "shell") {
    return { nx: sat.nx, ny: sat.ny, nz: sat.nz, size: sat.size };
  }

  if (sat.kind === "swarm") {
    const lon = sat.lon + time * sat.speed;
    return {
      nx: Math.cos(sat.lat) * Math.cos(lon) * sat.rFactor,
      ny: Math.sin(sat.lat) * sat.rFactor,
      nz: Math.cos(sat.lat) * Math.sin(lon) * sat.rFactor,
      size: sat.size,
    };
  }

  const angle = sat.phase + time * sat.speed;
  const rx = Math.cos(angle);
  const rz = Math.sin(angle);
  const ct = Math.cos(sat.tilt);
  const st = Math.sin(sat.tilt);

  return {
    nx: rx,
    ny: -rz * st,
    nz: rz * ct * sat.rFactor,
    size: sat.size,
  };
}

function drawSatellite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = "#1a1e30";
  ctx.strokeStyle = "rgba(100,120,200,0.6)";
  ctx.lineWidth = 0.5;
  ctx.fillRect(x - size * 1.4, y - size * 0.5, size * 2.8, size);
  ctx.strokeRect(x - size * 1.4, y - size * 0.5, size * 2.8, size);

  for (let i = 0; i < 4; i += 1) {
    const px = x - size * 1.4 + (size * 2.8 * i) / 4;
    ctx.beginPath();
    ctx.moveTo(px, y - size * 0.5);
    ctx.lineTo(px, y + size * 0.5);
    ctx.strokeStyle = "rgba(80,100,180,0.35)";
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }

  const panelGradient = ctx.createLinearGradient(
    x - size * 1.4,
    y,
    x + size * 1.4,
    y,
  );
  panelGradient.addColorStop(0, "rgba(40,80,180,0.55)");
  panelGradient.addColorStop(0.5, "rgba(80,140,255,0.45)");
  panelGradient.addColorStop(1, "rgba(40,80,180,0.55)");
  ctx.fillStyle = panelGradient;
  ctx.fillRect(x - size * 1.4, y - size * 0.5, size * 2.8, size);

  ctx.fillStyle = "#2a2e44";
  ctx.fillRect(x - size * 0.4, y - size * 0.7, size * 0.8, size * 1.4);
  ctx.strokeStyle = "rgba(180,200,255,0.4)";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(x - size * 0.4, y - size * 0.7, size * 0.8, size * 1.4);

  ctx.globalAlpha = alpha * 0.3;
  ctx.fillStyle = "#aaddff";
  ctx.fillRect(x - size * 1.3, y - size * 0.4, size * 0.6, size * 0.15);
  ctx.restore();
}

export default function DysonSphereVisual({ lang = "es" }: Props) {
  const t = copy[lang] ?? copy.es;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef(0);
  const satsRef = useRef<Sat[]>(createSats("shell"));
  const [mode, setMode] = useState<Mode>("shell");

  useEffect(() => {
    satsRef.current = createSats(mode);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth || 960;
      const height = Math.round(width * 0.62);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (
      nx: number,
      ny: number,
      nz: number,
      width: number,
      height: number,
      time: number,
    ) => {
      const cx = width / 2;
      const cy = height / 2;
      const orbitR = Math.min(width, height) * 0.38;
      const rotY = time * 0.35;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const tiltX = 0.42;
      const cosTX = Math.cos(tiltX);
      const sinTX = Math.sin(tiltX);

      const x1 = nx * cosY + nz * sinY;
      const z1 = -nx * sinY + nz * cosY;
      const y2 = ny * cosTX - z1 * sinTX;
      const z2 = ny * sinTX + z1 * cosTX;

      return {
        sx: cx + x1 * orbitR,
        sy: cy + y2 * orbitR,
        z: z2,
      };
    };

    const drawFrame = (now: number) => {
      if (!startRef.current) {
        startRef.current = now;
      }

      const elapsed = (now - startRef.current) / 1000;
      const width = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const height = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));
      const cx = width / 2;
      const cy = height / 2;
      const orbitR = Math.min(width, height) * 0.38;
      const sunR = Math.min(width, height) * 0.11;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.75);
      bg.addColorStop(0, "rgba(30,15,5,0.6)");
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 80; i += 1) {
        const sx = (((i * 137.5) % 1000) / 1000) * width;
        const sy = ((((i * 89.7) + 300) % 1000) / 1000) * height;
        const sr = 0.5 + ((((i * 43.1) % 100) / 100) * 0.8);
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.restore();

      if (mode === "shell") {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitR, orbitR * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,200,60,0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      const projected = satsRef.current.map((sat) => {
        const position = getSatPosition(sat, elapsed);
        const projection = project(
          position.nx,
          position.ny,
          position.nz,
          width,
          height,
          elapsed,
        );

        return {
          sat,
          sx: projection.sx,
          sy: projection.sy,
          z: projection.z,
          size: position.size,
        };
      });

      const backSats = projected.filter((item) => item.z < 0);
      const frontSats = projected.filter((item) => item.z >= 0);

      backSats.forEach((item) => {
        const depth = (item.z + 1) / 2;
        const alpha = 0.12 + depth * 0.25;
        drawSatellite(
          ctx,
          item.sx,
          item.sy,
          item.size * (0.7 + depth * 0.3),
          alpha,
        );
      });

      const sunGlowBack = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 2.8);
      sunGlowBack.addColorStop(0, "rgba(255,220,80,0.22)");
      sunGlowBack.addColorStop(1, "rgba(255,100,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = sunGlowBack;
      ctx.fill();

      const sunGradient = ctx.createRadialGradient(
        cx - sunR * 0.25,
        cy - sunR * 0.2,
        0,
        cx,
        cy,
        sunR,
      );
      sunGradient.addColorStop(0, "#fff9d0");
      sunGradient.addColorStop(0.35, "#ffe566");
      sunGradient.addColorStop(0.72, "#ffa500");
      sunGradient.addColorStop(1, "rgba(255,80,0,0.7)");
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fillStyle = sunGradient;
      ctx.fill();

      const pulse = 1 + Math.sin(elapsed * 3.1) * 0.03;
      const corona = ctx.createRadialGradient(
        cx,
        cy,
        sunR * 0.7,
        cx,
        cy,
        sunR * 2 * pulse,
      );
      corona.addColorStop(0, "rgba(255,200,60,0.18)");
      corona.addColorStop(1, "rgba(255,120,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 2 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      frontSats.forEach((item) => {
        const dx = cx - item.sx;
        const dy = cy - item.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) return;

        const alpha = 0.04 + 0.06 * Math.abs(Math.sin(elapsed * 2 + item.sx));
        const beam = ctx.createLinearGradient(item.sx, item.sy, cx, cy);
        beam.addColorStop(0, "rgba(255,220,80,0)");
        beam.addColorStop(0.4, `rgba(255,200,60,${alpha})`);
        beam.addColorStop(1, `rgba(255,255,200,${alpha * 0.5})`);
        ctx.beginPath();
        ctx.moveTo(item.sx, item.sy);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = beam;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      frontSats.forEach((item) => {
        const depth = (item.z + 1) / 2;
        const alpha = 0.5 + depth * 0.5;
        drawSatellite(
          ctx,
          item.sx,
          item.sy,
          item.size * (0.8 + depth * 0.2),
          alpha,
        );
      });

      frameRef.current = requestAnimationFrame(drawFrame);
    };

    resize();
    frameRef.current = requestAnimationFrame(drawFrame);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  const stats = MODE_STATS[mode];

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[#02040a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,180,0,0.08),transparent_52%),radial-gradient(ellipse_at_bottom_right,rgba(96,165,250,0.08),transparent_46%)]" />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative px-6 pb-4 pt-6 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-400/80">
          {t.eyebrow}
        </p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          {t.description}
        </p>

        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-300/70" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-amber-400" />
          </span>
          <span className="text-xs text-amber-100">{t.badge}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {(["shell", "swarm", "ring"] as Mode[]).map((entry) => (
            <button
              key={entry}
              type="button"
              onClick={() => setMode(entry)}
              className={`rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
                mode === entry
                  ? "border-amber-400/40 bg-amber-500/15 text-amber-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {t.modes[entry]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative border-y border-white/5">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ height: "auto", minHeight: 320 }}
        />
      </div>

      <div className="relative bg-white/[0.03] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex min-w-[160px] flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/55">
              {t.stats.energy}
            </span>
            <span className="text-[15px] font-medium text-white">
              {stats.energy}
            </span>
          </div>
          <div className="flex min-w-[160px] flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/55">
              {t.stats.satellites}
            </span>
            <span className="text-[15px] font-medium text-white">
              {satsRef.current.length.toLocaleString()}
            </span>
          </div>
          <div className="flex min-w-[160px] flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/55">
              {t.stats.coverage}
            </span>
            <span className="text-[15px] font-medium text-white">
              {stats.coverage}
            </span>
          </div>
          <div className="flex min-w-[160px] flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/55">
              {t.stats.temperature}
            </span>
            <span className="text-[15px] font-medium text-white">
              {stats.temperature}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
