"use client";

import { createContext, useContext } from "react";

type WorkspaceMatterContextValue = {
  sampleDataIncluded: boolean;
  setSampleDataIncluded: (included: boolean) => void;
};

export const WorkspaceMatterContext = createContext<WorkspaceMatterContextValue | null>(null);

export function useWorkspaceMatterContext() {
  const context = useContext(WorkspaceMatterContext);
  if (!context) {
    throw new Error("Workspace matter context is only available inside the workspace shell.");
  }
  return context;
}
