export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDiscountedPrice(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

export function packageTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    HONEYMOON: "Honeymoon",
    FAMILY: "Family",
    CORPORATE: "Corporate",
    LUXURY: "Luxury",
    CUSTOM: "Custom",
  };
  return labels[type] ?? type;
}
