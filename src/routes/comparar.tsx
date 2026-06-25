import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { VEHICLES, vehicleSlug } from "@/lib/mock-data";
import { BRL, KM } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/comparar")({
  head: () => ({ meta: [{ title: "Comparar veículos — AutoMarket" }] }),
  component: ComparePage,
});

function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useApp();
  const items = compare.map((id) => VEHICLES.find((v) => v.id === id)!).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary"><Scale className="h-7 w-7 text-muted-foreground" /></div>
        <h1 className="mt-4 text-2xl font-black">Comparador vazio</h1>
        <p className="mt-1 text-muted-foreground">Selecione até 3 veículos nos resultados de busca para comparar lado a lado.</p>
        <Button asChild className="mt-6"><Link to="/veiculos">Buscar veículos</Link></Button>
      </div>
    );
  }

  const rows: { label: string; get: (v: typeof items[number]) => React.ReactNode }[] = [
    { label: "Preço", get: (v) => <span className="price-text">{BRL(v.price)}</span> },
    { label: "Ano", get: (v) => v.year },
    { label: "Quilometragem", get: (v) => KM(v.km) },
    { label: "Combustível", get: (v) => v.fuel },
    { label: "Câmbio", get: (v) => v.gearbox },
    { label: "Potência", get: (v) => `${v.power} cv` },
    { label: "Cor", get: (v) => v.color },
    { label: "Cidade", get: (v) => `${v.city}/${v.state}` },
    { label: "Vendedor", get: (v) => v.seller.name },
    { label: "Avaliação", get: (v) => `★ ${v.seller.rating.toFixed(1)}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black sm:text-3xl">Comparador</h1>
        <Button variant="outline" size="sm" onClick={clearCompare}>Limpar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-32 p-2 text-left text-sm text-muted-foreground"></th>
              {items.map((v) => (
                <th key={v.id} className="p-2 text-left align-top">
                  <div className="card-surface relative overflow-hidden p-3">
                    <button onClick={() => toggleCompare(v.id)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-secondary hover:bg-card"><X className="h-3.5 w-3.5" /></button>
                    <img src={v.images[0]} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                    <div className="mt-2 font-bold leading-tight">{v.brand} {v.model}</div>
                    <div className="text-xs text-muted-foreground">{v.version}</div>
                    <Link to="/veiculos/$slug" params={{ slug: vehicleSlug(v) }} className="mt-2 inline-block text-xs font-semibold text-primary hover:underline">Ver anúncio</Link>
                  </div>
                </th>
              ))}
              {items.length < 3 && (
                <th className="p-2 align-top">
                  <Link to="/veiculos" className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary">+ Adicionar</Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="border-t border-border p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{r.label}</td>
                {items.map((v) => (
                  <td key={v.id} className="border-t border-border p-3 text-sm font-medium">{r.get(v)}</td>
                ))}
                {items.length < 3 && <td className="border-t border-border" />}
              </tr>
            ))}
            <tr>
              <td className="border-t border-border p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Equipamentos</td>
              {items.map((v) => (
                <td key={v.id} className="border-t border-border p-3 text-xs">
                  <ul className="space-y-1">
                    {v.features.slice(0, 8).map((f) => <li key={f}>✓ {f}</li>)}
                  </ul>
                </td>
              ))}
              {items.length < 3 && <td className="border-t border-border" />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}