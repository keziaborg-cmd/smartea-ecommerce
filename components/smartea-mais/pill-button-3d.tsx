import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";

type Variant = "primary" | "white" | "outline-white";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-folha-viva text-white",
  white: "bg-white text-folha-viva-escura",
  "outline-white": "border-2 border-white/70 text-white",
};

const VARIANT_SHADOW: Record<Variant, string | undefined> = {
  primary: "var(--color-folha-viva-escura)",
  white: "#c3d9a0",
  "outline-white": undefined,
};

type PillButton3DProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
};

export function PillButton3D({ children, href, variant = "primary", className = "" }: PillButton3DProps) {
  const shadow = VARIANT_SHADOW[variant];
  const style: CSSProperties = shadow ? ({ "--btn-shadow": shadow } as CSSProperties) : {};
  const classes = `btn-3d inline-flex items-center justify-center rounded-full px-8 py-3.5 font-display-mais text-base font-semibold ${VARIANT_CLASSES[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} style={style}>
      {children}
    </button>
  );
}
