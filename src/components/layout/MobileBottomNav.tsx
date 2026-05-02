import { Heart, Menu, Search, ShoppingCart, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useWishlist } from "@/contexts/WishlistContext";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { count: wishlistCount } = useWishlist();

  const isActive = (path: string) => location.pathname === path;

  const items = [
    { icon: Store, label: "Shop", path: "/", action: () => navigate("/") },
    { icon: Search, label: "Catalog", path: "/catalog", action: () => navigate("/catalog") },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
      action: () => navigate("/wishlist"),
      badge: wishlistCount,
    },
    { icon: ShoppingCart, label: "Cart", path: "/cart", action: () => navigate("/cart") },
    { icon: Menu, label: "Menu", path: "#menu", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition-colors ${
              isActive(item.path) ? "text-primary" : "text-foreground/50"
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-body text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
