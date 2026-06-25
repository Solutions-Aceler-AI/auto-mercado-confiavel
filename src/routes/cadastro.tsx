import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — AutoMarket" }] }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const [type, setType] = useState<"particular" | "loja" | null>(null);
  const [accept, setAccept] = useState(false);

  if (!type) {
    return (
      <div className="mx-auto grid max-w-2xl gap-6 px-4 py-10">
        <div className="text-center"><Logo /></div>
        <div className="card-surface p-6">
          <h1 className="text-xl font-black">Crie sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Como você pretende usar a AutoMarket?</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={() => setType("particular")} className="card-surface flex flex-col items-start gap-2 p-5 text-left transition hover:border-primary hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary"><User className="h-5 w-5" /></div>
              <div className="font-bold">Comprar / Vender (Particular)</div>
              <p className="text-xs text-muted-foreground">Pesquise milhares de anúncios e venda até 3 veículos simultâneos.</p>
            </button>
            <button onClick={() => setType("loja")} className="card-surface flex flex-col items-start gap-2 p-5 text-left transition hover:border-primary hover:shadow-md">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent"><Store className="h-5 w-5" /></div>
              <div className="font-bold">Loja / Revenda</div>
              <p className="text-xs text-muted-foreground">Perfil de loja, anúncios ilimitados e métricas avançadas.</p>
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Já tem conta? <Link to="/login" className="font-semibold text-primary hover:underline">Entrar</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6 px-4 py-10">
      <div className="text-center"><Logo /></div>
      <div className="card-surface p-6">
        <button onClick={() => setType(null)} className="mb-3 text-xs font-semibold text-primary hover:underline">← Trocar tipo de conta</button>
        <h1 className="text-xl font-black">{type === "loja" ? "Cadastro de Loja" : "Cadastro Particular"}</h1>
        <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={(e) => {
          e.preventDefault();
          if (!accept) return toast.error("Aceite os termos para continuar");
          toast.success("Conta criada! Verifique seu e-mail.");
          nav({ to: "/dashboard" });
        }}>
          <div className="sm:col-span-2"><Label>Nome completo *</Label><Input required /></div>
          <div><Label>E-mail *</Label><Input type="email" required /></div>
          <div><Label>Telefone *</Label><Input type="tel" required /></div>
          <div><Label>Senha *</Label><Input type="password" required minLength={8} /></div>
          <div><Label>Confirmar senha *</Label><Input type="password" required minLength={8} /></div>
          {type === "loja" && (
            <>
              <div><Label>CNPJ *</Label><Input required placeholder="00.000.000/0000-00" /></div>
              <div><Label>Razão social *</Label><Input required /></div>
              <div className="sm:col-span-2"><Label>Endereço comercial *</Label><Input required /></div>
              <div><Label>Telefone comercial *</Label><Input type="tel" required /></div>
              <div><Label>Horário de funcionamento *</Label><Input required placeholder="Seg–Sex 9h às 18h" /></div>
            </>
          )}
          <label className="sm:col-span-2 mt-2 flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5" />
            <span>Li e concordo com os <a className="text-primary hover:underline">Termos de Uso</a> e <a className="text-primary hover:underline">Política de Privacidade</a> (LGPD).</span>
          </label>
          <Button type="submit" className="sm:col-span-2">Criar conta</Button>
        </form>
      </div>
    </div>
  );
}