type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-card-border bg-surface shadow-primary-s p-6 ${className}`}
    >
      {children}
    </div>
  );
}
