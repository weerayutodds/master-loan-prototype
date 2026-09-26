import Link from "next/link";
import { Button } from "@/components/atoms/Button";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function DashboardHeader({ title, subtitle, ctaLabel, ctaHref }: DashboardHeaderProps) {
  const cta = ctaLabel ? <Button variant="primary">{ctaLabel}</Button> : null;

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      {cta ? (ctaHref ? <Link href={ctaHref}>{cta}</Link> : cta) : null}
    </div>
  );
}
