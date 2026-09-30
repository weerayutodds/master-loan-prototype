type FormFieldProps = {
  label: React.ReactNode;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="block text-sm">
      <span className="mb-1.5 block font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-danger">{error}</span> : null}
    </div>
  );
}
