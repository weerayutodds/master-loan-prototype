// A value the system decided, shown in the same box as a Select so it lines up with the
// dropdowns beside it in a form grid.
type ReadOnlyValueProps = {
  value?: string;
};

export function ReadOnlyValue({ value }: ReadOnlyValueProps) {
  return (
    <div
      className={`w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm ${
        value ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {value || "-"}
    </div>
  );
}
