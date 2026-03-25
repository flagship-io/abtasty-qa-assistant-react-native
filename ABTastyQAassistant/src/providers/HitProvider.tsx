import React, { useCallback, useMemo, useState } from "react";
import { ABTastyQA } from "@flagship.io/react-native-sdk";
import { HitsContextType } from "../types.local";
import { HitsContext } from "../contexts/hitsContext";
import { useEventsListener } from "../hooks";

type HitProviderProps = {
  children: React.ReactNode;
  ABTastQA: ABTastyQA;
};

export function HitProvider({ children, ABTastQA }: HitProviderProps) {
  const [hits, setHits] = useState<Record<string, unknown>[]>([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEventsListener(ABTastQA, setHits);

  const clearHits = useCallback(() => {
    setHits([]);
    setSearchTerm("");
  }, []);

  const searchEvents = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const filteredHits = useMemo(() => {
    if (!searchTerm.trim()) {
      return hits;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return hits.filter((hit) => {
      const eventType = String(hit.t || "ACTIVATE").toLowerCase();
      if (eventType.includes(lowerSearchTerm)) {
        return true;
      }

      const hitString = JSON.stringify(hit).toLowerCase();
      return hitString.includes(lowerSearchTerm);
    });
  }, [hits, searchTerm]);

 
  const hitsValue: HitsContextType = useMemo(
    () => ({
      hits,
      filteredHits,
      clearHits,
      searchEvents,
    }),
    [hits, filteredHits, clearHits, searchEvents],
  );

  return (
    <HitsContext.Provider value={hitsValue}>{children}</HitsContext.Provider>
  );
}
