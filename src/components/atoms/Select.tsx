type SelectProps = {
  name: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
};

export function Select({ name, defaultValue, options }: SelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
