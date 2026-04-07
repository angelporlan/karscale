import type { APIRoute } from "astro";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

export const prerender = false;
export const maxDuration = 300;

const AI_ENDPOINT = "http://localhost:3000/ask";
const CONTENT_ROOT = path.join(process.cwd(), "src", "content", "blog");
const VISUALS_ROOT = path.join(process.cwd(), "src", "components", "visuals");
const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop";
const DEFAULT_FREE_MODELS = [
  "stepfun/step-3.5-flash:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "arcee-ai/trinity-large-preview:free",
  "z-ai/glm-4.5-air:free",
  "minimax/minimax-m2.5:free",
  "openai/gpt-4o-mini",
] as const;

type GeneratePostRequest = {
  topic?: string;
  category?: string;
  subcategory?: string;
  slug?: string;
  model?: string;
  imageUrl?: string;
  translationId?: string;
  tagsEs?: string[];
  tagsEn?: string[];
};

type AiAskResponse = {
  ok?: boolean;
  model?: string;
  prompt?: string;
  response?: string;
};

type NormalizedMdxOptions = {
  rawContent: string;
  lang: "es" | "en";
  topic: string;
  pubDate: string;
  imageUrl: string;
  translationId: string;
  buttonText: string;
  fallbackTags: string[];
  componentName: string;
};

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugToPascalCase = (value: string) =>
  value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

const normalizeSegment = (value: string, fallback: string) => {
  const normalized = normalizeSlug(value);
  return normalized || fallback;
};

const sanitizeAiText = (value: string) => {
  let cleanText = value.trim();

  if (cleanText.startsWith("```")) {
    const lines = cleanText.split(/\r?\n/);
    lines.shift();
    if (lines.at(-1)?.startsWith("```")) {
      lines.pop();
    }
    cleanText = lines.join("\n").trim();
  }

  return cleanText;
};

const extractComponentName = (source: string, fallbackSlug: string) => {
  const matches = [
    source.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/),
    source.match(/function\s+([A-Za-z0-9_]+)\s*\(/),
    source.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/),
  ];

  for (const match of matches) {
    if (match?.[1]) {
      return match[1];
    }
  }

  return `${slugToPascalCase(fallbackSlug)}Visual`;
};

const ensureArrayOfStrings = (value: unknown, fallback: string[]) =>
  Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value.map((item) => item.trim()).filter(Boolean)
    : fallback;

const formatTags = (tags: string[]) =>
  `[${tags.map((tag) => JSON.stringify(tag)).join(", ")}]`;

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const stripFrontmatter = (value: string) =>
  value.replace(/^---[\s\S]*?---\s*/u, "").trim();

const extractQuotedField = (source: string, field: string) => {
  const match = source.match(
    new RegExp(`${field}:\\s*"([^"]+)"`, "i"),
  );
  return match?.[1]?.trim();
};

const extractBareField = (source: string, field: string) => {
  const match = source.match(
    new RegExp(`${field}:\\s*([^\\n\\r]+)`, "i"),
  );
  return match?.[1]?.trim().replace(/^"|"$/g, "");
};

const extractTags = (source: string) => {
  const match = source.match(/tags:\s*\[([^\]]*)\]/i);

  if (!match?.[1]) {
    return [];
  }

  return match[1]
    .split(",")
    .map((tag) => tag.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
};

const toSentenceDescription = (value: string, fallback: string) => {
  const compact = value.replace(/\s+/g, " ").trim();

  if (!compact) {
    return fallback;
  }

  if (compact.length <= 155) {
    return compact;
  }

  const shortened = compact.slice(0, 152).trimEnd();
  return `${shortened}...`;
};

const ensureComponentImport = (
  content: string,
  componentName: string,
  lang: "es" | "en",
) => {
  const importLine = `import ${componentName} from '../../../../../components/visuals/${componentName}.tsx';`;
  const componentLine = `<${componentName} client:visible lang="${lang}" />`;

  let nextContent = content.trim();

  if (!new RegExp(`import\\s+${componentName}\\s+from`).test(nextContent)) {
    nextContent = `${importLine}\n\n${nextContent}`;
  }

  if (!new RegExp(`<${componentName}[\\s>]`).test(nextContent)) {
    const paragraphs = nextContent.split(/\n\s*\n/);

    if (paragraphs.length > 1) {
      paragraphs.splice(2, 0, componentLine);
      nextContent = paragraphs.join("\n\n");
    } else {
      nextContent = `${nextContent}\n\n${componentLine}`;
    }
  }

  return nextContent;
};

const normalizeMdxDocument = ({
  rawContent,
  lang,
  topic,
  pubDate,
  imageUrl,
  translationId,
  buttonText,
  fallbackTags,
  componentName,
}: NormalizedMdxOptions) => {
  const source = sanitizeAiText(rawContent);
  const title =
    extractQuotedField(source, "title") ||
    (lang === "es" ? topic : topic);
  const description =
    extractQuotedField(source, "description") ||
    extractBareField(source, "description") ||
    toSentenceDescription(stripFrontmatter(source).split(/\n\s*\n/)[0] ?? "", topic);
  const tags = extractTags(source);
  const cleanedBody = ensureComponentImport(
    stripFrontmatter(source),
    componentName,
    lang,
  );

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `lang: ${JSON.stringify(lang)}`,
    `pubDate: ${pubDate}`,
    `description: ${JSON.stringify(description)}`,
    `buttonText: ${JSON.stringify(buttonText)}`,
    `imageUrl: ${JSON.stringify(imageUrl)}`,
    `tags: ${formatTags(tags.length > 0 ? tags : fallbackTags)}`,
    `translationId: ${JSON.stringify(translationId)}`,
    "---",
    "",
  ].join("\n");

  return `${frontmatter}${cleanedBody.trim()}\n`;
};

const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const buildComponentPrompt = ({
  topic,
  category,
  subcategory,
  componentName,
}: {
  topic: string;
  category: string;
  subcategory: string;
  componentName: string;
}) => `
Crea un componente React TSX para un blog de astronomia.
Tema: ${topic}
Categoria: ${category}
Subcategoria: ${subcategory}
Nombre obligatorio: ${componentName}

Reglas:
- Devuelve solo codigo TSX valido.
- export default function ${componentName}
- Usa React y Tailwind.
- Incluye copy en es y en.
- Acepta lang?: "es" | "en".
- Sin librerias externas.
- Visual llamativo y listo para Astro.
`.trim();

const buildSpanishPrompt = ({
  topic,
  category,
  subcategory,
  slug,
  componentName,
  imageUrl,
  translationId,
  today,
}: {
  topic: string;
  category: string;
  subcategory: string;
  slug: string;
  componentName: string;
  imageUrl: string;
  translationId: string;
  today: string;
}) => `
Escribe un articulo MDX en espanol.
Tema: ${topic}
Categoria: ${category}
Subcategoria: ${subcategory}
Slug: ${slug}

Reglas:
- Devuelve solo MDX valido.
- Empieza con frontmatter completo.
- pubDate: ${today}
- buttonText: "LEER ANALISIS"
- imageUrl: "${imageUrl}"
- translationId: "${translationId}"
- Incluye tags relevantes en espanol como array JSON.
- Importa exactamente:
import ${componentName} from '../../../../../components/visuals/${componentName}.tsx';
- Despues de la introduccion renderiza exactamente:
<${componentName} client:visible lang="es" />
- Tono divulgativo premium, claro y riguroso.
- Sin imports extra.
`.trim();

const buildEnglishPrompt = ({
  topic,
  category,
  subcategory,
  slug,
  componentName,
  imageUrl,
  translationId,
  today,
}: {
  topic: string;
  category: string;
  subcategory: string;
  slug: string;
  componentName: string;
  imageUrl: string;
  translationId: string;
  today: string;
}) => `
Write an English MDX article.
Topic: ${topic}
Category: ${category}
Subcategory: ${subcategory}
Slug: ${slug}

Rules:
- Return only valid MDX.
- Start with complete frontmatter.
- pubDate: ${today}
- buttonText: "READ ANALYSIS"
- imageUrl: "${imageUrl}"
- translationId: "${translationId}"
- Include relevant English tags as a JSON array.
- Import exactly:
import ${componentName} from '../../../../../components/visuals/${componentName}.tsx';
- After the intro render exactly:
<${componentName} client:visible lang="en" />
- Polished, insightful, editorial tone.
- No extra imports.
`.trim();

async function callLocalAi(
  promptText: string,
  models: string[],
  attempt = 1,
): Promise<string> {
  const token = import.meta.env.OPENROUTER_TOKEN ?? import.meta.env.AI_TOKEN;

  if (!token) {
    throw new Error(
      "Missing OPENROUTER_TOKEN or AI_TOKEN in server environment.",
    );
  }

  let lastError = "Unknown AI error.";

  for (const model of models) {
    const url = new URL(AI_ENDPOINT);
    url.searchParams.set("token", token);
    url.searchParams.set("prompt", promptText);
    url.searchParams.set("model", model);

    const response = await fetch(url.toString());

    if (response.ok) {
      const data = (await response.json()) as AiAskResponse;
      const output = typeof data.response === "string" ? data.response : "";

      if (!output.trim()) {
        throw new Error("AI endpoint returned an empty response.");
      }

      return sanitizeAiText(output);
    }

    const errorText = await response.text();
    lastError = `AI endpoint error ${response.status} with model ${model}: ${errorText}`;

    const retryable =
      response.status === 429 ||
      response.status === 504 ||
      /timed out|timeout|aborted|rate-limited|rate limited|retry shortly/i.test(
        errorText,
      );

    if (!retryable) {
      break;
    }
  }

  if (attempt < 2) {
    await wait(1200);
    return callLocalAi(promptText, models, attempt + 1);
  }

  throw new Error(lastError);
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  const apiSecret = import.meta.env.API_SECRET_KEY;

  if (apiSecret && authHeader !== `Bearer ${apiSecret}`) {
    return Response.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: GeneratePostRequest;

  try {
    body = (await request.json()) as GeneratePostRequest;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const topic = String(body.topic ?? "").trim();
  const category = normalizeSegment(String(body.category ?? ""), "theories");
  const subcategory = normalizeSegment(
    String(body.subcategory ?? ""),
    "general",
  );
  const slug = normalizeSegment(
    String(body.slug ?? topic),
    "generated-post",
  );

  if (!topic) {
    return Response.json(
      { ok: false, error: "The field 'topic' is required." },
      { status: 400 },
    );
  }

  const imageUrl = String(body.imageUrl ?? "").trim() || DEFAULT_IMAGE_URL;
  const translationId =
    String(body.translationId ?? "").trim() || `${slug}-post`;
  const today = getTodayIsoDate();
  const requestedComponentName = `${slugToPascalCase(slug)}Visual`;
  const requestedModel = String(body.model ?? "").trim();
  const modelCandidates = requestedModel
    ? [
        requestedModel,
        ...DEFAULT_FREE_MODELS.filter((model) => model !== requestedModel),
      ]
    : [...DEFAULT_FREE_MODELS];

  const componentPrompt = buildComponentPrompt({
    topic,
    category,
    subcategory,
    componentName: requestedComponentName,
  });

  try {
    const componentCode = await callLocalAi(componentPrompt, modelCandidates);
    const componentName = extractComponentName(componentCode, slug);

    const spanishPrompt = buildSpanishPrompt({
      topic,
      category,
      subcategory,
      slug,
      componentName,
      imageUrl,
      translationId,
      today,
    });

    const spanishContent = await callLocalAi(spanishPrompt, modelCandidates);

    const englishPrompt = buildEnglishPrompt({
      topic,
      category,
      subcategory,
      slug,
      componentName,
      imageUrl,
      translationId,
      today,
    });

    const englishContent = await callLocalAi(englishPrompt, modelCandidates);

    const tagsEs = ensureArrayOfStrings(body.tagsEs, [category, subcategory, slug]);
    const tagsEn = ensureArrayOfStrings(body.tagsEn, [category, subcategory, slug]);

    const normalizedSpanishContent = normalizeMdxDocument({
      rawContent: spanishContent,
      lang: "es",
      topic,
      pubDate: today,
      imageUrl,
      translationId,
      buttonText: "LEER ANALISIS",
      fallbackTags: tagsEs,
      componentName,
    });

    const normalizedEnglishContent = normalizeMdxDocument({
      rawContent: englishContent,
      lang: "en",
      topic,
      pubDate: today,
      imageUrl,
      translationId,
      buttonText: "READ ANALYSIS",
      fallbackTags: tagsEn,
      componentName,
    });

    const visualsDir = VISUALS_ROOT;
    const spanishDir = path.join(CONTENT_ROOT, "es", category, subcategory);
    const englishDir = path.join(CONTENT_ROOT, "en", category, subcategory);

    const componentPath = path.join(visualsDir, `${componentName}.tsx`);
    const spanishPath = path.join(spanishDir, `${slug}.mdx`);
    const englishPath = path.join(englishDir, `${slug}.mdx`);

    const existingPaths = [];
    if (await fileExists(componentPath)) existingPaths.push(componentPath);
    if (await fileExists(spanishPath)) existingPaths.push(spanishPath);
    if (await fileExists(englishPath)) existingPaths.push(englishPath);

    if (existingPaths.length > 0) {
      return Response.json(
        {
          ok: false,
          error: "Refusing to overwrite existing files.",
          files: existingPaths,
        },
        { status: 409 },
      );
    }

    await mkdir(visualsDir, { recursive: true });
    await mkdir(spanishDir, { recursive: true });
    await mkdir(englishDir, { recursive: true });

    await writeFile(componentPath, `${componentCode.trim()}\n`, "utf8");
    await writeFile(spanishPath, normalizedSpanishContent, "utf8");
    await writeFile(englishPath, normalizedEnglishContent, "utf8");

    return Response.json({
      ok: true,
      topic,
      category,
      subcategory,
      slug,
      componentName,
      modelCandidates,
      files: {
        component: componentPath,
        es: spanishPath,
        en: englishPath,
      },
      calls: 3,
      sequence: ["component", "article-es", "article-en"],
    });
  } catch (error) {
    console.error("generate-post error", error);

    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error generating post.",
      },
      { status: 500 },
    );
  }
};

export const GET: APIRoute = async () =>
  new Response("Method not allowed", {
    status: 405,
    headers: {
      Allow: "POST",
    },
  });
