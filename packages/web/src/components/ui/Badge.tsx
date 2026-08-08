import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "navy" | "teal" | "outline";
  className?: string;
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  gold: "bg-gold/15 text-gold-dark",
  navy: "bg-navy text-white",
  teal: "bg-teal/15 text-teal-dark",
  outline: "border border-navy/20 text-navy",
};

export function Badge({ children, variant = "gold", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
