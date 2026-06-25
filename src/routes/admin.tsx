import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, FileText, Clock, Ban, ShieldCheck, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_KPIS, VEHICLES } from "@/lib/mock-data";
import { BRL } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel administrativo — AutoMarket" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"kpis" | "moderacao" | "denuncias" | "usuarios">("kpis");

  const tabs: { id: typeof tab; label: string }[] = [
    { id: "kpis", label: "Visão geral" },
    { id: "moderacao", label: "Moderação" },
    { id: "denuncias", label: "Denúncias" },
    { id: "usuarios", label: "Usuários" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-black sm:text-3xl">Painel administrativo</h1>
      </div>
      <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`whitespace-nowrap px-4 py-2 text-sm font-semibold transition ${tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "kpis" && <Kpis />}
        {tab === "moderacao" && <Moderacao />}
        {tab === "denuncias" && <Denuncias />}
        {tab === "usuarios" && <Usuarios />}
      </div>
    </div>
  );
}

function Kpis() {
  const cards = [
    { i: Users, l: "Usuários totais", v: MOCK_KPIS.totalUsers.toLocaleString("pt-BR") },
    { i: Users, l: "Novos (30d)", v: `+${MOCK_KPIS.newUsers30d.toLocaleString("pt-BR")}` },
    { i: FileText, l: "Anúncios ativos", v: MOCK_KPIS.activeAds.toLocaleString("pt-BR") },
    { i: Clock, l: "Pendentes", v: MOCK_KPIS.pendingAds.toLocaleString("pt-BR") },
    { i: AlertTriangle, l: "Rejeitados", v: MOCK_KPIS.rejectedAds.toLocaleString("pt-BR") },
    { i: FileText, l: "Total cadastrado", v: MOCK_KPIS.totalAds.toLocaleString("pt-BR") },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div key={c.l} className="card-surface p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><c.i className="h-4 w-4" /> {c.l}</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight">{c.v}</div>
        </div>
      ))}
    </div>
  );
}

function Moderacao() {
  const [items, setItems] = useState(VEHICLES.slice(0, 6));
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const approve = (id: string) => { setItems((p) => p.filter((v) => v.id !== id)); toast.success("Anúncio aprovado"); };
  const reject = (id: string) => {
    if (!reason.trim()) return toast.error("Informe um motivo");
    setItems((p) => p.filter((v) => v.id !== id));
    setRejecting(null); setReason("");
    toast.success("Anúncio rejeitado");
  };

  return (
    <div className="card-surface divide-y divide-border">
      {items.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Fila vazia. Bom trabalho!</div>}
      {items.map((v) => (
        <div key={v.id} className="p-3">
          <div className="flex flex-wrap items-center gap-3">
            <img src={v.images[0]} alt="" className="h-16 w-24 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{v.brand} {v.model} {v.year}</div>
              <div className="truncate text-xs text-muted-foreground">{v.version} • {v.city}/{v.state}</div>
              <div className="price-text text-sm">{BRL(v.price)}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => approve(v.id)}><Check className="mr-1 h-3.5 w-3.5" />Aprovar</Button>
              <Button size="sm" variant="outline" onClick={() => setRejecting(v.id)}><X className="mr-1 h-3.5 w-3.5" />Rejeitar</Button>
            </div>
          </div>
          {rejecting === v.id && (
            <div className="mt-3 flex gap-2">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo da rejeição (obrigatório)" />
              <Button size="sm" variant="destructive" onClick={() => reject(v.id)}>Confirmar</Button>
              <Button size="sm" variant="ghost" onClick={() => { setRejecting(null); setReason(""); }}>Cancelar</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Denuncias() {
  const reports = [
    { id: "r1", vehicle: "Honda Civic 2021", reporter: "user_482", reason: "Preço suspeito" },
    { id: "r2", vehicle: "Jeep Compass 2020", reporter: "user_109", reason: "Fotos não conferem" },
  ];
  return (
    <div className="card-surface divide-y divide-border">
      {reports.map((r) => (
        <div key={r.id} className="flex flex-wrap items-center gap-3 p-3">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{r.vehicle}</div>
            <div className="text-xs text-muted-foreground">Reportado por {r.reporter} — {r.reason}</div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toast.success("Denúncia arquivada")}>Arquivar</Button>
            <Button size="sm" variant="destructive" onClick={() => toast.success("Anúncio suspenso")}>Suspender</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Usuarios() {
  const users = [
    { id: "u1", name: "Carlos Mendes", email: "carlos@example.com", type: "Particular", status: "ativo" },
    { id: "u2", name: "Premium Motors", email: "contato@premium.com", type: "Loja", status: "ativo" },
    { id: "u3", name: "Spam User", email: "spam@x.com", type: "Particular", status: "suspenso" },
  ];
  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full min-w-[600px] text-sm">
        <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
          <tr><th className="p-3 text-left">Nome</th><th className="p-3 text-left">E-mail</th><th className="p-3 text-left">Tipo</th><th className="p-3 text-left">Status</th><th className="p-3 text-right">Ações</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-3 font-semibold">{u.name}</td>
              <td className="p-3 text-muted-foreground">{u.email}</td>
              <td className="p-3">{u.type}</td>
              <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${u.status === "ativo" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>{u.status}</span></td>
              <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => toast.success("Ação registrada")}><Ban className="mr-1 h-3.5 w-3.5" />Suspender</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}