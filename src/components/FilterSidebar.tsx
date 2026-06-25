import { BRANDS, CATEGORIES, FUELS, GEARBOXES, COLORS, STATES } from "@/lib/mock-data";
import type { Filters } from "@/lib/filters";
import { X } from "lucide-react";

export function FilterSidebar({ filters, set, reset }: { filters: Filters; set: (f: Partial<Filters>) => void; reset: () => void }) {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-t border-border py-4 first:border-t-0">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </div>
  );

  const NumberInput = ({ value, onChange, placeholder }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder: string }) => (
    <input
      type="number"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
      className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    />
  );

  const Chips = <T extends string>({ options, selected, onToggle }: { options: T[]; selected: T[]; onToggle: (v: T) => void }) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = selected.includes(o);
        return (
          <button
            key={o}
            onClick={() => onToggle(o)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );

  const toggle = <K extends keyof Filters>(key: K, value: string) => {
    const cur = (filters[key] as unknown as string[]) ?? [];
    const next = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
    set({ [key]: next } as unknown as Partial<Filters>);
  };

  return (
    <aside className="card-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold">Filtros</h3>
        <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" /> Limpar
        </button>
      </div>

      <Section title="Categoria">
        <Chips options={CATEGORIES} selected={filters.category} onToggle={(v) => toggle("category", v)} />
      </Section>

      <Section title="Marca">
        <div className="max-h-40 space-y-1 overflow-y-auto pr-1 text-sm">
          {BRANDS.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={filters.brand.includes(b)} onChange={() => toggle("brand", b)} className="accent-primary" />
              {b}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Preço (R$)">
        <div className="flex gap-2">
          <NumberInput value={filters.priceMin} onChange={(v) => set({ priceMin: v })} placeholder="Mín." />
          <NumberInput value={filters.priceMax} onChange={(v) => set({ priceMax: v })} placeholder="Máx." />
        </div>
      </Section>

      <Section title="Ano">
        <div className="flex gap-2">
          <NumberInput value={filters.yearMin} onChange={(v) => set({ yearMin: v })} placeholder="De" />
          <NumberInput value={filters.yearMax} onChange={(v) => set({ yearMax: v })} placeholder="Até" />
        </div>
      </Section>

      <Section title="Quilometragem">
        <div className="flex gap-2">
          <NumberInput value={filters.kmMin} onChange={(v) => set({ kmMin: v })} placeholder="Mín." />
          <NumberInput value={filters.kmMax} onChange={(v) => set({ kmMax: v })} placeholder="Máx." />
        </div>
      </Section>

      <Section title="Combustível">
        <Chips options={FUELS} selected={filters.fuel} onToggle={(v) => toggle("fuel", v)} />
      </Section>

      <Section title="Câmbio">
        <Chips options={GEARBOXES} selected={filters.gearbox} onToggle={(v) => toggle("gearbox", v)} />
      </Section>

      <Section title="Cor">
        <Chips options={COLORS} selected={filters.color} onToggle={(v) => toggle("color", v)} />
      </Section>

      <Section title="Estado">
        <Chips options={STATES} selected={filters.state} onToggle={(v) => toggle("state", v)} />
      </Section>
    </aside>
  );
}