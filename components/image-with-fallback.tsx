"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function ImageWithFallback({ src, alt, ...props }: ImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  return <Image {...props} src={currentSrc} alt={alt} onError={() => setCurrentSrc("/fallback.svg")} />;
}
