import { Button } from "@/components/atoms/Button";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  ctaLabel?: string;
};

export function DashboardHeader({ title, subtitle, ctaLabel }: DashboardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      {ctaLabel ? <Button variant="primary">{ctaLabel}</Button> : null}
    </div>
  );
}
