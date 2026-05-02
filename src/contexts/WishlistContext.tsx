import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface WishlistContextValue {
  wishlistIds: Set<number>;
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clear: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "funkids-wishlist";

function readStorage(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: number[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(
    () => new Set(readStorage()),
  );

  useEffect(() => {
    writeStorage(Array.from(wishlistIds));
  }, [wishlistIds]);

  const toggle = useCallback((productId: number) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const remove = useCallback((productId: number) => {
    setWishlistIds((prev) => {
      if (!prev.has(productId)) return prev;
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: number) => wishlistIds.has(productId),
    [wishlistIds],
  );

  const clear = useCallback(() => setWishlistIds(new Set()), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggle,
        remove,
        isInWishlist,
        clear,
        count: wishlistIds.size,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
