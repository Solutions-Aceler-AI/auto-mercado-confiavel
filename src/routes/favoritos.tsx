import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useApp } from "@/lib/store";
import { VEHICLES } from "@/lib/mock-data";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favoritos")({
  head: () => ({ meta: [{ title: "Meus favoritos — AutoMarket" }] }),
  component: FavPage,
});

function FavPage() {
  const { favorites } = useApp();
  const items = VEHICLES.filter((v) => favorites.includes(v.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-black sm:text-3xl">Meus favoritos</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length === 1 ? "veículo salvo" : "veículos salvos"}</p>

      {items.length === 0 ? (
        <div className="mt-8 card-surface flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary"><Heart className="h-6 w-6 text-muted-foreground" /></div>
          <h3 className="text-lg font-bold">Você ainda não tem favoritos</h3>
          <p className="text-sm text-muted-foreground">Toque no coração em qualquer anúncio para salvá-lo aqui.</p>
          <Button asChild className="mt-2"><Link to="/veiculos">Buscar veículos</Link></Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}