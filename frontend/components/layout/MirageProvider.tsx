"use client";

import { useEffect } from "react";
import { startMirage } from "@/lib/mirage";

export default function MirageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Disable Mirage JS so we hit the real backend
    if (process.env.NEXT_PUBLIC_USE_MIRAGE === "true") {
      startMirage();
    }
  }, []);

  return <>{children}</>;
}
