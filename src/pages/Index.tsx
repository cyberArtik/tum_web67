import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import ProductSection from "@/components/ProductSection";
import PromoBar from "@/components/PromoBar";
import { MOCK_PRODUCTS } from "@/data/products";

const Index = () => {
  const saleProducts = MOCK_PRODUCTS.filter(
    (p) => p.original_price && p.original_price > p.price,
  );
  const plushProducts = MOCK_PRODUCTS.filter((p) => p.category === "plush");
  const stemProducts = MOCK_PRODUCTS.filter((p) => p.tags.includes("stem"));

  return (
    <>
      <HeroSection />
      <PromoBar />
      <ProductGrid />

      <ProductSection
        title="Sale %"
        subtitle="Discounts you'll love"
        products={saleProducts}
        linkTo="/catalog?tag=sale"
        bgClass="bg-muted/30"
      />

      <ProductSection
        title="Soft & cuddly"
        subtitle="Plush companions for every age"
        products={plushProducts}
        linkTo="/catalog?category=plush"
      />

      <ProductSection
        title="STEM picks"
        subtitle="Build, experiment, learn"
        products={stemProducts}
        linkTo="/catalog?tag=stem"
        bgClass="bg-muted/30"
      />
    </>
  );
};

export default Index;
