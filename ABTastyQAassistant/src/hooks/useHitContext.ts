import { useContext } from "react";
import { HitsContext } from "../contexts/hitsContext";

export function useHitContext() {
  return useContext(HitsContext);
}
