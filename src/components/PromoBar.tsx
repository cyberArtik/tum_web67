import { motion } from "framer-motion";
import { Gift, RotateCcw, Shield, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

const PERKS = [
  { icon: Truck, titleKey: "promo.free_shipping_title", descKey: "promo.free_shipping_desc" },
  { icon: Gift, titleKey: "promo.gift_title", descKey: "promo.gift_desc" },
  { icon: Shield, titleKey: "promo.safe_title", descKey: "promo.safe_desc" },
  { icon: RotateCcw, titleKey: "promo.returns_title", descKey: "promo.returns_desc" },
] as const;

const PromoBar = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {PERKS.map((perk, i) => (
          <motion.div
            key={perk.titleKey}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <perk.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">{t(perk.titleKey)}</p>
              <p className="font-body text-xs text-muted-foreground">{t(perk.descKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoBar;
