"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { SpaceTourOverlay } from "@/components/space-tour/SpaceTourOverlay";

interface SpaceTourContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const SpaceTourContext = createContext<SpaceTourContextValue | null>(null);

export function useSpaceTour(): SpaceTourContextValue {
  const ctx = useContext(SpaceTourContext);
  if (!ctx) throw new Error("useSpaceTour must be used within SpaceTourProvider");
  return ctx;
}

export function SpaceTourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (triggerRef.current && typeof triggerRef.current.focus === "function") {
      triggerRef.current.focus();
    }
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <SpaceTourContext.Provider value={value}>
      {children}
      {isOpen ? <SpaceTourOverlay onClose={close} /> : null}
    </SpaceTourContext.Provider>
  );
}
