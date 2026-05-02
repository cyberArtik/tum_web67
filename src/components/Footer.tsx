import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "footer.shop",
    keys: ["new_arrivals", "bestsellers", "sale", "gift_cards"],
  },
  {
    title: "footer.help",
    keys: ["shipping", "returns", "faq", "contact"],
  },
  {
    title: "footer.company",
    keys: ["about_us", "blog", "careers", "press"],
  },
] as const;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card py-12 pb-24 md:pb-12">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl font-bold text-primary">
            fun<span className="text-accent">kids</span>
          </Link>
          <p className="mt-3 font-body text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-display font-semibold text-foreground">{t(col.title)}</h4>
            <ul className="space-y-2">
              {col.keys.map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(`footer.links.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mx-auto mt-10 border-t border-border px-4 pt-6 text-center">
        <p className="font-body text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} funkids. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
