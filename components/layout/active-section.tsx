"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { SiteSectionId } from "@/lib/navigation";

type ActiveSection = {
  activeId: SiteSectionId | null;
  setActiveId: (id: SiteSectionId | null) => void;
};

const ActiveSectionContext = createContext<ActiveSection>({
  activeId: null,
  setActiveId: () => {},
});

function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<SiteSectionId | null>(null);
  return (
    <ActiveSectionContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

function useActiveSection() {
  return useContext(ActiveSectionContext);
}

export { ActiveSectionProvider, useActiveSection };
