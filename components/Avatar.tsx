import { cn, getInitials } from "@/lib/utils";

type AvatarProps = {
  name: string;
  className?: string;
};

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      aria-label={`${name} avatar`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-[#0b3b20] font-bold text-amber-300 dark:bg-zinc-800 dark:text-amber-400",
        className,
      )}
      role="img"
    >
      {getInitials(name)}
    </div>
  );
}
