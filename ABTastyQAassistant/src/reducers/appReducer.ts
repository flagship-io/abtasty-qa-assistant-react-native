import { AppDataState, FsReducerAction } from "../types.local";
import {
  applyForcedAllocation,
  unsetForcedAllocation,
  splitCampaignsByAllocation,
  applyForceUnallocation,
  unsetForcedUnallocation,
  resetAllCampaigns,
  filterCampaignsBySearch,
} from "./actions";

export function appDataReducer(
  state: AppDataState,
  action: FsReducerAction
): AppDataState {
  switch (action.type) {
    case "SET_BUCKETING_FILE":
      return {
        ...state,
        bucketingFile: action.payload,
        isCampaignsLoading: false,
      };
    case "SET_IS_CAMPAIGNS_LOADING":
      return {
        ...state,
        isCampaignsLoading: action.payload,
      };
    case "SPLIT_CAMPAIGNS_BY_ALLOCATION":
      return splitCampaignsByAllocation(state, action);
    case "APPLY_FORCE_VARIATION":
      return {
        ...state,
        forcedVariations: {
          ...state.forcedVariations,
          ...action.payload,
        },
      };
    case "APPLY_FORCED_ALLOCATION":
      return applyForcedAllocation(state, action);
    case "SET_SHOULD_SEND_FORCED_ALLOCATION":
      return {
        ...state,
        shouldSendForcedAllocation: action.payload,
      };
    case "SET_SHOULD_SEND_FORCED_UNALLOCATION":
      return {
        ...state,
        shouldSendForcedUnallocation: action.payload,
      };
    case "UNSET_FORCED_ALLOCATION":
      return unsetForcedAllocation(state, action);
    case "APPLY_FORCE_UNALLOCATION":
      return applyForceUnallocation(state, action);
    case "UNSET_FORCED_UNALLOCATION":
      return unsetForcedUnallocation(state, action);
    case "RESET_ALL_CAMPAIGNS":
      return resetAllCampaigns(state);
    case "SEARCH_CAMPAIGNS":
      return filterCampaignsBySearch(state, action);
    default:
      return state;
  }
}
