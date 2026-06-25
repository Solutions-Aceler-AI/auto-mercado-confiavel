import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Mensagens — AutoMarket" }] }),
  component: InboxPage,
});

function InboxPage() {
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0]?.id);
  const [draft, setDraft] = useState("");
  const { clearInbox } = useApp();
  const active = MOCK_CONVERSATIONS.find((c) => c.id === activeId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black sm:text-3xl">Mensagens</h1>
        <Button variant="ghost" size="sm" onClick={clearInbox}>Marcar todas como lidas</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="card-surface divide-y divide-border lg:max-h-[70vh] lg:overflow-y-auto">
          {MOCK_CONVERSATIONS.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)}
              className={`flex w-full items-start gap-3 p-3 text-left transition hover:bg-secondary ${activeId === c.id ? "bg-secondary" : ""}`}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {c.with.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate font-semibold">{c.with}</div>
                  <div className="shrink-0 text-[10px] text-muted-foreground">{c.time}</div>
                </div>
                <div className="truncate text-xs text-muted-foreground">{c.vehicle}</div>
                <div className="mt-0.5 truncate text-xs">{c.preview}</div>
              </div>
              {c.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
            </button>
          ))}
        </aside>

        <section className="card-surface flex flex-col lg:max-h-[70vh]">
          {active ? (
            <>
              <header className="border-b border-border p-4">
                <div className="font-bold">{active.with}</div>
                <div className="text-xs text-muted-foreground">Sobre: {active.vehicle}</div>
              </header>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {active.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary text-foreground"}`}>
                      {m.text}
                      <div className={`mt-1 text-[10px] ${m.mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="border-t border-border p-3">
                <div className="flex items-end gap-2">
                  <Textarea rows={2} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escreva uma mensagem…" />
                  <Button onClick={() => setDraft("")} disabled={!draft.trim()}><Send className="h-4 w-4" /></Button>
                </div>
              </footer>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-12 text-sm text-muted-foreground">Selecione uma conversa</div>
          )}
        </section>
      </div>
    </div>
  );
}