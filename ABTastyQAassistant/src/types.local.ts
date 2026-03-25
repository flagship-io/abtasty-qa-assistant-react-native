import {
  ABTastyQA,
  VisitorVariations,
  VisitorVariationUpdateParam,
} from "@flagship.io/react-native-sdk";
import { Dispatch } from "react";
import { ViewStyle } from "react-native";

export type VisitorData = {
  visitorId: string;
  context: Record<string, string | number | boolean>;
  hasConsented: boolean;
};

export enum TargetingOperator {
  EQUALS = "EQUALS",
  NOT_EQUALS = "NOT_EQUALS",
  CONTAINS = "CONTAINS",
  NOT_CONTAINS = "NOT_CONTAINS",
  EXISTS = "EXISTS",
  NOT_EXISTS = "NOT_EXISTS",
  GREATER_THAN = "GREATER_THAN",
  LOWER_THAN = "LOWER_THAN",
  GREATER_THAN_OR_EQUALS = "GREATER_THAN_OR_EQUALS",
  LOWER_THAN_OR_EQUALS = "LOWER_THAN_OR_EQUALS",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
}

export type TargetingPrimitiveValue = string | number | boolean | null | undefined;

export type Targetings = {
  operator: TargetingOperator;
  key: string | "fs_all_users" | "fs_users";
  value: unknown;
  hasMatched?: boolean;
  matchedValue?: Set<unknown>;
};

export type FsVariation = {
  id: string;
  name?: string;
  modifications: {
    type: string;
    value: unknown;
  };
  allocation?: number;
  reference?: boolean;
  isOrigin?: boolean;
  variationGroupId?: string;
  variationGroupName?: string;
};

export type BucketingDTO = {
  panic?: boolean;
  campaigns?: FsCampaign[];
  accountSettings?: {
    enabledXPC?: true;
    troubleshooting?: {
      startDate: string;
      endDate: string;
      traffic: number;
      timezone: string;
    };
  };
};

export type FsVariationToForce = {
  campaignId: string;
  campaignName: string;
  campaignType: CampaignType;
  CampaignSlug?: string | null;
  variationGroupId: string;
  variationGroupName?: string;
  variation: FsVariation;
};

export type TargetingGroups = {
  targetings: Targetings[];
  allMatched?: boolean;
};

export type VariationGroupDTO = {
  id: string;
  name?: string;
  targeting: {
    targetingGroups: TargetingGroups[];
  };
  variations: FsVariation[];
};

export enum CampaignType {
  ab = "ab",
  toggle = "toggle",
  perso = "perso",
  deployment = "deployment",
}

export enum WebSDKCampaignStatus {
  /** Visitor is allocated to a variation through normal bucketing process */
  ACCEPTED = "ACCEPTED",
  /** Visitor is not allocated to any variation in this campaign */
  REJECTED = "REJECTED",
}

export enum CampaignDisplayStatus {
  SHOWN = "SHOWN",
  HIDDEN = "HIDDEN",
  RESET = "RESET",
}

export type FsCampaign = {
  id: string;
  name: string;
  type: CampaignType;
  status: WebSDKCampaignStatus;
  hasTargetingMatched?: boolean;
  isUntracked?: boolean;
  displayStatus: CampaignDisplayStatus;
  slug?: string | null;
  variationGroups: VariationGroupDTO[];
};

export type AppDataState = {
  ABTastQA: ABTastyQA;
  /** Environment ID for the current Flagship instance */
  fsEnvId: string;

  /** Bucketing configuration containing campaigns and account settings */
  bucketingFile?: BucketingDTO;

  /**
   * Visitor allocation data - maps campaign IDs to their allocated variations
   * Represents variations assigned through bucketing process
   */
  allocatedVariations?: Record<string, VisitorVariations>;

  /**
   * Manual overrides: Visitor forced variations - maps campaign IDs to variations forcefully assigned
   * Represents variations assigned through manual forcing actions
   */
  forcedVariations?: Record<string, FsVariationToForce>;

  /**
   * Visitor exposure data - maps campaign IDs to variations the visitor actually saw
   * Represents variations that were actually displayed/rendered
   */
  exposedVariations?: Record<string, VisitorVariations>;

  /**
   * All campaigns where the visitor is allocated to a variation (ACCEPTED status)
   * Truth source - Original unfiltered campaign data from bucketing
   */
  allAcceptedCampaigns: FsCampaign[];

  /**
   * All campaigns where the visitor is not allocated to any variation (REJECTED status)
   * Truth source - Original unfiltered campaign data from bucketing
   */
  allRejectedCampaigns: FsCampaign[];

  /**
   * All campaigns where the visitor was exposed to a variation
   * Truth source - Original unfiltered campaign data from actual exposure
   */
  allExposedCampaigns: FsCampaign[];

  /**
   * Manual overrides: Campaigns where the visitor is forcefully allocated to a specific variation
   * Maps campaign IDs to forced variation configurations
   */
  variationsForcedAllocation: Record<string, FsVariationToForce>;

  /**
   * Manual overrides: Campaigns where the visitor is forcefully excluded from variations
   * Maps campaign IDs to forced exclusion configurations
   */
  variationsForcedUnallocation: Record<string, FsVariationToForce>;

  /**
   * UI-filtered view: Campaigns shown in the accepted section
   * Subset of allAcceptedCampaigns after applying display filters
   */
  displayedAcceptedCampaigns: FsCampaign[];

  /**
   * UI-filtered view: Campaigns shown in the rejected section
   * Subset of allRejectedCampaigns after applying display filters
   */
  displayedRejectedCampaigns: FsCampaign[];

  /**
   * Control flag: Whether to send forced unallocation messages to the iframe
   * Used to synchronize manual exclusions with the embedded SDK
   */
  shouldSendForcedUnallocation: boolean;

  /**
   * Control flag: Whether to send forced allocation messages to the iframe
   * Used to synchronize manual allocations with the embedded SDK
   */
  shouldSendForcedAllocation: boolean;

  /** Current visitor context data including ID and custom attributes */
  visitorData?: VisitorData;

  /** SDK version used by the embedded Flagship instance */
  sdkInfo?: SdkInfo;

  isCampaignsLoading?: boolean;

  searchValue?: string;
};

export type SdkInfo = {
  name: string;
  version: string;
  tag: string;
};

export type SetBucketingFileAction = {
  type: "SET_BUCKETING_FILE";
  payload: BucketingDTO;
};

export type SetIsCampaignsLoadingAction = {
  type: "SET_IS_CAMPAIGNS_LOADING";
  payload: boolean;
};

export type splitCampaignsByAllocationAction = {
  type: "SPLIT_CAMPAIGNS_BY_ALLOCATION";
  payload: {
    value: Record<string, VisitorVariations>;
    param?: VisitorVariationUpdateParam;
    visitorData?: VisitorData;
    sdkInfo?: SdkInfo;
  };
};

export type ApplyForcedVariationAction = {
  type: "APPLY_FORCE_VARIATION";
  payload: Record<string, FsVariationToForce>;
};

export type ApplyForcedAllocationAction = {
  type: "APPLY_FORCED_ALLOCATION";
  payload: {
    value: Record<string, FsVariationToForce>;
  };
};

export type UnsetForcedAllocationAction = {
  type: "UNSET_FORCED_ALLOCATION";
  payload: {
    campaignId: string;
  };
};

export type ApplyForcedUnallocationAction = {
  type: "APPLY_FORCE_UNALLOCATION";
  payload: {
    value: Record<string, FsVariationToForce>;
  };
};

export type UnsetForcedUnallocationAction = {
  type: "UNSET_FORCED_UNALLOCATION";
  payload: {
    campaignId: string;
  };
};

export type ShouldSendForcedAllocationAction = {
  type: "SET_SHOULD_SEND_FORCED_ALLOCATION";
  payload: boolean;
};

export type ShouldSendForcedUnallocationAction = {
  type: "SET_SHOULD_SEND_FORCED_UNALLOCATION";
  payload: boolean;
};

export type ResetAllCampaignsAction = {
  type: "RESET_ALL_CAMPAIGNS";
};

export type searchCampaignsAction = {
  type: "SEARCH_CAMPAIGNS";
  payload: {
    searchTerm: string;
  };
};

export type AddHitsAction = {
  type: "ADD_HITS";
  payload: {
    value: Record<string, unknown>[];
  };
};

export type FsReducerAction =
  | SetBucketingFileAction
  | SetIsCampaignsLoadingAction
  | splitCampaignsByAllocationAction
  | ApplyForcedVariationAction
  | ApplyForcedAllocationAction
  | UnsetForcedAllocationAction
  | ShouldSendForcedAllocationAction
  | ApplyForcedUnallocationAction
  | UnsetForcedUnallocationAction
  | ShouldSendForcedUnallocationAction
  | ResetAllCampaignsAction
  | searchCampaignsAction
  | AddHitsAction;

export type DispatchAppData = Dispatch<FsReducerAction>;

export type AppContextValue = {
  dispatchAppData: DispatchAppData;
  appDataState: AppDataState;
};

export type HitsContextType = {
  hits: Record<string, unknown>[];
  filteredHits: Record<string, unknown>[];
  clearHits: () => void;
  searchEvents: (searchTerm: string) => void;
};

export type ExtractPlaceholders<T extends string> =
  T extends `${string}{{${infer Key}}}${infer Rest}`
    ? Key | ExtractPlaceholders<Rest>
    : never;

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export type RootStackParamList = {
  Home: undefined;
  CampaignDetails: { campaignId: string };
};
