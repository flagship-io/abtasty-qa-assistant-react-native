import {
  VisitorVariations,
  VisitorVariationUpdateParam,
} from "@flagship.io/react-native-sdk";
import {
  BucketingDTO,
  FsReducerAction,
  FsVariationToForce,
  SdkInfo,
  VisitorData,
} from "../types.local";

export function setIsCampaignsLoading(isLoading: boolean): FsReducerAction {
  return {
    type: "SET_IS_CAMPAIGNS_LOADING",
    payload: isLoading,
  };
}

export function setBucketingFile(bucketingFile: BucketingDTO): FsReducerAction {
  return {
    type: "SET_BUCKETING_FILE",
    payload: bucketingFile,
  };
}

export function splitCampaignsByAllocationActionCreator({
  value,
  param,
  visitorData,
  sdkInfo,
}: {
  value: Record<string, VisitorVariations>;
  param?: VisitorVariationUpdateParam;
  visitorData?: VisitorData;
  sdkInfo?: SdkInfo;
}): FsReducerAction {
  return {
    type: "SPLIT_CAMPAIGNS_BY_ALLOCATION",
    payload: {
      value,
      param,
      visitorData,
      sdkInfo,
    },
  };
}

export function applyForcedVariation(
  value: Record<string, FsVariationToForce>
): FsReducerAction {
  return {
    type: "APPLY_FORCE_VARIATION",
    payload: value,
  };
}

export function applyForceAllocation(
  value: Record<string, FsVariationToForce>
): FsReducerAction {
  return {
    type: "APPLY_FORCED_ALLOCATION",
    payload: {
      value,
    },
  };
}

export function unsetForcedAllocation(
  campaignId: string
): FsReducerAction {
  return {
    type: "UNSET_FORCED_ALLOCATION",
    payload: {
      campaignId,
    },
  };
}

export function applyForcedUnallocation(
  value: Record<string, FsVariationToForce>
): FsReducerAction {
  return {
    type: "APPLY_FORCE_UNALLOCATION",
    payload: {
      value,
    },
  };
}

export function unsetForcedUnallocation(
  campaignId: string
): FsReducerAction {
  return {
    type: "UNSET_FORCED_UNALLOCATION",
    payload: {
      campaignId,
    },
  };
}

export function setShouldSendForcedAllocation(
  value: boolean
): FsReducerAction {
  return {
    type: "SET_SHOULD_SEND_FORCED_ALLOCATION",
    payload: value,
  };
}

export function setShouldSendForcedUnallocation(
  value: boolean
): FsReducerAction {
  return {
    type: "SET_SHOULD_SEND_FORCED_UNALLOCATION",
    payload: value,
  };
}

export function resetAllCampaigns(): FsReducerAction {
  return {
    type: "RESET_ALL_CAMPAIGNS",
  };
}

export function searchCampaignsActionCreator(
  searchTerm: string
): FsReducerAction {
  return {
    type: "SEARCH_CAMPAIGNS",
    payload: {
      searchTerm,
    },
  };
}

export function addHitsActionCreator(
  value: Record<string, unknown>[]
): FsReducerAction {
  return {
    type: "ADD_HITS",
    payload: {
      value,
    },
  };
} 