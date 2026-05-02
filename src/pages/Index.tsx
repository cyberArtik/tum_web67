import HeroSection from "@/components/HeroSection";
import PromoBar from "@/components/PromoBar";

const Index = () => {
  return (
    <>
      <HeroSection />
      <PromoBar />
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-foreground">More coming soon</h2>
        <p className="mx-auto mt-2 max-w-md font-body text-muted-foreground">
          Categories, featured products, sale and new arrivals will land in the
          next commits — together with the catalog page.
        </p>
      </section>
    </>
  );
};

export default Index;
