import { BrowserRouter } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PromoBar from "@/components/PromoBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <section className="container mx-auto px-4 py-16 text-center">
            <h1 className="font-display text-5xl text-primary md:text-6xl">funkids</h1>
            <p className="mx-auto mt-3 max-w-md font-body text-muted-foreground">
              Layout shell — Navbar, mobile nav, promo strip and footer are wired up.
              Catalog, hero and product pages are coming next.
            </p>
          </section>
          <PromoBar />
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
