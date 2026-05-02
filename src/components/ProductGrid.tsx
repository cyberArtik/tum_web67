import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/data/products";

const ProductGrid = () => {
  const products = MOCK_PRODUCTS.slice(0, 8);

  return (
    <section id="shop" className="bg-background py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Featured toys
            </h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Hand-picked just for you
            </p>
          </div>
          <Link
            to="/catalog"
            className="hidden items-center gap-1 font-display text-sm font-semibold text-primary underline-offset-4 hover:underline md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/catalog">
            <Button variant="outline" className="gap-2 rounded-full px-8 font-display font-semibold">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
