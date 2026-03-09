import Link from "next/link";
import { Gamepad2, GraduationCap, Calculator, Megaphone } from "lucide-react";

const projects = [
  {
    slug: "2altos",
    name: "2Altos",
    description: "Plataforma de financiamento coletivo e descoberta de jogos de tabuleiro",
    color: "#f59e0b",
    icon: Gamepad2,
    features: ["Campanhas", "Loja", "Troca", "Servicos", "Assistente IA"],
  },
  {
    slug: "2altos-campanhas",
    name: "2Altos Campanhas",
    description: "Exploracao de campanhas com filtros avancados e tema personalizado",
    color: "#b45309",
    icon: Megaphone,
    features: ["Campanhas", "Loja", "Troca", "Servicos", "Theme Toggle"],
  },
  {
    slug: "educahubplay",
    name: "EducaHubPlay",
    description: "Plataforma colaborativa para criacao de jogos educacionais",
    color: "#8b5cf6",
    icon: GraduationCap,
    features: ["Jogos", "Especialistas", "Assistente IA", "Convites"],
  },
  {
    slug: "xequemath",
    name: "XequeMath",
    description: "Jogos educacionais de matematica com design futurista",
    color: "#10b981",
    icon: Calculator,
    features: ["Campanhas", "Educadores", "Permutas", "Assistente IA"],
  },
];

export default function HubPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 py-8">
        <h1 className="text-4xl font-bold">MVP Plataforma</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Plataforma unificada com todos os projetos da MVP Consultoria
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Link
              key={project.slug}
              href={`/${project.slug}`}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: project.color + "20", color: project.color }}
                >
                  <Icon size={24} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.name}
                  </h2>
                  <p className="text-sm text-muted">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.features.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded text-[11px] font-medium"
                        style={{ backgroundColor: project.color + "15", color: project.color }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
