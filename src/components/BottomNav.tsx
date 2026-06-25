import { Link } from "@tanstack/react-router";
import { Search, Heart, Plus, Mail, User } from "lucide-react";
import { useApp } from "@/lib/store";

export function BottomNav() {
  const { favorites, unreadMessages } = useApp();
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-muted-foreground transition data-[status=active]:text-primary";
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <Link to="/veiculos" className={item} activeProps={{ "data-status": "active" } as never}>
        <Search className="h-5 w-5" />
        Buscar
      </Link>
      <Link to="/favoritos" className={item} activeProps={{ "data-status": "active" } as never}>
        <div className="relative">
          <Heart className="h-5 w-5" />
          {favorites.length > 0 && <span className="absolute -top-1 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{favorites.length}</span>}
        </div>
        Favoritos
      </Link>
      <Link to="/anunciar" className="flex flex-1 flex-col items-center justify-center -mt-4">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg">
          <Plus className="h-6 w-6" />
        </span>
        <span className="mt-0.5 text-[11px] font-medium">Anunciar</span>
      </Link>
      <Link to="/inbox" className={item} activeProps={{ "data-status": "active" } as never}>
        <div className="relative">
          <Mail className="h-5 w-5" />
          {unreadMessages > 0 && <span className="absolute -top-1 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{unreadMessages}</span>}
        </div>
        Inbox
      </Link>
      <Link to="/dashboard" className={item} activeProps={{ "data-status": "active" } as never}>
        <User className="h-5 w-5" />
        Perfil
      </Link>
    </nav>
  );
}