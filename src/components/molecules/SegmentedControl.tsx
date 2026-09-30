type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex w-full rounded-lg bg-surface-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            value === option.value
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}