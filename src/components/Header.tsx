import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Heart, Mail, User, Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function Header() {
  const { favorites, unreadMessages } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/veiculos", search: { q } as never });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo />
        <form onSubmit={submit} className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Busque por marca, modelo ou versão"
              className="h-10 w-full rounded-full border border-border bg-secondary pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>
        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link to="/veiculos" className="rounded-md px-3 py-2 hover:bg-secondary">Comprar</Link>
          <Link to="/anunciar" className="rounded-md px-3 py-2 hover:bg-secondary">Vender</Link>
          <Link to="/favoritos" className="relative rounded-md px-3 py-2 hover:bg-secondary">
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link to="/inbox" className="relative rounded-md px-3 py-2 hover:bg-secondary">
            <Mail className="h-5 w-5" />
            {unreadMessages > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link to="/dashboard" className="rounded-md px-3 py-2 hover:bg-secondary">
            <User className="h-5 w-5" />
          </Link>
          <Button asChild className="ml-2">
            <Link to="/anunciar"><Plus className="mr-1 h-4 w-4" />Anunciar</Link>
          </Button>
        </nav>
        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busque por marca ou modelo"
                className="h-10 w-full rounded-full border border-border bg-secondary pl-10 pr-4 text-sm outline-none"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1 text-sm">
            <Link to="/veiculos" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Comprar</Link>
            <Link to="/anunciar" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Vender</Link>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Minha conta</Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Admin</Link>
            <Link to="/auth" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-secondary">Entrar</Link>
          </div>
        </div>
      )}
    </header>
  );
}