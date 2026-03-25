import { ABTastyQA } from "@flagship.io/react-native-sdk";
import { AppDataState } from "../types.local";

export const initialAppDataState: AppDataState = {
  ABTastQA: {} as ABTastyQA,
  fsEnvId: "",
  allAcceptedCampaigns: [],
  allRejectedCampaigns: [],
  allExposedCampaigns: [],
  variationsForcedAllocation: {},
  variationsForcedUnallocation: {},
  displayedAcceptedCampaigns: [],
  displayedRejectedCampaigns: [],
  shouldSendForcedUnallocation: false,
  shouldSendForcedAllocation: false,
};
