import { Heart, Menu, Search, ShoppingCart, Store } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const items = [
    { icon: Store, label: "Shop", path: "/", action: () => navigate("/") },
    { icon: Search, label: "Catalog", path: "/catalog", action: () => navigate("/catalog") },
    { icon: Heart, label: "Wishlist", path: "/wishlist", action: () => navigate("/wishlist") },
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
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition-colors ${
              isActive(item.path) ? "text-primary" : "text-foreground/50"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-body text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
