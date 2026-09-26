type InputProps = {
  name: string;
  type?: "text" | "tel";
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};

export function Input({ name, type = "text", defaultValue, placeholder, onChange }: InputProps) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
    />
  );
}
