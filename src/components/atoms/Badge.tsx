type BadgeProps = {
  children: React.ReactNode;
  tone?: "danger" | "neutral" | "success";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  danger: "bg-badge-danger-bg text-badge-danger-fg",
  neutral: "bg-surface-muted text-muted-foreground",
  success: "bg-success text-primary-foreground",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
