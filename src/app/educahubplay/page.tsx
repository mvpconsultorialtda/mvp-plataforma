import Link from "next/link";
import { Gamepad2, Users, Bot, Mail } from "lucide-react";

const sections = [
  { href: "/educahubplay/jogos", icon: Gamepad2, label: "Jogos Educacionais", desc: "Catalogo de jogos por disciplina" },
  { href: "/educahubplay/especialistas", icon: Users, label: "Especialistas", desc: "Encontre pedagogos e designers" },
  { href: "/educahubplay/assistente", icon: Bot, label: "Assistente IA", desc: "Gere material pedagogico" },
  { href: "/educahubplay/convite", icon: Mail, label: "Solicitar Convite", desc: "Acesso por convite (UNEB)" },
];

export default function EducaHubPlayPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl font-bold" style={{ color: "#8b5cf6" }}>EducaHubPlay</h1>
        <p className="text-muted text-lg">Plataforma colaborativa para criacao de jogos educacionais</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.href} href={s.href} className="bg-card border border-border rounded-xl p-5 hover:border-violet-500 transition-all hover:-translate-y-0.5 space-y-2">
              <Icon size={28} className="text-violet-500" />
              <h3 className="font-semibold">{s.label}</h3>
              <p className="text-sm text-muted">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
