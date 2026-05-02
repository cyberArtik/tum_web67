/**
 * Tiny IndexedDB key/value cache used by the product hooks.
 * Each entry stores its data plus an absolute `expiresAt` epoch (0 = never).
 *
 * Why IndexedDB over localStorage: products can be large (image URLs, full
 * descriptions, tags) — IndexedDB lifts the ~5MB localStorage cap, runs off
 * the main thread, and gives us a real DB cursor if we ever paginate.
 */

const DB_NAME = "funkids";
const STORE = "cache";
const DB_VERSION = 1;
const DEFAULT_TTL_MS = 1000 * 60 * 30; // 30 minutes

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDb().then((db) => db.transaction(STORE, mode).objectStore(STORE));
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const store = await tx("readonly");
    return await new Promise<T | null>((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => {
        const entry = req.result as CacheEntry<T> | undefined;
        if (!entry) {
          resolve(null);
          return;
        }
        if (entry.expiresAt > 0 && entry.expiresAt < Date.now()) {
          resolve(null);
          return;
        }
        resolve(entry.data);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: string,
  data: T,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<void> {
  try {
    const store = await tx("readwrite");
    const entry: CacheEntry<T> = {
      data,
      expiresAt: ttlMs > 0 ? Date.now() + ttlMs : 0,
    };
    await new Promise<void>((resolve, reject) => {
      const req = store.put(entry, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Cache writes are best-effort — never break the UI on storage failure.
  }
}

export async function cacheClear(key?: string): Promise<void> {
  try {
    const store = await tx("readwrite");
    await new Promise<void>((resolve, reject) => {
      const req = key ? store.delete(key) : store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore
  }
}
