import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 font-body text-sm font-semibold text-accent-foreground">
              <Sparkles className="h-4 w-4 text-accent" />
              {t("hero.badge")}
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("hero.title")}{" "}
              <span className="relative text-primary">
                {t("hero.title_highlight")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="hsl(var(--accent))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="max-w-lg font-body text-lg leading-relaxed text-muted-foreground">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/catalog">
                <Button size="lg" className="gap-2 rounded-full px-8 font-display text-base font-semibold shadow-toy">
                  {t("hero.cta_shop")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/catalog?tag=sale">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full border-2 px-8 font-display text-base font-semibold"
                >
                  {t("hero.cta_sale")}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-hover">
              <img
                src="https://picsum.photos/seed/funkids-hero/800/600"
                alt="Colourful toys"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="absolute bottom-4 right-4 rounded-2xl bg-secondary px-4 py-2 font-display text-sm font-bold text-secondary-foreground shadow-lg"
              >
                -20% {t("hero.cta_sale")}
              </motion.div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
