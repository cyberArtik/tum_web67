import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Minus,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById, MOCK_PRODUCTS } from "@/data/products";
import { CURRENCY_SYMBOL, DEFAULT_LANG } from "@/lib/constants";
import { getLocalizedField } from "@/types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  const product = getProductById(Number(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
        <h1 className="mb-2 font-display text-2xl font-bold">Product not found</h1>
        <p className="mb-6 font-body text-muted-foreground">
          We couldn't find that toy. It may have rolled away.
        </p>
        <Link to="/catalog">
          <Button className="rounded-full px-6 font-display font-semibold">Back to catalog</Button>
        </Link>
      </div>
    );
  }

  const liked = isInWishlist(product.id);
  const name = getLocalizedField(product, "name", DEFAULT_LANG);
  const description = getLocalizedField(product, "description", DEFAULT_LANG);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const related = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);

  const handleAddToCart = () => {
    // Wired to CartContext in commit 12
    navigate("/cart");
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <nav className="mb-6 flex flex-wrap items-center gap-2 font-body text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalog" className="transition-colors hover:text-primary">Catalog</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`/catalog?category=${product.category}`}
          className="capitalize transition-colors hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="max-w-[200px] truncate font-semibold text-foreground">{name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-square overflow-hidden rounded-3xl bg-muted shadow-card">
            <img src={product.image_url} alt={name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary px-3 py-1 font-display text-xs font-semibold capitalize text-primary-foreground"
              >
                {tag}
              </span>
            ))}
            {discount > 0 && (
              <span className="rounded-full bg-destructive px-3 py-1 font-display text-xs font-bold text-destructive-foreground">
                -{discount}%
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          {product.brand && (
            <Link
              to={`/catalog?brand=${product.brand}`}
              className="mb-1 font-body text-sm font-semibold text-primary hover:underline"
            >
              {product.brand}
            </Link>
          )}

          <h1 className="mb-3 font-display text-2xl font-bold text-foreground md:text-3xl">{name}</h1>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < product.rating ? "fill-accent text-accent" : "text-border"
                  }`}
                />
              ))}
            </div>
            {product.reviews_count !== undefined && product.reviews_count > 0 && (
              <span className="font-body text-sm text-muted-foreground">
                ({product.reviews_count} reviews)
              </span>
            )}
            <span className="text-xs text-muted-foreground">|</span>
            <span className="font-body text-xs text-muted-foreground">
              Art: {product.article_id}
            </span>
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-primary">
              {product.price.toFixed(0)} {CURRENCY_SYMBOL}
            </span>
            {product.original_price && (
              <span className="font-body text-lg text-muted-foreground line-through">
                {product.original_price.toFixed(0)} {CURRENCY_SYMBOL}
              </span>
            )}
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-fun-green">
                <span className="h-2 w-2 rounded-full bg-fun-green" />
                In stock ({product.stock} pieces)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-destructive">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Out of stock
              </span>
            )}
          </div>

          {description && (
            <p className="mb-6 font-body text-sm leading-relaxed text-foreground/80">
              {description}
            </p>
          )}

          {product.age_group && (
            <div className="mb-6 flex items-center gap-2">
              <span className="font-body text-sm text-muted-foreground">Age group:</span>
              <span className="rounded-full bg-muted px-3 py-1 font-display text-sm font-semibold">
                {product.age_group} years
              </span>
            </div>
          )}

          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center overflow-hidden rounded-full border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 transition-colors hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-display font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 transition-colors hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2 rounded-full font-display font-semibold shadow-toy"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5" /> Add to cart
            </Button>
            <button
              onClick={() => toggle(product.id)}
              className={`rounded-full border-2 p-3 transition-all ${
                liked
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-foreground/50 hover:border-primary hover:text-primary"
              }`}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
            <Perk icon={Truck} title="Free shipping" desc="Over 500 Lei" />
            <Perk icon={Shield} title="Safe materials" desc="Certified non-toxic" />
            <Perk icon={RotateCcw} title="Easy returns" desc="14 days policy" />
            <Perk icon={Phone} title="Need help?" desc="+373 60 585 085" link="tel:+37360585085" />
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

interface PerkProps {
  icon: typeof Truck;
  title: string;
  desc: string;
  link?: string;
}

const Perk = ({ icon: Icon, title, desc, link }: PerkProps) => (
  <div className="flex items-center gap-2.5">
    <Icon className="h-5 w-5 shrink-0 text-primary" />
    <div>
      <p className="font-display text-xs font-semibold">{title}</p>
      {link ? (
        <a href={link} className="font-body text-[11px] font-semibold text-primary">
          {desc}
        </a>
      ) : (
        <p className="font-body text-[11px] text-muted-foreground">{desc}</p>
      )}
    </div>
  </div>
);

export default ProductDetail;
