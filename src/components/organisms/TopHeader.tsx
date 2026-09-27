"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/atoms/Icon";

type TopHeaderProps = {
  title: string;
};

export function TopHeader({ title }: TopHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 flex h-11 items-center justify-between border-b border-secondary-border bg-surface/70 px-6 backdrop-blur-md">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
      >
        <Icon name="arrow-left" className="size-5" />
        ย้อนกลับ
      </button>
      <h1 className="text-lg font-medium text-foreground">{title}</h1>
      <button
        type="button"
        className="flex size-7.5 items-center justify-center rounded-lg border border-border bg-surface"
      >
        <Icon name="menu" className="size-4 text-black" />
      </button>
    </div>
  );
}
