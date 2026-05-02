import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import type { Language } from "@/types";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "product" | "article";
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | null;
}

const SITE_NAME = "funkids";
const SITE_URL = import.meta.env.VITE_SITE_URL ?? "";

const DEFAULT_DESC: Record<Language, string> = {
  ro: "Magazin online de jucării — calitate, preț bun, livrare rapidă.",
  ru: "Интернет-магазин игрушек — качество, доступные цены, быстрая доставка.",
  en: "Online toy store — quality toys, fair prices, fast delivery.",
};

const SEO = ({
  title,
  description,
  image,
  type = "website",
  noIndex,
  jsonLd,
}: SEOProps) => {
  const { i18n } = useTranslation();
  const lang = ((i18n.resolvedLanguage ?? i18n.language ?? "ro").slice(0, 2) as Language);

  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — playful online toy store`;
  const desc = description ?? DEFAULT_DESC[lang] ?? DEFAULT_DESC.ro;
  const canonical = typeof window !== "undefined" ? window.location.href : "";
  const ogImage = image ?? (SITE_URL ? `${SITE_URL}/og-image.jpg` : undefined);
  const ogLocale = lang === "ro" ? "ro_MD" : lang === "ru" ? "ru_RU" : "en_US";
  const altLocales = (["ro", "ru", "en"] as const).filter((l) => l !== lang);

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {canonical && <link rel="alternate" hrefLang={lang} href={canonical} />}
      {canonical &&
        altLocales.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={canonical} />
        ))}
      {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={ogLocale} />
      {altLocales.map((l) => (
        <meta
          key={l}
          property="og:locale:alternate"
          content={l === "ro" ? "ro_MD" : l === "ru" ? "ru_RU" : "en_US"}
        />
      ))}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
