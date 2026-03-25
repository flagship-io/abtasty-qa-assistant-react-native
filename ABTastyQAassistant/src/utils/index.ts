import { VisitorVariations } from "@flagship.io/react-native-sdk";
import { ExtractPlaceholders } from "../types.local";

export function format<T extends string>(
  template: T,
  data: Record<ExtractPlaceholders<T>, string | number>
): string {
  let result: string = template;

  for (const [key, value] of Object.entries(data)) {
    result = result.replaceAll(`{{${key}}}`, String(value));
  }
  return result;
}


export function validateVariationType(data: Record<string, VisitorVariations>): boolean {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false;
  }

  return Object.values(data).every((campaign) => {
    return (
      campaign !== null &&
      typeof campaign === 'object' &&
      !Array.isArray(campaign) &&
      typeof campaign.variationId === 'string' &&
      typeof campaign.variationGroupId === 'string' &&
      typeof campaign.campaignId === 'string'
    );
  });
}

export function formatEventContent(hit: Record<string, unknown>): string {
  const jsonString = JSON.stringify(hit, null, 2);
  const lines = jsonString.split('\n');
  return lines.slice(1, -1).map(line => line.replace(/^  /, '')).join('\n');
}