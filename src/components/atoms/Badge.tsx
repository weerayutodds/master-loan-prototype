type BadgeProps = {
  children: React.ReactNode;
  tone?: "danger" | "neutral" | "primary" | "success";
  className?: string;
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  danger: "bg-badge-danger-bg text-badge-danger-fg",
  neutral: "bg-surface-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success text-primary-foreground",
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
