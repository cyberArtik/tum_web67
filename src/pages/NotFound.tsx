import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <SEO title="404" noIndex />
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <h1 className="font-display text-2xl text-foreground">{t("not_found.title")}</h1>
      <p className="max-w-sm font-body text-muted-foreground">{t("not_found.desc")}</p>
      <Link to="/">
        <Button className="rounded-full">{t("not_found.back_home")}</Button>
      </Link>
    </section>
  );
};

export default NotFound;
