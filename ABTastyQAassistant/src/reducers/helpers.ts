import { TargetingOperator } from "@flagship.io/react-native-sdk";
import {
  TargetingGroups,
  Targetings,
  VariationGroupDTO,
  VisitorData,
} from "../types.local";

/**
 * Handles array-based targeting values
 * For NOT operators: ALL values must not match (none should be present)
 * For other operators: AT LEAST ONE value must match
 */
function matchesArrayTargeting(
  targeting: Targetings,
  visitorData: VisitorData,
): boolean {
  if (!Array.isArray(targeting.value)) {
    return false;
  }

  const notOperator = [
    TargetingOperator.NOT_EQUALS,
    TargetingOperator.NOT_CONTAINS,
  ].includes(targeting.operator);

  return notOperator
    ? targeting.value.every((val) =>
        matchesTargetingCriteria(targeting, val, visitorData),
      )
    : targeting.value.some((val) =>
        matchesTargetingCriteria(targeting, val, visitorData),
      );
}

/**
 * Extracts the visitor's value for a given targeting key
 */
function getVisitorValue(
  targeting: Targetings,
  visitorData: VisitorData,
): unknown {
  return targeting.key === "fs_users"
    ? visitorData.visitorId
    : visitorData.context[targeting.key];
}

/**
 * Evaluates a single targeting operator against a visitor value
 */
function evaluateOperator(
  operator: TargetingOperator,
  visitorValue: unknown,
  targetValue: unknown,
): boolean {
  switch (operator) {
    case TargetingOperator.EQUALS:
      return visitorValue != null && visitorValue === targetValue;

    case TargetingOperator.NOT_EQUALS:
      return visitorValue != null && visitorValue !== targetValue;

    case TargetingOperator.CONTAINS:
      return String(visitorValue).includes(String(targetValue));

    case TargetingOperator.NOT_CONTAINS:
      return !String(visitorValue).includes(String(targetValue));

    case TargetingOperator.EXISTS:
      return visitorValue !== undefined && visitorValue !== null;

    case TargetingOperator.NOT_EXISTS:
      return visitorValue === undefined || visitorValue === null;

    case TargetingOperator.GREATER_THAN:
      return Number(visitorValue) > Number(targetValue);

    case TargetingOperator.LOWER_THAN:
      return Number(visitorValue) < Number(targetValue);

    case TargetingOperator.GREATER_THAN_OR_EQUALS:
      return Number(visitorValue) >= Number(targetValue);

    case TargetingOperator.LOWER_THAN_OR_EQUALS:
      return Number(visitorValue) <= Number(targetValue);

    case TargetingOperator.STARTS_WITH:
      return String(visitorValue).startsWith(String(targetValue));

    case TargetingOperator.ENDS_WITH:
      return String(visitorValue).endsWith(String(targetValue));

    default:
      return false;
  }
}

/**
 * Checks if a visitor matches the specified targeting criteria.
 *
 * @param targeting - The targeting rule to evaluate
 * @param visitorData - The visitor's data including context and ID
 * @returns true if the visitor matches the targeting criteria, false otherwise
 */
export function matchesTargetingCriteria(
  targeting: Targetings,
  targetingValue: unknown,
  visitorData?: VisitorData,
): boolean {
  if (targeting.key === "fs_all_users") {
    return true;
  }

  if (!visitorData) {
    return false;
  }

  if (Array.isArray(targetingValue)) {
    return matchesArrayTargeting(targeting, visitorData);
  }

  const visitorValue = getVisitorValue(targeting, visitorData);

  const isMatched = evaluateOperator(
    targeting.operator,
    visitorValue,
    targetingValue,
  );

  if (
    isMatched) {
    if (!targeting.matchedValue) {
      targeting.matchedValue = new Set<unknown>();
    }
    if (targetingValue !== undefined) {
      targeting.matchedValue.add(targetingValue);
    }
  }

  return isMatched;
}

/**
 * Evaluates if all targetings in a group match the visitor data
 * Updates hasMatched property for each targeting as a side effect
 */
function evaluateTargetingGroup(
  targetingGroup: TargetingGroups,
  visitorData?: VisitorData,
): boolean {
  if (targetingGroup.targetings.length === 0) {
    targetingGroup.allMatched = false;
    return false;
  }

  let allMatched = true;

  for (const targeting of targetingGroup.targetings) {
    targeting.hasMatched = matchesTargetingCriteria(
      targeting,
      targeting.value,
      visitorData,
    );

    if (!targeting.hasMatched) {
      allMatched = false;
    }
  }

  targetingGroup.allMatched = allMatched;

  return allMatched;
}

/**
 * Evaluates if any variation group in a campaign matches the visitor data
 */
export function evaluateCampaignTargeting(
  variationGroups: VariationGroupDTO[],
  visitorData?: VisitorData,
): boolean {
  for (const vg of variationGroups) {
    for (const tg of vg.targeting.targetingGroups) {
      if (evaluateTargetingGroup(tg, visitorData)) {
        return true;
      }
    }
  }

  return false;
}


