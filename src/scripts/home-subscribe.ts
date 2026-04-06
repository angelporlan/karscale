const subscribeForm = document.getElementById(
  "home-subscribe-form",
) as HTMLFormElement | null;

const feedback = document.getElementById(
  "home-subscribe-feedback",
) as HTMLDivElement | null;

const feedbackText = document.getElementById(
  "home-subscribe-feedback-text",
) as HTMLParagraphElement | null;

const submitButton = document.getElementById(
  "home-connect-button",
) as HTMLButtonElement | null;

const subscribeMessages = {
  es: {
    loading: "Conectando...",
    networkError:
      "No se pudo enviar la suscripción. Comprueba tu conexión e inténtalo de nuevo.",
  },
  en: {
    loading: "Connecting...",
    networkError:
      "We couldn't send your subscription. Check your connection and try again.",
  },
} as const;

const showFeedback = (message: string, tone: "neutral" | "success" | "error") => {
  if (!feedback || !feedbackText) return;

  feedbackText.textContent = message;
  feedback.className =
    "mt-4 max-h-40 overflow-hidden opacity-100 translate-y-0 transition-all duration-500 ease-out";

  const wrapper = feedback.firstElementChild as HTMLDivElement | null;
  if (!wrapper) return;

  wrapper.className =
    tone === "success"
      ? "rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 backdrop-blur-md shadow-[0_12px_40px_rgba(16,185,129,0.12)]"
      : tone === "error"
        ? "rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 backdrop-blur-md shadow-[0_12px_40px_rgba(244,63,94,0.12)]"
        : "rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.25)]";

  feedbackText.className =
    tone === "success"
      ? "text-sm font-body leading-relaxed text-emerald-100"
      : tone === "error"
        ? "text-sm font-body leading-relaxed text-rose-100"
        : "text-sm font-body leading-relaxed text-gray-300";
};

if (subscribeForm && feedback && feedbackText && submitButton) {
  subscribeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(subscribeForm);
    const email = String(formData.get("email") ?? "").trim();
    const lang = subscribeForm.dataset.lang === "en" ? "en" : "es";
    const messages = subscribeMessages[lang];

    showFeedback(messages.loading, "neutral");
    submitButton.disabled = true;

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, lang }),
      });

      const data = await response.json();
      showFeedback(data.message, response.ok ? "success" : "error");

      if (response.ok) {
        subscribeForm.reset();
      }
    } catch {
      showFeedback(messages.networkError, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
