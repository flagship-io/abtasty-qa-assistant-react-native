import {
  AppDataState,
  ApplyForcedAllocationAction,
  CampaignDisplayStatus,
  FsCampaign,
  UnsetForcedAllocationAction,
  splitCampaignsByAllocationAction,
  WebSDKCampaignStatus,
  ApplyForcedUnallocationAction,
  UnsetForcedUnallocationAction,
  searchCampaignsAction,
} from "../types.local";
import { evaluateCampaignTargeting } from "./helpers";

interface CampaignClassification {
  status: WebSDKCampaignStatus;
  displayStatus: CampaignDisplayStatus;
  shouldAccept: boolean;
  isUntracked: boolean;
}

/**
 * Determines campaign status based on allocation and forced variations
 */
function classifyCampaign(
  isAllocated: boolean,
  isForcedAllocation: boolean,
  isForcedUnallocation: boolean,
  hasTargetingMatched: boolean,
): CampaignClassification {
  if (isAllocated) {
    if (isForcedUnallocation) {
      return {
        status: WebSDKCampaignStatus.ACCEPTED,
        displayStatus: CampaignDisplayStatus.RESET,
        shouldAccept: true,
        isUntracked: hasTargetingMatched,
      };
    }

    if (isForcedAllocation) {
      return {
        status: WebSDKCampaignStatus.REJECTED,
        displayStatus: CampaignDisplayStatus.RESET,
        shouldAccept: false,
        isUntracked: hasTargetingMatched,
      };
    }

    return {
      status: WebSDKCampaignStatus.ACCEPTED,
      displayStatus: CampaignDisplayStatus.SHOWN,
      shouldAccept: true,
      isUntracked: hasTargetingMatched,
    };
  }

  if (isForcedUnallocation) {
    return {
      status: WebSDKCampaignStatus.ACCEPTED,
      displayStatus: CampaignDisplayStatus.RESET,
      shouldAccept: true,
      isUntracked: hasTargetingMatched,
    };
  }

  if (isForcedAllocation) {
    return {
      status: WebSDKCampaignStatus.REJECTED,
      displayStatus: CampaignDisplayStatus.RESET,
      shouldAccept: false,
      isUntracked: hasTargetingMatched,
    };
  }

  return {
    status: WebSDKCampaignStatus.REJECTED,
    displayStatus: CampaignDisplayStatus.HIDDEN,
    shouldAccept: false,
    isUntracked: hasTargetingMatched,
  };
}

/**
 * Separates campaigns into allocated and non-allocated categories based on visitor variations
 */
export function splitCampaignsByAllocation(
  state: AppDataState,
  action: splitCampaignsByAllocationAction,
): AppDataState {
  const allAcceptedCampaigns: FsCampaign[] = [];
  const allRejectedCampaigns: FsCampaign[] = [];

  const { value: allocatedVariations, visitorData } = action.payload;
  const campaigns = state.bucketingFile?.campaigns ?? [];

  campaigns.forEach((campaign) => {
    const isAllocated = !!allocatedVariations[campaign.id];
    const isForcedAllocation = !!state.variationsForcedAllocation[campaign.id];
    const isForcedUnallocation =
      !!state.variationsForcedUnallocation[campaign.id];

    const updatedCampaign: FsCampaign = structuredClone(campaign);

    const hasTargetingMatched = evaluateCampaignTargeting(
      updatedCampaign.variationGroups,
      visitorData,
    );

    const classification = classifyCampaign(
      isAllocated,
      isForcedAllocation,
      isForcedUnallocation,
      hasTargetingMatched,
    );

    updatedCampaign.status = classification.status;
    updatedCampaign.displayStatus = classification.displayStatus;
    updatedCampaign.hasTargetingMatched = hasTargetingMatched;
    updatedCampaign.isUntracked = classification.isUntracked;

    if (classification.shouldAccept) {
      allAcceptedCampaigns.push(updatedCampaign);
    } else {
      allRejectedCampaigns.push(updatedCampaign);
    }
  });

  const displayedAcceptedCampaigns = state.searchValue
    ? searchCampaigns(allAcceptedCampaigns, state.searchValue)
    : allAcceptedCampaigns;

  const displayedRejectedCampaigns = state.searchValue
    ? searchCampaigns(allRejectedCampaigns, state.searchValue)
    : allRejectedCampaigns;

  return {
    ...state,
    allAcceptedCampaigns,
    allRejectedCampaigns,
    displayedAcceptedCampaigns,
    displayedRejectedCampaigns,
    visitorData,
    allocatedVariations,
    sdkInfo: action.payload.sdkInfo,
  };
}

export function applyForcedAllocation(
  state: AppDataState,
  action: ApplyForcedAllocationAction,
): AppDataState {
  const { value } = action.payload;

  const variationsForcedAllocation = {
    ...state.variationsForcedAllocation,
    ...value,
  };

  return {
    ...state,
    variationsForcedAllocation,
    shouldSendForcedAllocation: true,
  };
}

export function unsetForcedAllocation(
  state: AppDataState,
  action: UnsetForcedAllocationAction,
): AppDataState {
  const { campaignId } = action.payload;

  const variationsForcedAllocation = { ...state.variationsForcedAllocation };
  delete variationsForcedAllocation[campaignId];
  const forcedVariations = { ...state.forcedVariations };
  delete forcedVariations[campaignId];

  return {
    ...state,
    variationsForcedAllocation,
    forcedVariations,
    shouldSendForcedAllocation: true,
  };
}

export function applyForceUnallocation(
  state: AppDataState,
  action: ApplyForcedUnallocationAction,
): AppDataState {
  const { value } = action.payload;

  const variationsForcedUnallocation = {
    ...state.variationsForcedUnallocation,
    ...value,
  };

  return {
    ...state,
    variationsForcedUnallocation,
    shouldSendForcedUnallocation: true,
  };
}

export function unsetForcedUnallocation(
  state: AppDataState,
  action: UnsetForcedUnallocationAction,
): AppDataState {
  const { campaignId } = action.payload;

  const variationsForcedUnallocation = {
    ...state.variationsForcedUnallocation,
  };
  delete variationsForcedUnallocation[campaignId];

  return {
    ...state,
    variationsForcedUnallocation,
    shouldSendForcedUnallocation: true,
  };
}

export function resetAllCampaigns(
  state: AppDataState
): AppDataState {
  return {
    ...state,
    variationsForcedAllocation: {},
    variationsForcedUnallocation: {},
    forcedVariations: {},
    shouldSendForcedAllocation: true,
    shouldSendForcedUnallocation: true,
  };
}

function searchCampaigns(
  campaigns: FsCampaign[],
  searchValue: string,
): FsCampaign[] {
  if (!searchValue) {
    return campaigns;
  }

  const upperSearchValue = searchValue.toUpperCase();
  return campaigns.filter(
    (item) =>
      item.id.toUpperCase().startsWith(upperSearchValue) ||
      item.name.toUpperCase().startsWith(upperSearchValue),
  );
}
export function filterCampaignsBySearch(
  state: AppDataState,
  payload: searchCampaignsAction,
): AppDataState {
  const acceptedCampaigns = state.allAcceptedCampaigns || [];
  const rejectedCampaigns = state.allRejectedCampaigns || [];
  const searchValue = payload.payload.searchTerm;

  if (!searchValue) {
    return {
      ...state,
      displayedAcceptedCampaigns: acceptedCampaigns,
      displayedRejectedCampaigns: rejectedCampaigns,
      searchValue: undefined,
    };
  }

  const filteredAcceptedCampaigns = searchCampaigns(
    acceptedCampaigns,
    searchValue,
  );

  const filteredRejectedCampaigns = searchCampaigns(
    rejectedCampaigns,
    searchValue,
  );

  return {
    ...state,
    displayedAcceptedCampaigns: filteredAcceptedCampaigns,
    displayedRejectedCampaigns: filteredRejectedCampaigns,
    searchValue,
  };
}
