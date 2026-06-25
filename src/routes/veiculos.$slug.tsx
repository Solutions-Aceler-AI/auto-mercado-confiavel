import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Share2, MessageCircle, Phone, MapPin, Flag, ChevronLeft, ChevronRight, Star, Check } from "lucide-react";
import { findVehicleBySlug, similarVehicles, vehicleSlug, type Vehicle } from "@/lib/mock-data";
import { BRL, KM } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/VehicleCard";
import { useApp } from "@/lib/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/veiculos/$slug")({
  loader: ({ params }) => {
    const v = findVehicleBySlug(params.slug);
    if (!v) throw notFound();
    return { vehicle: v };
  },
  head: ({ loaderData }) => {
    const v = loaderData?.vehicle;
    if (!v) return { meta: [{ title: "Veículo não encontrado — AutoMarket" }] };
    const t = `${v.brand} ${v.model} ${v.year} — ${BRL(v.price)} | AutoMarket`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `${v.brand} ${v.model} ${v.version} ${v.year}, ${KM(v.km)}, ${v.fuel}, ${v.city}/${v.state}. ${BRL(v.price)}.` },
        { property: "og:title", content: t },
        { property: "og:image", content: v.images[0] },
      ],
    };
  },
  component: VehicleDetail,
});

function VehicleDetail() {
  const data = Route.useLoaderData() as { vehicle: Vehicle };
  const v = data.vehicle;
  const { isFav, toggleFav } = useApp();
  const fav = isFav(v.id);
  const [idx, setIdx] = useState(0);
  const similar = similarVehicles(v);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: `${v.brand} ${v.model}`, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copiado!"); }
    } catch {}
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/veiculos" className="mb-3 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Voltar para resultados
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Galeria */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <img src={v.images[idx]} alt={`${v.brand} ${v.model}`} className="aspect-[16/10] w-full object-cover" width={1600} height={1000} />
            {v.images.length > 1 && (
              <>
                <button onClick={() => setIdx((i) => (i - 1 + v.images.length) % v.images.length)} className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow hover:scale-105"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setIdx((i) => (i + 1) % v.images.length)} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow hover:scale-105"><ChevronRight className="h-5 w-5" /></button>
              </>
            )}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {v.images.map((src, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === idx ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 card-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black sm:text-3xl">{v.brand} {v.model} {v.year}</h1>
                <p className="text-muted-foreground">{v.version}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {v.city} / {v.state}
                </p>
              </div>
              <div className="price-text text-4xl">{BRL(v.price)}</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { l: "Ano", v: v.year },
                { l: "Km", v: KM(v.km) },
                { l: "Combustível", v: v.fuel },
                { l: "Câmbio", v: v.gearbox },
              ].map((x) => (
                <div key={x.l} className="rounded-xl bg-secondary p-3">
                  <div className="text-xs text-muted-foreground">{x.l}</div>
                  <div className="font-bold">{x.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 card-surface p-6">
            <h2 className="mb-2 font-bold">Descrição</h2>
            <p className="whitespace-pre-line text-sm text-muted-foreground">{v.description}</p>
          </div>

          <div className="mt-6 card-surface p-6">
            <h2 className="mb-3 font-bold">Ficha técnica</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {[
                ["Marca", v.brand], ["Modelo", v.model], ["Versão", v.version],
                ["Ano", String(v.year)], ["Quilometragem", KM(v.km)], ["Combustível", v.fuel],
                ["Câmbio", v.gearbox], ["Cor", v.color], ["Portas", String(v.doors)],
                ["Potência", `${v.power} cv`], ["Categoria", v.category],
              ].map(([k, val]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          {v.features.length > 0 && (
            <div className="mt-6 card-surface p-6">
              <h2 className="mb-3 font-bold">Equipamentos</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {v.features.map((f) => (
                  <li key={f} className="inline-flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-success" />{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{v.seller.type === "loja" ? "Loja" : "Vendedor particular"}</p>
                <h3 className="font-bold">{v.seller.name}</h3>
              </div>
              {v.seller.verified && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">Verificado</span>}
            </div>
            <div className="mt-2 inline-flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" /> {v.seller.rating.toFixed(1)}
              <span className="text-muted-foreground">({v.seller.reviews} avaliações)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Responde em ~{v.seller.responseHours}h</p>
            <div className="mt-4 space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full"><MessageCircle className="mr-2 h-4 w-4" />Enviar mensagem</Button>
                </DialogTrigger>
                <ContactDialog title="Enviar mensagem" defaultMsg={`Olá, tenho interesse no ${v.brand} ${v.model}.`} />
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full"><Phone className="mr-2 h-4 w-4" />Solicitar ligação</Button>
                </DialogTrigger>
                <ContactDialog title="Solicitar ligação" call />
              </Dialog>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toggleFav(v.id)} className="flex-1">
                  <Heart className={`mr-2 h-4 w-4 ${fav ? "fill-accent text-accent" : ""}`} />{fav ? "Salvo" : "Favoritar"}
                </Button>
                <Button variant="outline" onClick={share} aria-label="Compartilhar"><Share2 className="h-4 w-4" /></Button>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="mt-2 inline-flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <Flag className="h-3 w-3" /> Denunciar anúncio
                  </button>
                </DialogTrigger>
                <ReportDialog />
              </Dialog>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-black">Veículos similares</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((s) => <VehicleCard key={s.id} v={s} />)}
          </div>
        </section>
      )}

      <p className="mt-8 text-xs text-muted-foreground">URL: /veiculos/{vehicleSlug(v)}</p>
    </div>
  );
}

function ContactDialog({ title, defaultMsg, call }: { title: string; defaultMsg?: string; call?: boolean }) {
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Lead enviado ao vendedor!"); (e.target as HTMLFormElement).reset(); }} className="space-y-3">
        <Input required placeholder="Seu nome" />
        <Input required type="email" placeholder="Seu e-mail" />
        <Input required placeholder="Telefone com DDD" />
        {call ? (
          <Input type="time" defaultValue="14:00" required />
        ) : (
          <Textarea required defaultValue={defaultMsg} rows={4} placeholder="Mensagem" />
        )}
        <Button type="submit" className="w-full">Enviar</Button>
      </form>
    </DialogContent>
  );
}
function ReportDialog() {
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Denunciar anúncio</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Denúncia registrada. Nossa equipe vai analisar."); }} className="space-y-3">
        <select className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm">
          <option>Preço suspeito</option>
          <option>Anúncio duplicado</option>
          <option>Conteúdo ofensivo</option>
          <option>Fraude/golpe</option>
        </select>
        <Textarea rows={3} placeholder="Conte mais detalhes (opcional)" />
        <Button type="submit" variant="destructive" className="w-full">Enviar denúncia</Button>
      </form>
    </DialogContent>
  );
}