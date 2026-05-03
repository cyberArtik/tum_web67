import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  KeyRound,
  LogOut,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CATEGORIES } from "@/data/products";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { count: wishlistCount } = useWishlist();
  const { totalItems: cartCount } = useCart();
  const { role, logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/catalog?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="hidden bg-foreground text-background text-xs md:block">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5">
          <div className="flex items-center gap-6">
            <a href="tel:+37360585085" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Phone className="h-3 w-3" />
              <span className="font-semibold">+373 60 585 085</span>
            </a>
            <span className="flex items-center gap-1.5 text-background/70">
              <Truck className="h-3 w-3" />
              {t("nav.free_shipping_strip")}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-sm backdrop-blur-lg">
        <div className="container mx-auto flex items-center gap-4 px-4 py-2.5">
          <Link to="/" className="shrink-0 font-display text-2xl font-bold tracking-tight text-primary">
            fun<span className="text-accent">kids</span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="relative hidden max-w-xl flex-1 md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav.search_placeholder")}
              className="w-full rounded-full border border-border bg-muted/70 px-4 py-2.5 pr-12 font-body text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-card"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90"
              aria-label={t("nav.search")}
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            {role ? (
              <button
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-bold text-foreground/80 transition-colors hover:border-primary hover:text-primary sm:flex"
                title={t("auth.logout")}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="font-display uppercase">{role}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full p-2 transition-colors hover:bg-muted sm:flex"
                aria-label={t("auth.login")}
                title={t("auth.login")}
              >
                <KeyRound className="h-5 w-5 text-foreground/70" />
              </Link>
            )}

            <button
              onClick={() => navigate("/wishlist")}
              className="relative hidden rounded-full p-2 transition-colors hover:bg-muted sm:flex"
              aria-label={t("nav.wishlist")}
            >
              <Heart className="h-5 w-5 text-foreground/70" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="relative rounded-full p-2 transition-colors hover:bg-muted"
              aria-label={t("nav.cart")}
            >
              <ShoppingCart className="h-5 w-5 text-foreground/70" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full p-2 transition-colors hover:bg-muted md:hidden"
              aria-label={t("nav.menu")}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border bg-card/60 md:block">
          <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
            <Link
              to="/catalog"
              className="rounded-full px-3 py-1.5 font-body font-semibold text-foreground/70 transition-colors hover:bg-muted/50 hover:text-primary"
            >
              {t("nav.all")}
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={`/catalog?category=${cat.key}`}
                className="rounded-full px-3 py-1.5 font-body font-semibold capitalize text-foreground/70 transition-colors hover:bg-muted/50 hover:text-primary"
              >
                {cat.key}
              </Link>
            ))}
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border bg-card md:hidden">
            <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.search_placeholder")}
                  className="w-full rounded-full border border-border bg-muted/70 px-4 py-2 pr-10 font-body text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-primary p-1.5 text-primary-foreground"
                  aria-label={t("nav.search")}
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <div className="mb-2 flex justify-center">
                <LanguageSwitcher />
              </div>
              <Link
                to={role ? "/login" : "/login"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 font-body font-semibold text-foreground/70 hover:bg-muted/50 hover:text-primary"
              >
                <KeyRound className="h-4 w-4" />
                {role ? `${role} (${t("auth.logout")})` : t("auth.login")}
              </Link>
              <Link
                to="/catalog"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-2 font-body font-semibold text-foreground/70 hover:bg-muted/50 hover:text-primary"
              >
                {t("nav.all")}
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  to={`/catalog?category=${cat.key}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2 font-body font-semibold capitalize text-foreground/70 hover:bg-muted/50 hover:text-primary"
                >
                  {cat.key}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
