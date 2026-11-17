"use client";
import { ThemeProvider } from "next-themes";
import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
export function Providers({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");
    const update = () => setSmooth(!motion.matches && !touch.matches);
    update();
    motion.addEventListener("change", update);
    touch.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      touch.removeEventListener("change", update);
    };
  }, []);
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {smooth && (
        <ReactLenis
          root
          options={{ autoRaf: true, smoothWheel: true, syncTouch: false }}
        />
      )}
      {children}
    </ThemeProvider>
  );
}
