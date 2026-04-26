import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomInt } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, 'queue.json');
const CONTENT_ROOT = path.join(ROOT, 'src', 'content', 'blog');
const VISUALS_ROOT = path.join(ROOT, 'src', 'components', 'visuals');
const execFileAsync = promisify(execFile);

const CATEGORY_IMAGES = {
  ai: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop',
  kardashev: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1400&auto=format&fit=crop',
  cosmos: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1400&auto=format&fit=crop',
  theories: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1400&auto=format&fit=crop',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
};

const ENFORCE_MADRID_19 =
  process.env.ENFORCE_MADRID_19 === '1' ||
  process.argv.includes('--madrid-time-only');
const SKIP_GIT = process.argv.includes('--no-git');
const requestedSlug = readArg('--slug');
const requestedTopic = readArg('--topic');

function readArg(name) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length).trim() : '';
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugToPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function humanize(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((segment) => {
      const lower = segment.toLowerCase();

      if (lower === 'ai') return 'AI';
      if (lower === 'agi') return 'AGI';
      if (lower === 'asi') return 'ASI';
      if (lower === 'llm' || lower === 'llms') return 'LLMs';
      if (lower === 'type') return 'Type';

      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(' ');
}

function humanizeTopic(value) {
  return value
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFileSlug(item) {
  return normalizeSlug(String(item.slugEn ?? item.slug ?? ''));
}

function getComponentName(item, fileSlug) {
  return String(item.componentNameEn ?? '').trim() || `${slugToPascalCase(fileSlug)}Visual`;
}

function getLocalizedTitle(item, lang) {
  if (lang === 'es') {
    return String(item.titleEs ?? item.title ?? item.topic ?? '').trim();
  }

  return String(item.titleEn ?? item.title ?? item.topic ?? '').trim();
}

function formatTags(tags) {
  return `[${tags.map((tag) => JSON.stringify(tag)).join(', ')}]`;
}

function asJson(value) {
  return JSON.stringify(value);
}

function getMadridDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function getMadridHour() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00';
  return Number(hour);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readQueue() {
  const raw = await readFile(QUEUE_PATH, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error('queue.json must contain an array of topics.');
  }

  return data;
}

async function writeQueue(queue) {
  await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
}

async function runGit(args) {
  return execFileAsync('git', args, { cwd: ROOT });
}

async function commitAndPush(message) {
  if (SKIP_GIT) {
    return;
  }

  await runGit(['add', 'queue.json', 'src/content/blog', 'src/components/visuals']);
  await runGit(['commit', '-m', message]);

  const { stdout } = await runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  const branch = stdout.trim();

  if (!branch || branch === 'HEAD') {
    throw new Error('Could not determine the current git branch for push.');
  }

  await runGit(['push', 'origin', branch]);
}

function buildImageUrl(category) {
  return CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES.theories;
}

function buildDescriptions(title, categoryLabel, subcategoryLabel) {
  return {
    es: `Una primera lectura de ${title} desde ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}.`,
    en: `A first reading of ${title} through ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}.`,
  };
}

function buildBody({ lang, title, categoryLabel, subcategoryLabel }) {
  const intro =
    lang === 'es'
      ? `Hoy abrimos una nueva ficha de la bitacora: ${title}. Esta pieza vive en ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}, justo donde la tecnologia extrema se cruza con la cosmologia, la filosofia y la pregunta de fondo sobre que clase de civilizacion queremos ser.`
      : `Today we open a new log entry: ${title}. This piece lives in ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}, right where extreme technology meets cosmology, philosophy, and the deeper question of what kind of civilization we intend to become.`;

  const calloutTitle = lang === 'es' ? 'Hipotesis de trabajo' : 'Working hypothesis';
  const calloutBody =
    lang === 'es'
      ? 'Este borrador esta pensado para crecer con datos, analogias rigurosas y una postura editorial clara. La meta es dejar una pieza util hoy y escalable para futuras actualizaciones.'
      : 'This draft is designed to grow with data, rigorous analogies, and a clear editorial stance. The goal is to leave behind a piece that is useful today and easy to expand later.';

  const sectionOneTitle = lang === 'es' ? 'Por que importa' : 'Why it matters';
  const sectionOneBody =
    lang === 'es'
      ? `El valor de ${title} no esta solo en el dato tecnico. Esta en su capacidad para reorganizar nuestra idea de escala, riesgo y posibilidad. Cuando un tema toca la frontera de la IA, la energia o el destino cosmico, cambia la forma en que pensamos el futuro.`
      : `The value of ${title} is not just technical. It lies in its power to reorganize how we think about scale, risk, and possibility. When a topic touches the frontier of AI, energy, or cosmic destiny, it changes the way we imagine the future.`;

  const sectionTwoTitle = lang === 'es' ? 'Lo que sabemos hoy' : 'What we know today';
  const sectionTwoBody =
    lang === 'es'
      ? `La lectura inicial debe distinguir entre evidencia dura, hipotesis de trabajo y especulacion honesta. En esta entrada conviene dejar claro que parte del argumento esta apoyada en hechos verificables y que parte depende de extrapolar tendencias actuales.`
      : 'The first pass should separate hard evidence, working hypotheses, and honest speculation. In this entry, it helps to make explicit which parts of the argument rest on verifiable facts and which parts depend on extrapolating current trends.';

  const sectionThreeTitle = lang === 'es' ? 'La pregunta abierta' : 'The open question';
  const sectionThreeBody =
    lang === 'es'
      ? 'Toda entrada fuerte en esta bitacora deberia cerrar con una pregunta que no sea decorativa: que limite estamos cerca de cruzar, que filtro estamos intentando superar o que tipo de civilizacion emerge si la tendencia se mantiene.'
      : 'Every strong entry in this log should close with a question that is not decorative: what boundary are we nearing, what filter are we trying to cross, or what sort of civilization emerges if the trend continues?';

  const closing =
    lang === 'es'
      ? 'Ese es el verdadero valor de esta serie: no describir el futuro como una fantasía, sino como una hipotesis operacional sobre la que todavia podemos intervenir.'
      : 'That is the true value of this series: not to describe the future as fantasy, but as an operational hypothesis we can still intervene in.';

  return `
${intro}

<div className="signal-callout">
  <h3>${calloutTitle}</h3>
  <p>${calloutBody}</p>
</div>

## ${sectionOneTitle}

${sectionOneBody}

## ${sectionTwoTitle}

${sectionTwoBody}

## ${sectionThreeTitle}

${sectionThreeBody}

${closing}
`.trim();
}

function buildMdxDocument({ lang, item, pubDate, componentName, imageUrl }) {
  const categoryLabel = humanize(item.category);
  const subcategoryLabel = humanize(item.subcategory);
  const title = getLocalizedTitle(item, lang) || humanizeTopic(item.topic);
  const descriptions = buildDescriptions(title, categoryLabel, subcategoryLabel);
  const body = buildBody({
    lang,
    title,
    categoryLabel,
    subcategoryLabel,
  });
  const buttonText = lang === 'es' ? 'LEER TRANSMISION' : 'READ TRANSMISSION';
  const tags = Array.from(
    new Set([item.category, item.subcategory, getFileSlug(item)]),
  );
  const importPath = path
    .relative(
      path.join(CONTENT_ROOT, lang, item.category, item.subcategory),
      path.join(VISUALS_ROOT, `${componentName}.tsx`),
    )
    .split(path.sep)
    .join('/');

  return `---
title: ${asJson(title)}
lang: ${asJson(lang)}
pubDate: ${pubDate}
description: ${asJson(descriptions[lang])}
buttonText: ${asJson(buttonText)}
imageUrl: ${asJson(imageUrl)}
tags: ${formatTags(tags)}
translationId: ${asJson(item.translationId ?? getFileSlug(item))}
category: ${asJson(item.category)}
subcategory: ${asJson(item.subcategory)}
---

import ${componentName} from '${importPath}';

<${componentName} client:visible lang=${asJson(lang)} />

${body}
`;
}

function buildVisualComponent({ componentName, item }) {
  const title = String(item.titleEs ?? item.topic ?? '').trim();
  const categoryLabel = humanize(item.category);
  const subcategoryLabel = humanize(item.subcategory);
  const scanKeyframes = JSON.stringify(`
              @keyframes scan {
                0% { transform: translateY(-80%); }
                100% { transform: translateY(420%); }
              }
            `);
  const copy = {
    es: {
      eyebrow: `Archivo ${categoryLabel}`,
      title,
      description: `Una visual animada para leer ${title} desde ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}.`,
      badge: 'Escaneo activo',
      metricA: 'Señal',
      metricB: 'Escala',
      metricC: 'Horizonte',
      metricAValue: '1.0x',
      metricBValue: categoryLabel,
      metricCValue: subcategoryLabel || 'General',
    },
    en: {
      eyebrow: `${categoryLabel} archive`,
      title,
      description: `An animated visual for reading ${title} through ${categoryLabel}${subcategoryLabel ? ` / ${subcategoryLabel}` : ''}.`,
      badge: 'Active scan',
      metricA: 'Signal',
      metricB: 'Scale',
      metricC: 'Horizon',
      metricAValue: '1.0x',
      metricBValue: categoryLabel,
      metricCValue: subcategoryLabel || 'General',
    },
  };

  return `import React, { useEffect, useState } from "react";

const copy = ${JSON.stringify(copy, null, 2)} as const;

type Lang = "es" | "en";

type Particle = {
  id: number;
  top: string;
  left: string;
  opacity: number;
  size: "small" | "medium";
  delay: string;
};

const rings = ["inset-0", "inset-[10%]", "inset-[22%]", "inset-[34%]"];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    top: (Math.random() * 100).toFixed(2) + "%",
    left: (Math.random() * 100).toFixed(2) + "%",
    opacity: 0.2 + Math.random() * 0.55,
    size: Math.random() > 0.78 ? "medium" : "small",
    delay: (Math.random() * 4).toFixed(2) + "s",
  }));
}

export default function ${componentName}({ lang = "es" }: { lang?: Lang }) {
  const t = copy[lang] ?? copy.es;
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(buildParticles(120));
  }, []);

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,#050816,#02040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-sky-300/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.26em] text-slate-300">
          {t.badge}
        </div>
      </div>

      <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.22),transparent_38%)]" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15 animate-[spin_28s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/15 animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_36px_rgba(103,232,249,0.9)]" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 animate-[pulse_3s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[pulse_6s_ease-in-out_infinite]" />

        {rings.map((ring, index) => (
          <div
            key={ring}
            className={
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border " +
              (index % 2 === 0 ? "border-cyan-300/10" : "border-fuchsia-300/10") +
              " " +
              ring
            }
          />
        ))}

        {particles.map((particle) => (
          <span
            key={particle.id}
            className={
              "absolute rounded-full bg-white " +
              (particle.size === "medium" ? "h-1.5 w-1.5" : "h-[3px] w-[3px]") +
              " animate-[pulse_2.5s_ease-in-out_infinite]"
            }
            style={{
              top: particle.top,
              left: particle.left,
              opacity: particle.opacity,
              animationDelay: particle.delay,
            }}
          />
        ))}

        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute inset-x-0 top-[18%] h-24 animate-[scan_7s_ease-in-out_infinite_alternate] bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        <style
          dangerouslySetInnerHTML={{
            __html: ${scanKeyframes},
          }}
        />
      </div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricA}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricAValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricB}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricBValue}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
            {t.metricC}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t.metricCValue}</p>
        </div>
      </div>
    </section>
  );
}
`;
}

function selectQueueItem(queue) {
  if (queue.length === 0) {
    return null;
  }

  const normalizedSlug = requestedSlug ? normalizeSlug(requestedSlug) : '';
  const normalizedTopic = requestedTopic ? requestedTopic.toLowerCase().trim() : '';
  const candidates = queue.filter((item) => {
      if (!item || typeof item !== 'object') {
        return false;
      }

      if (normalizedSlug && normalizeSlug(String(item.slug ?? '')) !== normalizedSlug) {
        return false;
      }

      if (
        normalizedTopic &&
        !String(item.topic ?? '').toLowerCase().includes(normalizedTopic)
      ) {
        return false;
      }

      return true;
    });

  const pool = candidates.length > 0 ? candidates : queue;

  if (pool.length === 0) {
    return null;
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function validateItem(item) {
  if (!item || typeof item !== 'object') {
    return false;
  }

  return (
    typeof item.topic === 'string' &&
    typeof item.category === 'string' &&
    typeof item.subcategory === 'string' &&
    typeof item.slug === 'string'
  );
}

function removeQueueItem(queue, item) {
  const index = queue.findIndex(
    (entry) =>
      validateItem(entry) &&
      entry.slug === item.slug &&
      entry.topic === item.topic &&
      entry.category === item.category &&
      entry.subcategory === item.subcategory,
  );

  if (index >= 0) {
    queue.splice(index, 1);
    return true;
  }

  return false;
}

async function main() {
  if (ENFORCE_MADRID_19 && getMadridHour() !== 19) {
    console.log('Skipping post generation because it is not 19:00 in Europe/Madrid.');
    return;
  }

  const queue = await readQueue();
  const pool = selectQueueItem(queue);

  if (!pool || pool.length === 0) {
    throw new Error('No queued topics available.');
  }

  let selected = null;
  for (const candidate of pool) {
    const item = candidate;

    if (!validateItem(item)) {
      continue;
    }

    const fileSlug = getFileSlug(item);
    const componentName = getComponentName(item, fileSlug);
    const pubDate = getMadridDate();
    const imageUrl = buildImageUrl(item.category);
    const esDir = path.join(CONTENT_ROOT, 'es', item.category, item.subcategory);
    const enDir = path.join(CONTENT_ROOT, 'en', item.category, item.subcategory);
    const componentPath = path.join(VISUALS_ROOT, `${componentName}.tsx`);
    const esPath = path.join(esDir, `${fileSlug}.mdx`);
    const enPath = path.join(enDir, `${fileSlug}.mdx`);

    const existingResults = await Promise.all(
      [componentPath, esPath, enPath].map((filePath) => fileExists(filePath)),
    );

    if (existingResults.every(Boolean)) {
      removeQueueItem(queue, item);
      continue;
    }

    if (existingResults.some(Boolean)) {
      throw new Error(
        `Refusing to overwrite existing files for ${fileSlug}.\n` +
          [componentPath, esPath, enPath]
            .filter((_, index) => existingResults[index])
            .join('\n'),
      );
    }

    await mkdir(esDir, { recursive: true });
    await mkdir(enDir, { recursive: true });
    await mkdir(VISUALS_ROOT, { recursive: true });

    const visual = buildVisualComponent({ componentName, item });
    const spanish = buildMdxDocument({
      lang: 'es',
      item,
      pubDate,
      componentName,
      imageUrl,
    });
    const english = buildMdxDocument({
      lang: 'en',
      item,
      pubDate,
      componentName,
      imageUrl,
    });

    await writeFile(componentPath, `${visual.trim()}\n`, 'utf8');
    await writeFile(esPath, `${spanish.trim()}\n`, 'utf8');
    await writeFile(enPath, `${english.trim()}\n`, 'utf8');

    removeQueueItem(queue, item);
    await writeQueue(queue);

    selected = {
      item,
      componentName,
      componentPath,
      esPath,
      enPath,
    };
    break;
  }

  if (!selected) {
    throw new Error(
      'No available topic could be written. The queue may be empty or all candidates already exist.',
    );
  }

  const commitMessage = `Add daily post scaffold for ${selected.item.slug}`;
  await commitAndPush(commitMessage);

  console.log(`Created post from queue item: ${selected.item.topic}`);
  console.log(`- ${path.relative(ROOT, selected.esPath)}`);
  console.log(`- ${path.relative(ROOT, selected.enPath)}`);
  console.log(`- ${path.relative(ROOT, selected.componentPath)}`);
  if (SKIP_GIT) {
    console.log('Git skipped because --no-git was provided.');
  } else {
    console.log(`Committed and pushed with message: "${commitMessage}"`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
