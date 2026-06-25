import { Link } from "@tanstack/react-router";
import { X, Scale } from "lucide-react";
import { useApp } from "@/lib/store";
import { VEHICLES } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useApp();
  if (compare.length === 0) return null;
  const items = compare.map((id) => VEHICLES.find((v) => v.id === id)).filter(Boolean);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-card shadow-elevated md:bottom-0">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="hidden items-center gap-2 text-sm font-semibold sm:flex">
          <Scale className="h-4 w-4 text-primary" /> Comparar ({compare.length}/3)
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {items.map((v) => v && (
            <div key={v.id} className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary py-1 pl-2 pr-1 text-xs">
              <span className="font-medium">{v.brand} {v.model}</span>
              <button onClick={() => toggleCompare(v.id)} className="grid h-5 w-5 place-items-center rounded-full hover:bg-card" aria-label="Remover">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={clearCompare} className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline">Limpar</button>
        <Button asChild size="sm" disabled={compare.length < 2}>
          <Link to="/comparar">Comparar</Link>
        </Button>
      </div>
    </div>
  );
}