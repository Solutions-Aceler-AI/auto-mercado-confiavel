import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Filter as FilterIcon, SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/FilterSidebar";
import { VehicleCard } from "@/components/VehicleCard";
import { applyFilters, EMPTY_FILTERS, type Filters, type SortKey } from "@/lib/filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

type Search = { q?: string; brand?: string; category?: string };

export const Route = createFileRoute("/veiculos")({
  head: () => ({
    meta: [
      { title: "Buscar veículos — AutoMarket" },
      { name: "description", content: "Busque entre milhares de carros usados e seminovos no Brasil." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const search = Route.useSearch();
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    q: search.q ?? "",
    brand: search.brand ? [search.brand] : [],
    category: search.category ? [search.category] : [],
  });
  const [sort, setSort] = useState<SortKey>("relevance");
  const [debounced, setDebounced] = useState(filters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(filters); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [filters]);

  const results = useMemo(() => applyFilters(debounced, sort), [debounced, sort]);
  const visible = results.slice(0, page * 20);

  const set = (p: Partial<Filters>) => setFilters((f) => ({ ...f, ...p }));
  const reset = () => setFilters(EMPTY_FILTERS);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Veículos à venda</h1>
          <p className="text-sm text-muted-foreground">{results.length.toLocaleString("pt-BR")} resultados</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <FilterIcon className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] overflow-y-auto p-4 sm:max-w-md">
              <SheetHeader><SheetTitle>Filtros</SheetTitle></SheetHeader>
              <div className="mt-4">
                <FilterSidebar filters={filters} set={set} reset={reset} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-md border border-border bg-card pl-8 pr-3 text-sm outline-none focus:border-primary"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="newest">Mais recentes</option>
            </select>
          </div>
        </div>
      </div>

      <input
        value={filters.q}
        onChange={(e) => set({ q: e.target.value })}
        placeholder="Refinar por marca, modelo ou versão..."
        className="mb-4 h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <FilterSidebar filters={filters} set={set} reset={reset} />
          </div>
        </div>
        <div>
          {visible.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center gap-3 p-12 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary"><FilterIcon className="h-6 w-6 text-muted-foreground" /></div>
              <h3 className="text-lg font-bold">Nenhum veículo encontrado</h3>
              <p className="text-sm text-muted-foreground">Tente ampliar os filtros ou remover algumas restrições.</p>
              <Button variant="outline" onClick={reset}>Limpar filtros</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((v) => <VehicleCard key={v.id} v={v} />)}
              </div>
              {visible.length < results.length && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Carregar mais</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}