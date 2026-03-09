import Link from "next/link";
import { Megaphone, ShoppingBag, Repeat, Wrench, Bot } from "lucide-react";

const sections = [
  { href: "/2altos/campanhas", icon: Megaphone, label: "Campanhas", desc: "Financie jogos de tabuleiro" },
  { href: "/2altos/loja", icon: ShoppingBag, label: "Loja", desc: "Compre jogos incriveis" },
  { href: "/2altos/troca", icon: Repeat, label: "Troca", desc: "Troque jogos com outros jogadores" },
  { href: "/2altos/servicos", icon: Wrench, label: "Servicos", desc: "Encontre profissionais" },
  { href: "/2altos/assistente", icon: Bot, label: "Assistente IA", desc: "Crie com inteligencia artificial" },
];

export default function TwoAltosPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl font-bold" style={{ color: "#f59e0b" }}>2Altos</h1>
        <p className="text-muted text-lg">Plataforma de financiamento coletivo e descoberta de jogos de tabuleiro</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="bg-card border border-border rounded-xl p-5 hover:border-amber-500 transition-all hover:-translate-y-0.5 space-y-2"
            >
              <Icon size={28} className="text-amber-500" />
              <h3 className="font-semibold">{s.label}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
