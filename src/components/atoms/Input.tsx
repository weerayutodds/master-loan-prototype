import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  type?: "text" | "tel";
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", invalid = false, className = "", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full min-h-10 rounded-lg border px-3 py-2 text-sm focus:outline-none ${
        invalid
          ? "border-danger bg-badge-danger-bg text-danger placeholder:text-danger/70 focus:border-danger"
          : "border-border bg-surface text-foreground placeholder:text-muted-foreground focus:border-primary"
      } ${className}`}
      {...rest}
    />
  );
});
