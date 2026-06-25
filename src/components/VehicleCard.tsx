import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Gauge, Calendar, Fuel as FuelIcon, Sparkles, Scale, Check } from "lucide-react";
import { type Vehicle, vehicleSlug } from "@/lib/mock-data";
import { BRL, KM } from "@/lib/format";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export function VehicleCard({ v }: { v: Vehicle }) {
  const { isFav, toggleFav, isCompared, toggleCompare } = useApp();
  const fav = isFav(v.id);
  const cmp = isCompared(v.id);

  const onCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = toggleCompare(v.id);
    if (!ok) toast.error("Você já selecionou 3 veículos para comparar.");
  };

  return (
    <Link
      to="/veiculos/$slug"
      params={{ slug: vehicleSlug(v) }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={v.images[0]}
          alt={`${v.brand} ${v.model} ${v.year}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {v.highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground shadow">
              <Sparkles className="h-3 w-3" /> Destaque
            </span>
          )}
          {v.isNew && (
            <span className="rounded-full bg-success px-2 py-0.5 text-[11px] font-bold text-success-foreground shadow">Novo</span>
          )}
          {v.seller.verified && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground shadow">Loja verificada</span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleFav(v.id); }}
            aria-label={fav ? "Remover dos favoritos" : "Favoritar"}
            className="grid h-9 w-9 place-items-center rounded-full bg-card/95 backdrop-blur shadow transition hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-accent text-accent" : "text-foreground"}`} />
          </button>
          <button
            onClick={onCompare}
            aria-label={cmp ? "Remover do comparador" : "Adicionar ao comparador"}
            className={`grid h-9 w-9 place-items-center rounded-full shadow transition hover:scale-110 ${cmp ? "bg-primary text-primary-foreground" : "bg-card/95 backdrop-blur"}`}
          >
            {cmp ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight">{v.brand} {v.model}</h3>
          <span className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{v.year}</span>
        </div>
        <p className="line-clamp-1 text-xs text-muted-foreground">{v.version}</p>
        <div className="mt-3 price-text text-xl">{BRL(v.price)}</div>
        <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{KM(v.km)}</span>
          <span className="inline-flex items-center gap-1"><FuelIcon className="h-3.5 w-3.5" />{v.fuel}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{v.gearbox}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{v.city}/{v.state}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">{v.seller.type === "loja" ? "Loja" : "Particular"}</span>
          <span className="font-medium">★ {v.seller.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}