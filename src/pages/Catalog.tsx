import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Grid3X3,
  LayoutGrid,
  Package,
  Sparkles,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { AGE_GROUPS, CATEGORIES, MOCK_PRODUCTS } from "@/data/products";
import { DEFAULT_LANG } from "@/lib/constants";
import { getLocalizedField, type SortOption } from "@/types";

const PRICE_MAX = 2000;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = MOCK_PRODUCTS;

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean) as string[])],
    [products],
  );

  const urlCategory = searchParams.get("category") ?? "";
  const urlTag = searchParams.get("tag") ?? "";
  const urlQuery = searchParams.get("q") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    urlCategory ? new Set([urlCategory]) : new Set(),
  );
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedAges, setSelectedAges] = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX]);
  const [showInStock, setShowInStock] = useState(false);
  const [showDiscount, setShowDiscount] = useState(urlTag === "sale");
  const [showNew, setShowNew] = useState(urlTag === "new");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["category", "price", "brand", "age", "stock"]),
  );

  const toggleSection = (key: string) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleSet = (
    set: Set<string>,
    key: string,
    setter: (s: Set<string>) => void,
  ) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (urlQuery) {
      const q = urlQuery.toLowerCase();
      result = result.filter((p) => {
        const name = getLocalizedField(p, "name", DEFAULT_LANG).toLowerCase();
        return name.includes(q) || p.article_id.toLowerCase().includes(q);
      });
    }
    if (selectedCategories.size > 0) {
      result = result.filter((p) => selectedCategories.has(p.category));
    }
    if (selectedBrands.size > 0) {
      result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    }
    if (selectedAges.size > 0) {
      result = result.filter((p) => p.age_group && selectedAges.has(p.age_group));
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (showInStock) result = result.filter((p) => p.stock > 0);
    if (showDiscount) {
      result = result.filter((p) => p.original_price && p.original_price > p.price);
    }
    if (showNew) result = result.filter((p) => p.tags.includes("new"));

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.created_at.localeCompare(a.created_at));
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [
    products,
    urlQuery,
    selectedCategories,
    selectedBrands,
    selectedAges,
    priceRange,
    showInStock,
    showDiscount,
    showNew,
    sortBy,
  ]);

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedAges(new Set());
    setPriceRange([0, PRICE_MAX]);
    setShowInStock(false);
    setShowDiscount(false);
    setShowNew(false);
    setSearchParams({});
  };

  const activeFilterCount =
    selectedCategories.size +
    selectedBrands.size +
    selectedAges.size +
    (showInStock ? 1 : 0) +
    (showDiscount ? 1 : 0) +
    (showNew ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < PRICE_MAX ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-1">
      <FilterSection
        title="Category"
        sectionKey="category"
        open={openSections.has("category")}
        toggle={toggleSection}
      >
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat.key} className="group flex cursor-pointer items-center gap-2.5 py-0.5">
              <input
                type="checkbox"
                checked={selectedCategories.has(cat.key)}
                onChange={() => toggleSet(selectedCategories, cat.key, setSelectedCategories)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="font-body text-sm capitalize text-foreground/80 transition-colors group-hover:text-primary">
                {cat.key}
              </span>
              <span className="ml-auto text-[11px] text-muted-foreground">
                ({products.filter((p) => p.category === cat.key).length})
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price"
        sectionKey="price"
        open={openSections.has("price")}
        toggle={toggleSection}
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block font-body text-[11px] text-muted-foreground">From</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-body text-sm outline-none focus:border-primary"
                min={0}
              />
            </div>
            <div className="flex items-end pb-1.5 text-muted-foreground">—</div>
            <div className="flex-1">
              <label className="mb-1 block font-body text-[11px] text-muted-foreground">To</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full rounded-lg border border-border bg-muted/50 px-3 py-1.5 font-body text-sm outline-none focus:border-primary"
                min={0}
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
        </div>
      </FilterSection>

      <FilterSection
        title="Brand"
        sectionKey="brand"
        open={openSections.has("brand")}
        toggle={toggleSection}
      >
        <div className="space-y-1.5">
          {brands.map((brand) => (
            <label key={brand} className="group flex cursor-pointer items-center gap-2.5 py-0.5">
              <input
                type="checkbox"
                checked={selectedBrands.has(brand)}
                onChange={() => toggleSet(selectedBrands, brand, setSelectedBrands)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="font-body text-sm text-foreground/80 transition-colors group-hover:text-primary">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Age group"
        sectionKey="age"
        open={openSections.has("age")}
        toggle={toggleSection}
      >
        <div className="space-y-1.5">
          {AGE_GROUPS.map((age) => (
            <label key={age.key} className="group flex cursor-pointer items-center gap-2.5 py-0.5">
              <input
                type="checkbox"
                checked={selectedAges.has(age.key)}
                onChange={() => toggleSet(selectedAges, age.key, setSelectedAges)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="font-body text-sm text-foreground/80 transition-colors group-hover:text-primary">
                {age.label_en}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Availability"
        sectionKey="stock"
        open={openSections.has("stock")}
        toggle={toggleSection}
      >
        <div className="space-y-2">
          <label className="group flex cursor-pointer items-center gap-2.5 py-0.5">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={() => setShowInStock((v) => !v)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <Package className="h-3.5 w-3.5 text-fun-green" />
            <span className="font-body text-sm text-foreground/80 transition-colors group-hover:text-primary">
              In stock only
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 py-0.5">
            <input
              type="checkbox"
              checked={showDiscount}
              onChange={() => setShowDiscount((v) => !v)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <Tag className="h-3.5 w-3.5 text-secondary" />
            <span className="font-body text-sm text-foreground/80 transition-colors group-hover:text-primary">
              On sale
            </span>
          </label>
          <label className="group flex cursor-pointer items-center gap-2.5 py-0.5">
            <input
              type="checkbox"
              checked={showNew}
              onChange={() => setShowNew((v) => !v)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <Sparkles className="h-3.5 w-3.5 text-fun-blue" />
            <span className="font-body text-sm text-foreground/80 transition-colors group-hover:text-primary">
              New arrivals
            </span>
          </label>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-6">
      <nav className="mb-6 flex items-center gap-2 font-body text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-primary">Home</Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Catalog</span>
        {urlQuery && <span className="text-foreground">— "{urlQuery}"</span>}
      </nav>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-body text-xs text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full font-body lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <p className="font-body text-sm text-muted-foreground">
                {filteredProducts.length} products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="cursor-pointer rounded-full border border-border bg-card px-3 py-1.5 font-body text-sm outline-none focus:border-primary"
              >
                <option value="popular">Most popular</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>

              <div className="hidden items-center overflow-hidden rounded-full border border-border md:flex">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 ${gridCols === 3 ? "bg-primary text-primary-foreground" : "text-foreground/50 hover:text-foreground"}`}
                  aria-label="3-column grid"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 ${gridCols === 4 ? "bg-primary text-primary-foreground" : "text-foreground/50 hover:text-foreground"}`}
                  aria-label="4-column grid"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className={`grid grid-cols-2 gap-3 md:gap-4 ${
                gridCols === 4
                  ? "md:grid-cols-3 lg:grid-cols-4"
                  : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                No products match
              </h3>
              <p className="mb-6 font-body text-muted-foreground">
                Try clearing some filters or searching for something else.
              </p>
              <Button onClick={clearFilters} className="rounded-full px-6 font-display font-semibold">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-card"
            >
              <div className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                    <SlidersHorizontal className="h-5 w-5" /> Filters
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="rounded-full p-2 hover:bg-muted"
                    aria-label="Close filters"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <FilterContent />
                <div className="mt-6 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1 rounded-full font-display"
                  >
                    Clear all
                  </Button>
                  <Button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 rounded-full font-display"
                  >
                    Apply ({filteredProducts.length})
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

function FilterSection({
  title,
  sectionKey,
  open,
  toggle,
  children,
}: {
  title: string;
  sectionKey: string;
  open: boolean;
  toggle: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => toggle(sectionKey)}
        className="flex w-full items-center justify-between py-3 font-display text-sm font-semibold text-foreground"
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Catalog;
