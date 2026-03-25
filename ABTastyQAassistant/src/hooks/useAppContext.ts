import { useContext } from "react";
import { AppContext } from "../contexts/appContext";

/**
 * Hook to access the application context
 * @throws Error if used outside AppProvider
 */
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
