import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BRANDS, CATEGORIES, FUELS, GEARBOXES, COLORS, STATES, CITIES } from "@/lib/mock-data";
import { BRL } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/anunciar")({
  head: () => ({ meta: [{ title: "Anunciar veículo — AutoMarket" }] }),
  component: AnunciarPage,
});

const STEPS = [
  "Dados básicos", "Características", "Preço", "Descrição", "Fotos", "Revisão",
];

type FormState = {
  brand: string; model: string; version: string; year: string; category: string;
  km: string; fuel: string; gearbox: string; color: string; doors: string; power: string;
  price: string;
  description: string;
  city: string; state: string;
  images: { id: string; url: string }[];
};

const initial: FormState = {
  brand: "", model: "", version: "", year: "", category: "",
  km: "", fuel: "", gearbox: "", color: "", doors: "4", power: "",
  price: "",
  description: "",
  city: "", state: "",
  images: [],
};

function AnunciarPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const navigate = useNavigate();
  const set = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  const next = () => { setStep((s) => Math.min(STEPS.length - 1, s + 1)); toast.success("Rascunho salvo"); };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 20 - form.images.length).map((f) => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
    }));
    set({ images: [...form.images, ...arr].slice(0, 20) });
  };

  const publish = () => {
    toast.success("Anúncio enviado para moderação!");
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  };

  const canNext = (() => {
    switch (step) {
      case 0: return form.brand && form.model && form.year && form.category;
      case 1: return form.km && form.fuel && form.gearbox && form.color;
      case 2: return Number(form.price) > 0;
      case 3: return form.description.length >= 50 && form.description.length <= 2000;
      case 4: return form.images.length >= 3;
      default: return true;
    }
  })();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-black sm:text-3xl">Anunciar veículo</h1>
      <p className="mt-1 text-sm text-muted-foreground">Etapa {step + 1} de {STEPS.length}: {STEPS[step]}</p>

      {/* Progress */}
      <div className="mt-4 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${i < step ? "bg-success text-success-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-success" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-6 card-surface p-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Marca *"><Select value={form.brand} onChange={(v) => set({ brand: v })} options={BRANDS} placeholder="Selecione" /></Field>
            <Field label="Modelo *"><Input value={form.model} onChange={(e) => set({ model: e.target.value })} placeholder="Ex: Corolla" /></Field>
            <Field label="Versão"><Input value={form.version} onChange={(e) => set({ version: e.target.value })} placeholder="Ex: 2.0 XEi Flex" /></Field>
            <Field label="Ano *"><Input type="number" min={1950} max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => set({ year: e.target.value })} placeholder="2022" /></Field>
            <Field label="Categoria *" className="sm:col-span-2"><Select value={form.category} onChange={(v) => set({ category: v })} options={CATEGORIES} placeholder="Selecione" /></Field>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quilometragem *"><Input type="number" value={form.km} onChange={(e) => set({ km: e.target.value })} placeholder="Ex: 45000" /></Field>
            <Field label="Combustível *"><Select value={form.fuel} onChange={(v) => set({ fuel: v })} options={FUELS} placeholder="Selecione" /></Field>
            <Field label="Câmbio *"><Select value={form.gearbox} onChange={(v) => set({ gearbox: v })} options={GEARBOXES} placeholder="Selecione" /></Field>
            <Field label="Cor *"><Select value={form.color} onChange={(v) => set({ color: v })} options={COLORS} placeholder="Selecione" /></Field>
            <Field label="Portas"><Input type="number" value={form.doors} onChange={(e) => set({ doors: e.target.value })} /></Field>
            <Field label="Potência (cv)"><Input type="number" value={form.power} onChange={(e) => set({ power: e.target.value })} placeholder="Ex: 130" /></Field>
            <Field label="Estado"><Select value={form.state} onChange={(v) => set({ state: v, city: "" })} options={STATES} placeholder="UF" /></Field>
            <Field label="Cidade"><Select value={form.city} onChange={(v) => set({ city: v })} options={CITIES[form.state] ?? []} placeholder="Selecione" /></Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4">
            <Field label="Preço de venda (R$) *"><Input type="number" value={form.price} onChange={(e) => set({ price: e.target.value })} placeholder="80000" /></Field>
            <div className="rounded-xl bg-primary-soft p-4 text-sm">
              <p className="font-semibold text-primary">Sugestão de mercado</p>
              <p className="mt-1 text-foreground">Anúncios similares variam entre <strong>{BRL(72000)}</strong> e <strong>{BRL(95000)}</strong>. Preços competitivos vendem 2x mais rápido.</p>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4">
            <Field label="Descrição *">
              <Textarea rows={8} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="Descreva estado de conservação, equipamentos, único dono, revisões, etc." />
              <p className={`mt-1 text-xs ${form.description.length >= 50 && form.description.length <= 2000 ? "text-muted-foreground" : "text-destructive"}`}>
                {form.description.length}/2000 (mínimo 50)
              </p>
            </Field>
          </div>
        )}
        {step === 4 && (
          <div>
            <label htmlFor="upl" className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary">
              <Upload className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-semibold">Arraste fotos aqui ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground">Mínimo 3, máximo 20 fotos. A primeira será a capa.</p>
              <input id="upl" type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
            </label>
            {form.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.images.map((img, i) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border">
                    <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
                    {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">Capa</span>}
                    <button onClick={() => set({ images: form.images.filter((x) => x.id !== img.id) })} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-card/90 opacity-0 transition group-hover:opacity-100">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{form.images.length}/20 fotos</p>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-bold">Revisão do anúncio</h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Veículo", `${form.brand} ${form.model} ${form.version}`],
                ["Ano", form.year], ["Categoria", form.category],
                ["Km", form.km], ["Combustível", form.fuel], ["Câmbio", form.gearbox],
                ["Cor", form.color], ["Localização", `${form.city}/${form.state}`],
                ["Preço", form.price ? BRL(Number(form.price)) : "—"],
                ["Fotos", String(form.images.length)],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v || "—"}</dd></div>
              ))}
            </dl>
            <p className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              Ao publicar, você concorda com nossos Termos e Política de Privacidade. Seu anúncio entrará em moderação e ficará ativo por 60 dias.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>Voltar</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} disabled={!canNext}>Próximo <ChevronRight className="ml-1 h-4 w-4" /></Button>
          ) : (
            <Button onClick={publish}>Publicar anúncio</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}
function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
      <option value="">{placeholder ?? "Selecione"}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}