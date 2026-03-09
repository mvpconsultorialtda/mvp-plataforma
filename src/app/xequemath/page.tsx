import Link from "next/link";
import { Megaphone, GraduationCap, Repeat, Bot } from "lucide-react";

const sections = [
  { href: "/xequemath/campanhas", icon: Megaphone, label: "Campanhas", desc: "Financie jogos de matematica" },
  { href: "/xequemath/educadores", icon: GraduationCap, label: "Educadores", desc: "Rede de educadores matematicos" },
  { href: "/xequemath/permutas", icon: Repeat, label: "Permutas", desc: "Troque jogos e materiais" },
  { href: "/xequemath/assistente", icon: Bot, label: "Assistente IA", desc: "Gere conteudo matematico com IA" },
];

export default function XequeMathPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl font-bold" style={{ color: "#10b981" }}>XequeMath</h1>
        <p className="text-muted text-lg">Jogos educacionais de matematica com design futurista</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="bg-card border border-border rounded-xl p-5 hover:border-emerald-500 transition-all hover:-translate-y-0.5 space-y-2">
              <Icon size={28} className="text-emerald-500" />
              <h3 className="font-semibold">{s.label}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
