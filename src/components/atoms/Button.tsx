type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
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
  outline: `border border-primary bg-surface text-primary hover:bg-primary/5 disabled:border-border disabled:text-muted-foreground disabled:cursor-not-allowed disabled:hover:bg-surface ${FOCUS_RING}`,
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "px-4 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-xs",
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
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
