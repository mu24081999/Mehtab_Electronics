"use client";

import { ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** A magnetic, glass-filled call-to-action that leans toward the cursor. */
export default function MagneticButton({ children, href, onClick, className = "" }: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(0.45);
  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      data-cursor="hover"
      className={`btn-magnetic ${className}`}
    >
      <span className="btn-fill" />
      {children}
    </a>
  );
}
