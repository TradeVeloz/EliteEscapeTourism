import Link from "next/link";
import type { Package } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDiscountedPrice, packageTypeLabel } from "@/lib/utils";

export function PackageCard({ pkg }: { pkg: Package }) {
  const finalPrice = formatDiscountedPrice(pkg.price, pkg.discount);

  return (
    <Card className="flex h-full flex-col">
      <div className={`relative h-44 bg-gradient-to-br ${pkg.image}`}>
        <Badge variant="navy" className="absolute left-4 top-4">
          {packageTypeLabel(pkg.type)}
        </Badge>
        {pkg.discount ? (
          <Badge variant="gold" className="absolute right-4 top-4">
            {pkg.discount}% off
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-muted">{pkg.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
          <span>{pkg.duration} days</span>
          <span>★ {pkg.rating.toFixed(1)} ({pkg.reviews})</span>
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-black/5 pt-4">
          <div>
            {pkg.discount ? (
              <p className="text-xs text-ink-muted line-through">{formatCurrency(pkg.price)}</p>
            ) : null}
            <p className="text-xl font-bold text-navy">{formatCurrency(finalPrice)}</p>
            <p className="text-[11px] text-ink-muted">per couple, land package</p>
          </div>
          <Link href={`/holidays/${pkg.slug}`} className="btn-primary">
            View details
          </Link>
        </div>
      </div>
    </Card>
  );
}
