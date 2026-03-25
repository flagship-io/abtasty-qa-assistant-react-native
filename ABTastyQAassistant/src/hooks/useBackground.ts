import { CloseIcon } from "../assets/icons";
import { CheckIcon } from "../assets/icons/CheckIcon";
import { COLORS } from "../constants";
import { CampaignDisplayStatus, WebSDKCampaignStatus } from "../types.local";

type BackgroundStyle = {
  borderColor: string;
  backgroundColor: string;
  iconColor: string;
  Icon: typeof CheckIcon | typeof CloseIcon;
};

const DANGER_STYLE: BackgroundStyle = {
  borderColor: COLORS.danger,
  backgroundColor: COLORS.backgroundDangerLight,
  iconColor: COLORS.dangerDark,
  Icon: CloseIcon,
};

const WARNING_STYLE: BackgroundStyle = {
  borderColor: COLORS.warning,
  backgroundColor: COLORS.backgroundWarningLight,
  iconColor: COLORS.warningDark,
  Icon: CheckIcon,
};

const SUCCESS_STYLE: BackgroundStyle = {
  borderColor: COLORS.success,
  backgroundColor: COLORS.backgroundSuccessLight,
  iconColor: COLORS.successDark,
  Icon: CheckIcon,
};

export function useTargetingBackground(
  displayStatus: CampaignDisplayStatus,
  isUntracked?: boolean,
  allMatched?: boolean,
  campaignStatus?: WebSDKCampaignStatus
): BackgroundStyle {
  const isHiddenAndTracked =
    displayStatus === CampaignDisplayStatus.HIDDEN && !isUntracked;
  const isShown = displayStatus === CampaignDisplayStatus.SHOWN;
  const isResetAndAccepted =
    displayStatus === CampaignDisplayStatus.RESET &&
    campaignStatus === WebSDKCampaignStatus.ACCEPTED;
  const isResetAndRejected =
    displayStatus === CampaignDisplayStatus.RESET &&
    campaignStatus === WebSDKCampaignStatus.REJECTED;

  if (isHiddenAndTracked || ((isShown || isResetAndAccepted) && !allMatched)) {
    return DANGER_STYLE;
  }

  if (isResetAndRejected && !isUntracked) {
    return WARNING_STYLE;
  }

  return SUCCESS_STYLE;
}

export function useAllocationBackground(
  displayStatus: CampaignDisplayStatus,
  allMatched?: boolean,
  campaignStatus?: WebSDKCampaignStatus
): BackgroundStyle {
  if (
    displayStatus === CampaignDisplayStatus.HIDDEN ||
    (campaignStatus === WebSDKCampaignStatus.ACCEPTED && !allMatched)
  ) {
    return DANGER_STYLE;
  }

  if (
    displayStatus === CampaignDisplayStatus.RESET &&
    campaignStatus === WebSDKCampaignStatus.REJECTED
  ) {
    return WARNING_STYLE;
  }

  return SUCCESS_STYLE;
}
