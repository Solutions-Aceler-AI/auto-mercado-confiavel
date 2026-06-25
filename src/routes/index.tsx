import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck, Scale, Zap } from "lucide-react";
import heroImg from "@/assets/hero-car.jpg";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/VehicleCard";
import { VEHICLES, CATEGORIES, BRANDS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoMarket — Marketplace de carros usados e seminovos" },
      { name: "description", content: "Encontre carros usados e seminovos no maior marketplace automotivo nacional. Busca avançada, comparador e leads qualificados." },
      { property: "og:title", content: "AutoMarket — Marketplace automotivo nacional" },
      { property: "og:description", content: "Compre e venda carros com filtros avançados, comparador e milhares de anúncios." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const featured = VEHICLES.filter((v) => v.highlighted).slice(0, 8);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/veiculos", search: { q } as never });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" width={1600} height={1024} className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30">
            <Zap className="h-3.5 w-3.5" /> Mais de 6.900 anúncios ativos
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
            Encontre o carro <span className="text-accent">ideal</span><br />em segundos.
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
            Compare modelos, filtre por marca, preço, ano e quilometragem. Anuncie em minutos e receba leads qualificados.
          </p>

          <form onSubmit={submit} className="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex: Toyota Corolla, Hilux, Onix..."
                className="h-14 w-full rounded-xl border border-transparent bg-card pl-12 pr-4 text-base text-foreground outline-none ring-2 ring-transparent transition focus:ring-accent"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 bg-accent text-accent-foreground hover:bg-accent/90">
              Buscar veículos
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="opacity-70">Populares:</span>
            {["Hilux", "Corolla", "Onix", "Civic", "Compass"].map((s) => (
              <button key={s} onClick={() => navigate({ to: "/veiculos", search: { q: s } as never })} className="rounded-full bg-primary-foreground/10 px-3 py-1 hover:bg-primary-foreground/20">
                {s}
              </button>
            ))}
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: "6.9k+", l: "Anúncios ativos" },
              { v: "28k+", l: "Usuários" },
              { v: "1.2k", l: "Lojas verificadas" },
              { v: "4.8★", l: "Avaliação média" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-primary-foreground/5 p-3 ring-1 ring-primary-foreground/10 backdrop-blur">
                <div className="text-xl font-extrabold text-accent">{s.v}</div>
                <div className="text-xs text-primary-foreground/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-black sm:text-3xl">Navegue por categoria</h2>
        <p className="mt-1 text-muted-foreground">Escolha o tipo de veículo que combina com você.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to="/veiculos"
              search={{ category: c } as never}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Scale className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Em destaque</h2>
            <p className="mt-1 text-muted-foreground">Anúncios selecionados pelos vendedores em destaque.</p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link to="/veiculos">Ver todos</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>
      </section>

      {/* MARCAS */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-black sm:text-3xl">Marcas populares</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <Link key={b} to="/veiculos" search={{ brand: b } as never}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary">
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* VENDA */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">Anuncie seu carro em <span className="text-accent">3 minutos</span></h2>
            <p className="mt-3 text-muted-foreground">Cadastro grátis, fotos ilimitadas, e leads de compradores reais direto na sua caixa de entrada.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { i: ShieldCheck, t: "Verificação de e-mail e moderação humana." },
                { i: Zap, t: "Sugestão automática de faixa de preço de mercado." },
                { i: Scale, t: "Comparador embutido aumenta o interesse pelo seu anúncio." },
              ].map((x, i) => (
                <li key={i} className="flex gap-3">
                  <x.i className="h-5 w-5 shrink-0 text-primary" /> {x.t}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8">
              <Link to="/anunciar">Publicar anúncio grátis</Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
            <img src={heroImg} alt="Anuncie seu veículo" loading="lazy" width={1600} height={1024} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
