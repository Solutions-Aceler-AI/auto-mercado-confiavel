import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — AutoMarket" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-10">
      <div className="text-center"><Logo /></div>
      <div className="card-surface p-6">
        <h1 className="text-xl font-black">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para anunciar, favoritar e conversar com vendedores.</p>
        <form className="mt-5 space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Bem-vindo de volta!"); nav({ to: "/dashboard" }); }}>
          <div><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" /></div>
          <div><Label>Senha</Label><Input type="password" required value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" /></div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <div className="my-4 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">ou</span><div className="h-px flex-1 bg-border" /></div>
        <Button variant="outline" className="w-full" onClick={() => { toast.success("Conectado com Google"); nav({ to: "/dashboard" }); }}>Continuar com Google</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">Não tem conta? <Link to="/cadastro" className="font-semibold text-primary hover:underline">Cadastre-se</Link></p>
      </div>
    </div>
  );
}