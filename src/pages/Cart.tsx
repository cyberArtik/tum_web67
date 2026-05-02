import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CURRENCY_SYMBOL, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { getLocalizedField, type Language } from "@/types";

type Step = "cart" | "success";

const Cart = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "ro").slice(0, 2) as Language;
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [step, setStep] = useState<Step>("cart");

  const freeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  const handleCheckout = () => {
    if (items.length === 0) return;
    clearCart();
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "success") {
    return (
      <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <SEO title={t("cart.order_placed")} noIndex />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="mb-3 font-display text-2xl font-bold text-foreground md:text-3xl">
            {t("cart.order_placed")}
          </h1>
          <p className="mb-2 font-body text-lg font-semibold text-primary">
            {t("cart.operator_contact")}
          </p>
          <div className="mb-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a
              href="tel:+37360585085"
              className="font-body font-semibold transition-colors hover:text-primary"
            >
              +373 60 585 085
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/catalog")}
              className="rounded-full px-6 font-display font-semibold"
            >
              {t("cart.continue_shopping")}
            </Button>
            <Link to="/">
              <Button variant="outline" className="rounded-full px-6 font-display font-semibold">
                {t("cart.back_home")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container mx-auto min-h-[60vh] px-4 py-10">
        <SEO title={t("cart.title")} noIndex />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h1 className="mb-2 font-display text-xl font-semibold text-foreground">
            {t("cart.empty_title")}
          </h1>
          <p className="mx-auto mb-6 max-w-md font-body text-muted-foreground">
            {t("cart.empty_desc")}
          </p>
          <Link to="/catalog">
            <Button className="rounded-full px-6 font-display font-semibold">
              {t("cart.browse_catalog")}
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-[60vh] px-4 pb-24 pt-8 md:pb-8">
      <SEO title={t("cart.title")} noIndex />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link
          to="/catalog"
          className="mb-3 inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("cart.continue_shopping")}
        </Link>
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground md:text-4xl">
          <ShoppingCart className="h-8 w-8 text-primary" />
          {t("cart.title")}
          <span className="font-body text-base font-normal text-muted-foreground">
            ({totalItems})
          </span>
        </h1>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const name = getLocalizedField(item.product, "name", lang);
              return (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4"
                >
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-muted md:h-24 md:w-24">
                      <img
                        src={item.product.image_url}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="line-clamp-2 font-display text-sm font-semibold text-foreground transition-colors hover:text-primary md:text-base"
                      >
                        {name}
                      </Link>
                      {item.product.brand && (
                        <p className="mt-0.5 font-body text-xs text-muted-foreground">
                          {item.product.brand}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                          aria-label="-"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center font-display text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
                          aria-label="+"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-primary">
                          {(item.product.price * item.quantity).toFixed(0)} {CURRENCY_SYMBOL}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={t("wishlist.clear_all")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-4 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold text-foreground">{t("cart.title")}</h2>

            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="font-semibold text-foreground">
                {totalPrice.toFixed(0)} {CURRENCY_SYMBOL}
              </span>
            </div>

            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span
                className={`font-semibold ${freeShipping ? "text-green-600 dark:text-green-400" : "text-foreground"}`}
              >
                {freeShipping ? t("cart.free") : t("cart.calculated_later")}
              </span>
            </div>

            {!freeShipping && (
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3 font-body text-xs text-muted-foreground">
                <Truck className="h-4 w-4 shrink-0" />
                {t("cart.free_shipping_hint", { amount: remainingForFree.toFixed(0) })}
              </div>
            )}

            <div className="h-px bg-border" />

            <div className="flex items-baseline justify-between">
              <span className="font-display font-bold text-foreground">{t("cart.total")}</span>
              <span className="font-display text-2xl font-bold text-primary">
                {totalPrice.toFixed(0)} {CURRENCY_SYMBOL}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              size="lg"
              className="w-full rounded-xl py-6 font-display text-base font-bold"
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> {t("cart.place_order")}
            </Button>

            <p className="text-center font-body text-xs text-muted-foreground">
              <Phone className="mr-1 inline h-3 w-3" />
              {t("cart.operator_will_call")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
