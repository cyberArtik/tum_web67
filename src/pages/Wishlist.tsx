import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { MOCK_PRODUCTS } from "@/data/products";

const Wishlist = () => {
  const { wishlistIds, clear } = useWishlist();
  const wishlistProducts = MOCK_PRODUCTS.filter((p) => wishlistIds.has(p.id));

  return (
    <main className="container mx-auto min-h-[60vh] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4"
      >
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold text-foreground md:text-4xl">
          <Heart className="h-8 w-8 fill-primary text-primary" />
          Your wishlist
          <span className="font-body text-base font-semibold text-muted-foreground">
            ({wishlistProducts.length})
          </span>
        </h1>
        {wishlistProducts.length > 0 && (
          <Button
            variant="outline"
            onClick={clear}
            className="gap-2 rounded-full font-display font-semibold"
          >
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        )}
      </motion.div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
          <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="mx-auto mb-6 max-w-md font-body text-muted-foreground">
            Tap the heart on any toy you love and it will land here. Your list
            stays in this browser even after you close the tab.
          </p>
          <Link to="/catalog">
            <Button className="rounded-full px-6 font-display font-semibold">
              Browse catalog
            </Button>
          </Link>
        </motion.div>
      )}
    </main>
  );
};

export default Wishlist;
