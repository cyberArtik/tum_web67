import { motion } from "framer-motion";
import { Gift, RotateCcw, Shield, Truck } from "lucide-react";

const PERKS = [
  { icon: Truck, title: "Free shipping", desc: "Over 500 Lei" },
  { icon: Gift, title: "Gift wrapping", desc: "On request" },
  { icon: Shield, title: "Safe materials", desc: "Certified non-toxic" },
  { icon: RotateCcw, title: "Easy returns", desc: "14 days policy" },
];

const PromoBar = () => {
  return (
    <section className="bg-muted/50 py-12">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 md:grid-cols-4">
        {PERKS.map((perk, i) => (
          <motion.div
            key={perk.title}
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
              <p className="font-display text-sm font-semibold text-foreground">{perk.title}</p>
              <p className="font-body text-xs text-muted-foreground">{perk.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PromoBar;
