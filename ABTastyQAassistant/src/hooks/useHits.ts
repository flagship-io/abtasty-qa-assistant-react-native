import { useHitContext } from "./useHitContext";



export function useHits() {
  return useHitContext().hits;
}