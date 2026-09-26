type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline" | "secondary";
  size?: "xs" | "sm" | "md" | "lg";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: `bg-[linear-gradient(150.46deg,var(--primary)_10%,var(--primary-to)_78.19%)] text-primary-foreground hover:brightness-95 disabled:bg-none disabled:bg-surface-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${FOCUS_RING}`,
  ghost: `bg-transparent text-foreground hover:bg-surface-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-transparent ${FOCUS_RING}`,
  outline: `border border-primary-to bg-secondary-bg text-primary-to hover:bg-primary-to/5 disabled:border-border disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-secondary-bg ${FOCUS_RING}`,
  secondary: `border border-secondary-border bg-secondary-bg text-foreground hover:bg-surface-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-secondary-bg ${FOCUS_RING}`,
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "rounded-md px-2 py-0.5 text-xs font-medium",
  sm: "rounded-lg px-3 py-1.5 text-xs font-medium",
  md: "rounded-lg px-4 py-2.5 text-sm font-medium",
  lg: "rounded-xl px-6 py-2 text-lg font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
