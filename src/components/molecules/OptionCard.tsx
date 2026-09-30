import {Icon, type IconName} from "@/components/atoms/Icon"
import Image from "next/image"

type OptionCardProps = {
  label: string
  description?: string
  icon?: IconName
  image?: string
  imageClassName?: string
  selected: boolean
  textCenter?: boolean
  onSelect: () => void
}

export function OptionCard({
  label,
  description,
  icon,
  image,
  imageClassName,
  selected,
  textCenter = false,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative rounded-xl border p-4 transition-colors ${textCenter ? "text-center" : "text-left"} ${
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
        <Image
          src={image}
          alt=""
          width={94}
          height={55}
          className={`h-13.75 w-23.5 object-contain ${imageClassName ?? ""}`}
        />
      ) : icon ? (
        <Icon name={icon} className="size-6 text-foreground" />
      ) : null}
      <span className="text-sm font-medium text-foreground">{label}</span>
      {description ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
    </button>
  )
}
