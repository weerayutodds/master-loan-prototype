import Image from "next/image";
import { Icon, type IconName } from "@/components/atoms/Icon";

type OptionCardProps = {
  label: string;
  description?: string;
  icon?: IconName;
  image?: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({
  label,
  description,
  icon,
  image,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative rounded-xl border p-4 text-left transition-colors ${
        icon || image
          ? "flex flex-col items-center justify-center gap-2 text-center"
          : "flex flex-col gap-1"
      } shadow-primary-s ${
        selected
          ? "border-primary bg-primary/5"
          : "border-card-border bg-surface hover:border-primary/40"
      }`}
    >
      {selected ? (
        <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-white">
          <Icon name="check" className="size-2.5" />
        </span>
      ) : null}
      {image ? (
        <Image src={image} alt="" width={94} height={55} className="h-[55px] w-[94px] object-contain" />
      ) : icon ? (
        <Icon name={icon} className="size-6 text-foreground" />
      ) : null}
      <span className="text-sm font-medium text-foreground">{label}</span>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </button>
  );
}
