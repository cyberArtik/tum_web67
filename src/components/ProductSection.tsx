import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  linkTo: string;
  linkLabel?: string;
  bgClass?: string;
}

const ProductSection = ({
  title,
  subtitle,
  products,
  linkTo,
  linkLabel = "View all",
  bgClass = "bg-background",
}: ProductSectionProps) => {
  if (products.length === 0) return null;

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex items-end justify-between"
        >
          <div>
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">{title}</h2>
            {subtitle && <p className="mt-1 font-body text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          <Link
            to={linkTo}
            className="hidden shrink-0 items-center gap-1 font-display text-sm font-semibold text-primary underline-offset-4 hover:underline md:flex"
          >
            {linkLabel} <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link to={linkTo}>
            <Button variant="outline" size="sm" className="gap-2 rounded-full px-6 font-display font-semibold">
              {linkLabel} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
