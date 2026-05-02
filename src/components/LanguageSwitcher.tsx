import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const LANGS = ["ro", "ru", "en"] as const;

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "ro").slice(0, 2);

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-border bg-card text-[11px] font-bold">
      {LANGS.map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => i18n.changeLanguage(lng)}
          className={cn(
            "px-2.5 py-1 font-display transition-colors",
            current === lng
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:text-primary",
          )}
          aria-label={`Switch language to ${lng.toUpperCase()}`}
          aria-pressed={current === lng}
        >
          {t(`lang.${lng}`)}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
