import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  favorites: string[];
  toggleFav: (id: string) => void;
  isFav: (id: string) => boolean;
  compare: string[];
  toggleCompare: (id: string) => boolean; // returns success
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
  unreadMessages: number;
  clearInbox: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

const readLS = (k: string): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(k) ?? "[]");
  } catch {
    return [];
  }
};

export function AppProviders({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [unreadMessages, setUnread] = useState<number>(3);

  useEffect(() => {
    setFavorites(readLS("am.favs"));
    setCompare(readLS("am.compare"));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("am.favs", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("am.compare", JSON.stringify(compare));
  }, [compare]);

  const toggleFav = useCallback((id: string) => {
    setFavorites((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }, []);
  const isFav = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleCompare = useCallback(
    (id: string) => {
      let success = true;
      setCompare((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length >= 3) {
          success = false;
          return prev;
        }
        return [...prev, id];
      });
      return success;
    },
    [],
  );
  const clearCompare = useCallback(() => setCompare([]), []);
  const isCompared = useCallback((id: string) => compare.includes(id), [compare]);

  const value = useMemo<Ctx>(
    () => ({ favorites, toggleFav, isFav, compare, toggleCompare, clearCompare, isCompared, unreadMessages, clearInbox: () => setUnread(0) }),
    [favorites, compare, toggleFav, isFav, toggleCompare, clearCompare, isCompared, unreadMessages],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProviders");
  return ctx;
}