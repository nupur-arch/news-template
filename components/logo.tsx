"use client";
import { useEffect, useState, type SVGProps } from "react";
import { siteConfig } from "@/content/site.config";
import { logoMarkPath, logoFoldPath } from "@/lib/brand";
export type LogoVariant = "full" | "mark" | "stacked";
type LogoProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  variant?: LogoVariant;
  monochrome?: boolean;
};
let hasIntroducedLogo = false;
/** All geometry is local SVG; text inherits the self-hosted display face. */
export function Logo({
  variant = "full",
  monochrome = false,
  className = "",
  ...props
}: LogoProps) {
  const [introduce] = useState(() => !hasIntroducedLogo);
  useEffect(() => {
    hasIntroducedLogo = true;
  }, []);
  const stacked = variant === "stacked";
  const viewBox =
    variant === "mark" ? "0 0 48 48" : stacked ? "0 0 244 148" : "0 0 224 68";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={`logo logo--${variant} ${monochrome ? "logo--mono" : ""} ${introduce ? "logo--introduce" : ""} ${className}`}
      role="img"
      aria-label={siteConfig.name}
      focusable="false"
      {...props}
    >
      <g
        transform={
          variant === "mark"
            ? undefined
            : stacked
              ? "translate(98 0)"
              : "translate(0 10)"
        }
      >
        <g className="logo-mark-shape">
          <path
            className="logo-ink"
            d={logoMarkPath}
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
          <path className="logo-fold" d={logoFoldPath} />
          <path
            className="logo-draw"
            d={logoMarkPath}
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            aria-hidden="true"
          />
        </g>
      </g>
      {variant !== "mark" && (
        <g className="logo-type" fill="currentColor">
          <text
            x={stacked ? 122 : 63}
            y={stacked ? 94 : 27}
            fontSize={stacked ? 33 : 25}
            fontWeight="500"
            letterSpacing={stacked ? -1.35 : -0.95}
            textAnchor={stacked ? "middle" : "start"}
          >
            the daily
          </text>
          <text
            x={stacked ? 122 : 62}
            y={stacked ? 134 : 56}
            fontSize={stacked ? 43 : 34}
            fontWeight="750"
            letterSpacing={stacked ? -2 : -1.6}
            textAnchor={stacked ? "middle" : "start"}
          >
            standard<tspan className="logo-period">.</tspan>
          </text>
        </g>
      )}
    </svg>
  );
}
