"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
export function EditorialImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      {...props}
      alt={props.alt}
      src={failed ? "/images/fallback.svg" : props.src}
      onError={() => setFailed(true)}
    />
  );
}
