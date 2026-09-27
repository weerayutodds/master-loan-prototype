"use client";

import { useEffect, useId, useRef, useState } from "react";

type SearchableSelectOption = { value: string; label: string };

type SearchableSelectProps = {
  options: SearchableSelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  emptyMessage?: string;
  className?: string;
};

// Stand-in for the per-company logo in the Figma — we have no logo assets yet,
// so the slot renders the name's first character until real images land.
function OptionAvatar({ label }: { label: string }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
      {label.trim().charAt(0)}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  emptyMessage = "ไม่พบรายการที่ค้นหา",
  className = "",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.value === value) ?? null;
  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function select(option: SearchableSelectOption) {
    onChange(option.value);
    close();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (filtered.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) => (current + step + filtered.length) % filtered.length,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const option = filtered[activeIndex];
      if (option) select(option);
    }
  }

  const fieldClassName =
    "w-full rounded-lg border bg-surface py-2 pl-3 pr-10 text-left text-sm text-foreground focus:border-primary focus:outline-none";

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {open ? (
        <input
          autoFocus
          type="text"
          role="combobox"
          aria-expanded={true}
          aria-controls={listboxId}
          aria-autocomplete="list"
          value={query}
          placeholder={selected?.label ?? placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          className={`${fieldClassName} border-primary placeholder:text-muted-foreground`}
        />
      ) : (
        <button
          type="button"
          role="combobox"
          aria-expanded={false}
          aria-controls={listboxId}
          onClick={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`${fieldClassName} border-border hover:border-primary/40`}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <OptionAvatar label={selected.label} />
              <span className="truncate">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </button>
      )}
      <Chevron open={open} />

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg border border-border bg-surface py-1 shadow-primary-s"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : (
            filtered.map((option, index) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(option)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground ${
                    index === activeIndex ? "bg-primary/5" : ""
                  }`}
                >
                  <OptionAvatar label={option.label} />
                  <span className="truncate">{option.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
