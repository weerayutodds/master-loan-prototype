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
      className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
        invalid ? "border-danger focus:border-danger" : "border-border focus:border-primary"
      } ${className}`}
      {...rest}
    />
  );
});
