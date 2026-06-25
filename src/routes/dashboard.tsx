import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Heart, MessageCircle, TrendingUp, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VEHICLES, MOCK_LEADS } from "@/lib/mock-data";
import { BRL } from "@/lib/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Meu painel — AutoMarket" }] }),
  component: Dashboard,
});

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  novo: { label: "Novo", cls: "bg-accent text-accent-foreground" },
  em_contato: { label: "Em contato", cls: "bg-warning text-warning-foreground" },
  convertido: { label: "Convertido", cls: "bg-success text-success-foreground" },
  perdido: { label: "Perdido", cls: "bg-muted text-muted-foreground" },
  ativo: { label: "Ativo", cls: "bg-success text-success-foreground" },
  pendente: { label: "Pendente", cls: "bg-warning text-warning-foreground" },
  rejeitado: { label: "Rejeitado", cls: "bg-destructive text-destructive-foreground" },
};

function Dashboard() {
  const myAds = VEHICLES.slice(0, 4);
  const kpis = [
    { i: Eye, l: "Visualizações", v: "12.4k", d: "+18% vs. semana" },
    { i: Heart, l: "Favoritos recebidos", v: "284", d: "+8% vs. semana" },
    { i: MessageCircle, l: "Leads", v: String(MOCK_LEADS.length), d: "Esta semana" },
    { i: TrendingUp, l: "Conversão", v: "4,8%", d: "Lead → contato" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Olá, Lucas 👋</h1>
          <p className="text-sm text-muted-foreground">Aqui está um resumo da sua atividade</p>
        </div>
        <Button asChild><Link to="/anunciar"><Plus className="mr-1 h-4 w-4" />Novo anúncio</Link></Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="card-surface p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><k.i className="h-4 w-4" /> {k.l}</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight">{k.v}</div>
            <div className="text-xs text-success">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Meus anúncios</h2>
          <div className="card-surface divide-y divide-border">
            {myAds.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3">
                <img src={v.images[0]} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{v.brand} {v.model} {v.year}</div>
                  <div className="truncate text-xs text-muted-foreground">{v.version}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{v.views}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{Math.floor(v.views / 12)}</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="price-text">{BRL(v.price)}</div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_LABEL.ativo.cls}`}>Ativo</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">Leads recentes</h2>
          <div className="card-surface divide-y divide-border">
            {MOCK_LEADS.map((l) => {
              const s = STATUS_LABEL[l.status]!;
              return (
                <div key={l.id} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold">{l.buyerName}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.cls}`}>{s.label}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{l.preview}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Avaliações recebidas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { n: "Pedro M.", r: 5, t: "Atendimento impecável, carro exatamente como descrito." },
            { n: "Beatriz S.", r: 4, t: "Vendedor responde rápido. Negócio fechado em 2 dias." },
          ].map((r, i) => (
            <div key={i} className="card-surface p-4">
              <div className="flex items-center justify-between"><div className="font-semibold">{r.n}</div>
                <div className="inline-flex items-center gap-0.5">{Array.from({ length: r.r }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-accent text-accent" />)}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}