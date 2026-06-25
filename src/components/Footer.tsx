import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            O marketplace nacional de carros usados e seminovos. Conectando compradores, vendedores particulares e lojas em todo o Brasil.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Comprar</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/veiculos" className="hover:text-foreground">Buscar veículos</Link></li>
            <li><Link to="/comparar" className="hover:text-foreground">Comparador</Link></li>
            <li><Link to="/favoritos" className="hover:text-foreground">Favoritos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Vender</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/anunciar" className="hover:text-foreground">Publicar anúncio</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Meus anúncios</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Para lojas</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-bold">Empresa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Sobre</a></li>
            <li><a href="#" className="hover:text-foreground">Termos de uso</a></li>
            <li><a href="#" className="hover:text-foreground">Política de privacidade</a></li>
            <li><a href="#" className="hover:text-foreground">Contato</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AutoMarket. Todos os direitos reservados.
      </div>
    </footer>
  );
}