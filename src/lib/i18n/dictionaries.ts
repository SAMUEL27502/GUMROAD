export type Locale = "en" | "es" | "de" | "fr";

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "es", label: "Español", flag: "ES" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "fr", label: "Français", flag: "FR" },
];

export const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    "nav.marketplace": "Marketplace",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Pricing",
    "nav.signals": "Signals",
    "hero.tagline": "Automate trading with verified MT5 Expert Advisors",
    "cta.getStarted": "Get Started",
    "cta.signIn": "Sign In",
    "common.loading": "Loading",
    "alerts.title": "Alert channels",
    "alerts.email": "Email alerts",
    "alerts.telegram": "Telegram alerts",
  },
  es: {
    "nav.marketplace": "Mercado",
    "nav.dashboard": "Panel",
    "nav.pricing": "Precios",
    "nav.signals": "Señales",
    "hero.tagline": "Automatiza el trading con Expert Advisors MT5 verificados",
    "cta.getStarted": "Empezar",
    "cta.signIn": "Iniciar sesión",
    "common.loading": "Cargando",
    "alerts.title": "Canales de alerta",
    "alerts.email": "Alertas por email",
    "alerts.telegram": "Alertas de Telegram",
  },
  de: {
    "nav.marketplace": "Marktplatz",
    "nav.dashboard": "Dashboard",
    "nav.pricing": "Preise",
    "nav.signals": "Signale",
    "hero.tagline": "Automatisieren Sie den Handel mit verifizierten MT5 Expert Advisors",
    "cta.getStarted": "Loslegen",
    "cta.signIn": "Anmelden",
    "common.loading": "Lädt",
    "alerts.title": "Alert-Kanäle",
    "alerts.email": "E-Mail-Alerts",
    "alerts.telegram": "Telegram-Alerts",
  },
  fr: {
    "nav.marketplace": "Marketplace",
    "nav.dashboard": "Tableau de bord",
    "nav.pricing": "Tarifs",
    "nav.signals": "Signaux",
    "hero.tagline": "Automatisez le trading avec des Expert Advisors MT5 vérifiés",
    "cta.getStarted": "Commencer",
    "cta.signIn": "Connexion",
    "common.loading": "Chargement",
    "alerts.title": "Canaux d'alerte",
    "alerts.email": "Alertes e-mail",
    "alerts.telegram": "Alertes Telegram",
  },
};

export function t(locale: Locale, key: string) {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}
