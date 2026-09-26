type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

export function FormField({ label, children }: FormFieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
