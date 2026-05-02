import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { CURRENCY_SYMBOL, DEFAULT_LANG } from "@/lib/constants";
import { getLocalizedField, type Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const TAG_COLORS: Record<string, string> = {
  bestseller: "bg-primary text-primary-foreground",
  popular: "bg-fun-orange text-primary-foreground",
  new: "bg-fun-blue text-primary-foreground",
  sale: "bg-secondary text-secondary-foreground",
  premium: "bg-fun-purple text-primary-foreground",
  stem: "bg-fun-green text-primary-foreground",
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);
  const name = getLocalizedField(product, "name", DEFAULT_LANG);
  const tag = product.tags?.find((t) => TAG_COLORS[t]) ?? product.tags?.[0];

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wired to CartContext in commit 12
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.6 }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card hover:shadow-hover"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {tag && (
            <span
              className={`${TAG_COLORS[tag] ?? TAG_COLORS.bestseller} rounded-full px-2.5 py-0.5 font-display text-[11px] font-semibold capitalize`}
            >
              {tag}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-destructive px-2.5 py-0.5 font-display text-[11px] font-bold text-destructive-foreground">
              -{discount}%
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5">
          <button
            onClick={handleLike}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
              liked
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-card/80 text-foreground/50 backdrop-blur-sm hover:bg-card hover:text-primary"
            }`}
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground/50 opacity-0 backdrop-blur-sm transition-all hover:bg-card hover:text-primary group-hover:opacity-100"
            aria-label="Quick view"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Hover-reveal add to cart */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-2.5 transition-transform duration-300 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
          >
            <ShoppingCart className="h-4 w-4" /> Add to cart
          </button>
        </div>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-card/90 px-4 py-2 font-display text-sm font-bold text-foreground/70">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <Link to={`/product/${product.id}`} className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < product.rating ? "fill-accent text-accent" : "text-border"}`}
            />
          ))}
          {product.reviews_count !== undefined && (
            <span className="ml-0.5 text-[11px] text-muted-foreground">
              ({product.reviews_count})
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>

        {product.brand && (
          <span className="font-body text-[11px] text-muted-foreground">{product.brand}</span>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-lg font-bold text-primary">
            {product.price.toFixed(0)} {CURRENCY_SYMBOL}
          </span>
          {product.original_price && (
            <span className="font-body text-xs text-muted-foreground line-through">
              {product.original_price.toFixed(0)} {CURRENCY_SYMBOL}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="font-body text-[11px] font-semibold text-fun-orange">
            Only {product.stock} left
          </p>
        )}
      </Link>
    </motion.div>
  );
};

export default ProductCard;
