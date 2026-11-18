"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMotionPreference } from "./motion-preference";
export function RouteTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useMotionPreference();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className="route-frame"
        data-route={pathname}
        initial={{ opacity: 0, y: reduced ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -8 }}
        transition={{
          duration: reduced ? 0.12 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
