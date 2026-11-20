import type { SVGProps } from "react";
import { siteConfig } from "@/src/config/site";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  variant?: "full" | "mark" | "stacked";
  tone?: "dark" | "light";
  monochrome?: boolean;
};

export function Logo({ variant = "full", tone = "dark", monochrome = false, className = "", ...props }: LogoProps) {
  const markOnly = variant === "mark";
  const ink = tone === "light" ? "#FFFFFF" : siteConfig.colors.navy;
  return (
    <svg
      viewBox={markOnly ? "0 0 48 48" : "0 0 310 48"}
      className={`logo logo--${variant} ${className}`}
      role="img"
      aria-label={siteConfig.name}
      {...props}
    >
      <rect width="48" height="48" rx="13" fill={ink} />
      <path d="M12 14h23M12 23h17M12 32h13" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="m27 31 3.2 3.2L37 27" fill="none" stroke={monochrome ? ink : siteConfig.colors.mint} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {!markOnly && (
        <text x="60" y="31" fill={ink} fontFamily="var(--font-heading),serif" fontSize="23" fontWeight="650" letterSpacing="-.5">
          Conta <tspan fill={siteConfig.colors.mint}>Bem</tspan> Organizada
        </text>
      )}
    </svg>
  );
}
