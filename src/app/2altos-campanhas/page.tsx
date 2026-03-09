import Link from "next/link";
import { ShoppingBag, Megaphone, Repeat, Wrench } from "lucide-react";

const sections = [
  { href: "/2altos-campanhas/campanhas", icon: Megaphone, label: "Campanhas", desc: "Explore campanhas de financiamento" },
  { href: "/2altos-campanhas/loja", icon: ShoppingBag, label: "Loja", desc: "Jogos com detalhes completos" },
  { href: "/2altos-campanhas/troca", icon: Repeat, label: "Troca", desc: "Compre, venda ou troque" },
  { href: "/2altos-campanhas/servicos", icon: Wrench, label: "Servicos", desc: "Profissionais do mercado" },
];

export default function CampanhasProjectPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl font-bold" style={{ color: "#b45309" }}>2Altos Campanhas</h1>
        <p className="text-muted text-lg">Versao com design polido, sidebars e tema personalizado</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="bg-card border border-border rounded-xl p-5 hover:border-amber-700 transition-all hover:-translate-y-0.5 space-y-2">
              <Icon size={28} style={{ color: "#b45309" }} />
              <h3 className="font-semibold">{s.label}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
