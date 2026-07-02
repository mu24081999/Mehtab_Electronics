import Image from "next/image";

interface Props {
  variant?: "full" | "icon";
  className?: string;
  priority?: boolean;
}

/** Brand mark — SVG wordmark on desktop, compact icon on small screens. */
export default function Logo({ variant = "full", className = "", priority = false }: Props) {
  if (variant === "icon") {
    return (
      <Image
        src="/logo.png"
        alt="Mehtab Electronics"
        width={40}
        height={40}
        className={`h-9 w-9 rounded-lg object-cover ${className}`}
        priority={priority}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 rounded-lg object-cover md:h-10 md:w-10"
        priority={priority}
        aria-hidden
      />
      <div className="hidden min-[400px]:block leading-tight">
        <span className="font-display block text-[0.65rem] font-semibold tracking-[0.28em] text-white/90 sm:text-xs">
          MEHTAB
        </span>
        <span className="font-display block text-[0.55rem] font-medium tracking-[0.38em] text-[color:var(--cyan)] sm:text-[0.6rem]">
          ELECTRONICS
        </span>
      </div>
    </div>
  );
}
