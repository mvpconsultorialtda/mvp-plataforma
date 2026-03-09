interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-4 text-center"
          style={stat.color ? { borderLeftWidth: 4, borderLeftColor: stat.color } : undefined}
        >
          <span className="block text-2xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs text-muted uppercase tracking-wider">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
