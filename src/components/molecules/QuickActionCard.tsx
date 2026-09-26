import Link from "next/link";
import { Icon } from "@/components/atoms/Icon";
import { Card } from "@/components/molecules/Card";
import type { QuickAction } from "@/types/dashboard";

export function QuickActionCard({ title, subtitle, href }: QuickAction) {
  return (
    <Link href={href} className="block">
      <Card className="flex flex-col gap-4 transition-colors hover:border-primary">
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="coin" className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </Card>
    </Link>
  );
}
