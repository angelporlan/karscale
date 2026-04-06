import type { APIRoute } from "astro";

const BUTTONDOWN_API_URL = "https://api.buttondown.com/v1/subscribers";
export const prerender = false;

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getMessages = (lang: "es" | "en") =>
  lang === "es"
    ? {
        invalidEmail: "Introduce un email válido.",
        missingApiKey:
          "Falta configurar la suscripción. Añade BUTTONDOWN_API_KEY en el servidor.",
        success:
          "Revisa tu bandeja de entrada para confirmar la suscripción.",
        genericError:
          "No se pudo completar la suscripción ahora mismo. Inténtalo de nuevo en unos minutos.",
      }
    : {
        invalidEmail: "Enter a valid email address.",
        missingApiKey:
          "Subscription is not configured yet. Add BUTTONDOWN_API_KEY on the server.",
        success: "Check your inbox to confirm your subscription.",
        genericError:
          "We couldn't complete your subscription right now. Please try again in a few minutes.",
      };

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await request.json().catch(() => null)
    : await request.formData().catch(() => null);

  const emailValue =
    body instanceof FormData ? body.get("email") : body?.email;
  const langValue =
    body instanceof FormData ? body.get("lang") : body?.lang;

  const email = String(emailValue ?? "").trim().toLowerCase();
  const lang = langValue === "en" ? "en" : "es";
  const messages = getMessages(lang);

  if (!isValidEmail(email)) {
    return Response.json(
      { ok: false, message: messages.invalidEmail },
      { status: 400 },
    );
  }

  const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return Response.json(
      { ok: false, message: messages.missingApiKey },
      { status: 500 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ipAddress = forwardedFor.split(",")[0]?.trim();
  const referrerUrl = request.headers.get("origin") ?? "";

  const buttondownResponse = await fetch(BUTTONDOWN_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
      "X-Buttondown-Collision-Behavior": "add",
    },
    body: JSON.stringify({
      email_address: email,
      type: "regular",
      ip_address: ipAddress || undefined,
      referrer_url: referrerUrl,
      metadata: {
        lang,
        source: "karscale-home-form",
      },
      tags: ["blog", lang],
    }),
  });

  if (!buttondownResponse.ok) {
    const errorText = await buttondownResponse.text();
    console.error("Buttondown subscribe error", {
      status: buttondownResponse.status,
      body: errorText,
      email,
      lang,
    });

    const message = import.meta.env.DEV && errorText
      ? `Buttondown error: ${errorText}`
      : messages.genericError;

    return Response.json({ ok: false, message }, { status: 400 });
  }

  const responseText = await buttondownResponse.text();
  console.log("Buttondown subscribe success", {
    email,
    lang,
    body: responseText,
  });

  return Response.json({
    ok: true,
    message: messages.success,
  });
};

export const GET: APIRoute = async () =>
  new Response("Method not allowed", {
    status: 405,
    headers: {
      Allow: "POST",
    },
  });
