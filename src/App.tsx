import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Catalog from "@/pages/Catalog";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import ProductDetail from "@/pages/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
