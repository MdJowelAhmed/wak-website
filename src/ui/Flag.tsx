import { cn } from "@/lib/utils";

interface FlagProps {
  countryCode: string;
  className?: string;
  title?: string;
  loading?: "eager" | "lazy";
}

function flagSrc(countryCode: string): string | null {
  const code = countryCode.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) return null;
  return `https://flagcdn.com/${code}.svg`;
}

export default function Flag({
  countryCode,
  className,
  title,
  loading = "lazy",
}: FlagProps) {
  const src = flagSrc(countryCode);
  if (!src) return null;

  const label = title || countryCode.toUpperCase();

  return (
    <img
      src={src}
      alt={label}
      title={label}
      width={20}
      height={15}
      loading={loading}
      draggable={false}
      className={cn(
        "inline-block h-3.5 w-5 shrink-0 rounded-[2px] object-cover",
        className,
      )}
    />
  );
}
