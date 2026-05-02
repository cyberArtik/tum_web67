import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Cart from "@/pages/Cart";
import Catalog from "@/pages/Catalog";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <WishlistProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <MobileBottomNav />
            </div>
          </CartProvider>
        </WishlistProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
