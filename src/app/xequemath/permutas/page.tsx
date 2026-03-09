import { Gift } from "lucide-react";

const rewards = [
  { name: "Avatar Pitagoras", price: 100, icon: "👤" },
  { name: "Borda Dourada", price: 250, icon: "🖼️" },
  { name: "Tema Galaxia", price: 500, icon: "🌌" },
  { name: "Icone Estrela", price: 75, icon: "⭐" },
  { name: "Avatar Euler", price: 150, icon: "👤" },
  { name: "Tema Oceano", price: 500, icon: "🌊" },
];

export default function PermutasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Permutas</h1>
        <p className="text-muted text-sm">Troque seus pontos por recompensas</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((r) => (
          <div key={r.name} className="bg-card border border-border rounded-xl p-4 text-center hover:border-emerald-500 transition-colors space-y-2">
            <div className="text-4xl">{r.icon}</div>
            <h3 className="font-semibold text-sm">{r.name}</h3>
            <p className="text-emerald-500 font-bold">{r.price} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}
