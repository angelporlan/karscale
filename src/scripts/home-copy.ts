const lang = document.body.dataset.lang === "en" ? "en" : "es";

const homeCopy = {
  es: {
    protocol: "PROTOCOLO KARDASHEV INICIADO",
    heroTitle:
      'Karscale.<br>Midiendo el<br><span class="text-secondary drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">progreso cósmico.</span>',
    heroText:
      "Una terminal de investigación dedicada a la clasificación de civilizaciones y el análisis de la tecno-firma universal a través de la escala de Nikolai Kardashev.",
    archivesCta: "ACCEDER A LOS ARCHIVOS",
    scaleCta: "MANUAL DE ESCALA",
    archivesTitle: "LOGBOOK DE INVESTIGACIÓN",
    filterAll: "TODOS",
    filterTech: "TECNOLOGÍA",
    subscribeTitle: "SUSCRIBIRSE AL FEED DE INVESTIGACIÓN",
    subscribeText:
      "Reciba actualizaciones semanales sobre anomalías astronómicas y progreso en la escala Kardashev directamente en su terminal.",
    emailPlaceholder: "DIRECCIÓN DE ENLACE...",
    connect: "CONECTAR",
  },
  en: {
    protocol: "KARDASHEV PROTOCOL INITIALIZED",
    heroTitle:
      'Karscale.<br>Measuring<br><span class="text-secondary drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">cosmic progress.</span>',
    heroText:
      "A research terminal focused on classifying civilizations and analyzing universal technosignatures through Nikolai Kardashev's scale.",
    archivesCta: "ACCESS ARCHIVES",
    scaleCta: "SCALE MANUAL",
    archivesTitle: "RESEARCH LOGBOOK",
    filterAll: "ALL",
    filterTech: "TECH",
    subscribeTitle: "SUBSCRIBE TO THE RESEARCH FEED",
    subscribeText:
      "Receive weekly updates on astronomical anomalies and progress along the Kardashev scale directly in your terminal.",
    emailPlaceholder: "LINK ADDRESS...",
    connect: "CONNECT",
  },
}[lang];

const setText = (id: string, value: string) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

const heroTitle = document.getElementById("home-hero-title");
if (heroTitle) heroTitle.innerHTML = homeCopy.heroTitle;

setText("home-protocol", homeCopy.protocol);
setText("home-hero-text", homeCopy.heroText);
setText("home-archives-cta", homeCopy.archivesCta);
setText("home-scale-cta", homeCopy.scaleCta);
setText("home-archives-title", homeCopy.archivesTitle);
setText("home-filter-all", homeCopy.filterAll);
setText("home-filter-tech", homeCopy.filterTech);
setText("home-subscribe-title", homeCopy.subscribeTitle);
setText("home-subscribe-text", homeCopy.subscribeText);
setText("home-connect-button", homeCopy.connect);

const emailInput = document.getElementById("home-email-input") as HTMLInputElement | null;
if (emailInput) emailInput.placeholder = homeCopy.emailPlaceholder;
