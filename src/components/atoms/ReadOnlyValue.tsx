// A value the system decided, shown in the same box as a Select so it lines up with the
// dropdowns beside it in a form grid.
type ReadOnlyValueProps = {
  value?: string;
  // No border or background, but keeps the box's size (transparent border) so it still lines up with its neighbours.
  borderless?: boolean;
};

export function ReadOnlyValue({ value, borderless = false }: ReadOnlyValueProps) {
  return (
    <div
      className={`w-full rounded-lg border px-3 py-2 text-sm ${
        borderless ? "border-transparent" : "border-border bg-surface-muted"
      } ${value ? "text-foreground" : "text-muted-foreground"}`}
    >
      {value || "-"}
    </div>
  );
}
