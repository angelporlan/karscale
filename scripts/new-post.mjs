import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { mkdir, writeFile, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src', 'content', 'blog');
const VISUALS_ROOT = path.join(ROOT, 'src', 'components', 'visuals');
const execFileAsync = promisify(execFile);

function slugToPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSegment(value, fallback) {
  const normalized = normalizeSlug(value);
  return normalized || fallback;
}

function parseTags(value, fallback) {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return tags.length > 0 ? tags : fallback;
}

function formatTags(tags) {
  return `[${tags.map((tag) => `"${tag}"`).join(', ')}]`;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runGit(args) {
  return execFileAsync('git', args, { cwd: ROOT });
}

async function commitAndPush(files) {
  const relativeFiles = files.map((filePath) => path.relative(ROOT, filePath));

  await runGit(['add', ...relativeFiles]);
  await runGit(['commit', '-m', 'new post']);

  const { stdout } = await runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  const branch = stdout.trim();

  if (!branch || branch === 'HEAD') {
    throw new Error('Could not determine the current git branch for push.');
  }

  await runGit(['push', 'origin', branch]);
}

function buildMdxTemplate({
  lang,
  title,
  date,
  description,
  buttonText,
  imageUrl,
  tags,
  translationId,
  componentName,
  componentImportPath,
  intro,
  sectionHeading,
  sectionBody,
}) {
  return `---
title: "${title}"
lang: "${lang}"
pubDate: ${date}
description: "${description}"
buttonText: "${buttonText}"
imageUrl: "${imageUrl}"
tags: ${formatTags(tags)}
translationId: "${translationId}"
---

import ${componentName} from '${componentImportPath}';

<${componentName} client:visible lang="${lang}" />

${intro}

## ${sectionHeading}

${sectionBody}
`;
}

function buildVisualTemplate(componentName) {
  return `import React from "react";

const copy = {
  es: {
    eyebrow: "Visual interactiva",
    title: "Titulo de la animacion",
    description: "Resume aqui el concepto principal en espanol.",
    statLabel: "Dato clave",
    statValue: "42%",
  },
  en: {
    eyebrow: "Interactive visual",
    title: "Animation title",
    description: "Summarize the main concept here in English.",
    statLabel: "Key stat",
    statValue: "42%",
  },
} as const;

type Props = {
  lang?: keyof typeof copy;
};

export default function ${componentName}({ lang = "es" }: Props) {
  const t = copy[lang] ?? copy.es;

  return (
    <section className="relative my-14 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),linear-gradient(180deg,#050816,#02040a)] px-6 py-8 sm:px-8">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[12%] top-[18%] h-24 w-24 animate-[pulse_4s_ease-in-out_infinite] rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="absolute right-[10%] top-[22%] h-32 w-32 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute inset-x-6 bottom-10 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
      </div>

      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">
            {t.eyebrow}
          </p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {t.description}
          </p>
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center">
          <div className="absolute h-full w-full rounded-full border border-cyan-300/20 animate-[spin_18s_linear_infinite]" />
          <div className="absolute h-[78%] w-[78%] rounded-full border border-fuchsia-300/20 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute h-5 w-5 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.9)]" />
          <div className="absolute h-[55%] w-[55%] rounded-full border border-dashed border-white/20" />
        </div>
      </div>

      <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">
          {t.statLabel}
        </p>
        <p className="mt-3 text-2xl font-semibold text-cyan-200">{t.statValue}</p>
      </div>
    </section>
  );
}
`;
}

async function main() {
  const rl = createInterface({ input, output });

  try {
    const rawSlug = await rl.question('Post slug (example: black-hole-entropy): ');
    const slug = normalizeSlug(rawSlug);

    if (!slug) {
      throw new Error('A slug is required.');
    }

    const category = normalizeSegment(
      await rl.question('Category [theories]: '),
      'theories',
    );
    const subcategory = normalizeSegment(
      await rl.question('Subcategory [general]: '),
      'general',
    );
    const defaultComponentName = `${slugToPascalCase(slug)}Visual`;
    const componentName =
      (await rl.question(`Visual component name [${defaultComponentName}]: `)).trim() ||
      defaultComponentName;
    const date =
      (await rl.question(`Publish date [${new Date().toISOString().slice(0, 10)}]: `)).trim() ||
      new Date().toISOString().slice(0, 10);

    const titleEs = (await rl.question('Spanish title: ')).trim() || slug;
    const titleEn = (await rl.question('English title: ')).trim() || titleEs;
    const descriptionEs =
      (await rl.question('Spanish description: ')).trim() ||
      'Escribe aqui una descripcion breve del post.';
    const descriptionEn =
      (await rl.question('English description: ')).trim() ||
      'Write a short description for this post.';
    const imageUrl =
      (await rl.question('Hero image URL [https://images.unsplash.com/...]: ')).trim() ||
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop';

    const tagsEs = parseTags(await rl.question('Spanish tags (comma separated) [space, cosmos]: '), [
      'space',
      'cosmos',
    ]);
    const tagsEn = parseTags(await rl.question('English tags (comma separated) [space, cosmos]: '), [
      'space',
      'cosmos',
    ]);

    const baseDirEs = path.join(CONTENT_ROOT, 'es', category, subcategory);
    const baseDirEn = path.join(CONTENT_ROOT, 'en', category, subcategory);
    const fileEs = path.join(baseDirEs, `${slug}.mdx`);
    const fileEn = path.join(baseDirEn, `${slug}.mdx`);
    const componentFile = path.join(VISUALS_ROOT, `${componentName}.tsx`);

    const alreadyExists = [];
    if (await exists(fileEs)) alreadyExists.push(fileEs);
    if (await exists(fileEn)) alreadyExists.push(fileEn);
    if (await exists(componentFile)) alreadyExists.push(componentFile);

    if (alreadyExists.length > 0) {
      throw new Error(`Refusing to overwrite existing files:\n- ${alreadyExists.join('\n- ')}`);
    }

    await mkdir(baseDirEs, { recursive: true });
    await mkdir(baseDirEn, { recursive: true });
    await mkdir(VISUALS_ROOT, { recursive: true });

    const importPath = '../../../../../components/visuals/' + `${componentName}.tsx`;

    await writeFile(
      fileEs,
      buildMdxTemplate({
        lang: 'es',
        title: titleEs,
        date,
        description: descriptionEs,
        buttonText: 'LEER TRANSMISION',
        imageUrl,
        tags: tagsEs,
        translationId: slug,
        componentName,
        componentImportPath: importPath,
        intro: 'Escribe aqui la apertura del articulo en espanol.',
        sectionHeading: 'Idea central',
        sectionBody: 'Desarrolla aqui el primer bloque del post.',
      }),
      'utf8',
    );

    await writeFile(
      fileEn,
      buildMdxTemplate({
        lang: 'en',
        title: titleEn,
        date,
        description: descriptionEn,
        buttonText: 'READ TRANSMISSION',
        imageUrl,
        tags: tagsEn,
        translationId: slug,
        componentName,
        componentImportPath: importPath,
        intro: 'Write the article opening in English here.',
        sectionHeading: 'Core idea',
        sectionBody: 'Develop the first section of the post here.',
      }),
      'utf8',
    );

    await writeFile(componentFile, buildVisualTemplate(componentName), 'utf8');

    await commitAndPush([fileEs, fileEn, componentFile]);

    console.log('\nCreated:');
    console.log(`- ${path.relative(ROOT, fileEs)}`);
    console.log(`- ${path.relative(ROOT, fileEn)}`);
    console.log(`- ${path.relative(ROOT, componentFile)}`);
    console.log('\nGit: committed with message "new post" and pushed to the current branch.');
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});
