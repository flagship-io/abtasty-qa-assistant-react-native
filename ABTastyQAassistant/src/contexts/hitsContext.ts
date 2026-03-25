import { createContext } from "react";
import { HitsContextType } from "../types.local";

const hitsValue = {
  hits: [],
  filteredHits: [],
  clearHits: () => {},
  searchEvents: () => {},
};

export const HitsContext = createContext<HitsContextType>(hitsValue);
