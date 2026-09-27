import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: { label: string; value: string }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className = "", ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`
        w-full appearance-none rounded-lg border border-border bg-surface py-2 pl-3 pr-10 text-sm text-foreground focus:border-primary focus:outline-none
        disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-muted-foreground
        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23888888%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
        bg-no-repeat bg-position-[right_0.75rem_center] bg-size-[1.25rem_1.25rem]
        ${className}
      `}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});