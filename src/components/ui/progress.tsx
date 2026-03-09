import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function Progress({ value, max = 100, color, className }: ProgressProps) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className={cn("w-full bg-background rounded-full h-2", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percent}%`,
          backgroundColor: color || "var(--color-primary)",
        }}
      />
    </div>
  );
}
