import { renderHook } from '@testing-library/react-native';
import { useTargetingBackground, useAllocationBackground } from '../../src/hooks/useBackground';
import { CampaignDisplayStatus, WebSDKCampaignStatus } from '../../src/types.local';
import { COLORS } from '../../src/constants';
import { CloseIcon } from '../../src/assets/icons';
import { CheckIcon } from '../../src/assets/icons/CheckIcon';

describe('useBackground hooks', () => {
  describe('useTargetingBackground', () => {
    it('should return danger style for hidden and tracked campaigns', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(CampaignDisplayStatus.HIDDEN, false)
      );

      expect(result.current.borderColor).toBe(COLORS.danger);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundDangerLight);
      expect(result.current.iconColor).toBe(COLORS.dangerDark);
      expect(result.current.Icon).toBe(CloseIcon);
    });

    it('should return danger style for shown campaigns with unmatched targeting', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(CampaignDisplayStatus.SHOWN, false, false)
      );

      expect(result.current.borderColor).toBe(COLORS.danger);
      expect(result.current.Icon).toBe(CloseIcon);
    });

    it('should return danger style for reset accepted campaigns with unmatched targeting', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(
          CampaignDisplayStatus.RESET,
          false,
          false,
          WebSDKCampaignStatus.ACCEPTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.danger);
      expect(result.current.Icon).toBe(CloseIcon);
    });

    it('should return warning style for reset rejected campaigns that are tracked', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(
          CampaignDisplayStatus.RESET,
          false,
          true,
          WebSDKCampaignStatus.REJECTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.warning);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundWarningLight);
      expect(result.current.iconColor).toBe(COLORS.warningDark);
      expect(result.current.Icon).toBe(CheckIcon);
    });

    it('should return success style for shown campaigns with all matched', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(CampaignDisplayStatus.SHOWN, false, true)
      );

      expect(result.current.borderColor).toBe(COLORS.success);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundSuccessLight);
      expect(result.current.iconColor).toBe(COLORS.successDark);
      expect(result.current.Icon).toBe(CheckIcon);
    });

    it('should return success style for hidden but untracked campaigns', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(CampaignDisplayStatus.HIDDEN, true)
      );

      expect(result.current.borderColor).toBe(COLORS.success);
      expect(result.current.Icon).toBe(CheckIcon);
    });

    it('should return success style for reset accepted campaigns with all matched', () => {
      const { result } = renderHook(() =>
        useTargetingBackground(
          CampaignDisplayStatus.RESET,
          false,
          true,
          WebSDKCampaignStatus.ACCEPTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.success);
      expect(result.current.Icon).toBe(CheckIcon);
    });
  });

  describe('useAllocationBackground', () => {
    it('should return danger style for hidden campaigns', () => {
      const { result } = renderHook(() =>
        useAllocationBackground(CampaignDisplayStatus.HIDDEN)
      );

      expect(result.current.borderColor).toBe(COLORS.danger);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundDangerLight);
      expect(result.current.iconColor).toBe(COLORS.dangerDark);
      expect(result.current.Icon).toBe(CloseIcon);
    });

    it('should return danger style for accepted campaigns with unmatched allocation', () => {
      const { result } = renderHook(() =>
        useAllocationBackground(
          CampaignDisplayStatus.SHOWN,
          false,
          WebSDKCampaignStatus.ACCEPTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.danger);
      expect(result.current.Icon).toBe(CloseIcon);
    });

    it('should return warning style for reset rejected campaigns', () => {
      const { result } = renderHook(() =>
        useAllocationBackground(
          CampaignDisplayStatus.RESET,
          true,
          WebSDKCampaignStatus.REJECTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.warning);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundWarningLight);
      expect(result.current.iconColor).toBe(COLORS.warningDark);
      expect(result.current.Icon).toBe(CheckIcon);
    });

    it('should return success style for accepted campaigns with all matched', () => {
      const { result } = renderHook(() =>
        useAllocationBackground(
          CampaignDisplayStatus.SHOWN,
          true,
          WebSDKCampaignStatus.ACCEPTED
        )
      );

      expect(result.current.borderColor).toBe(COLORS.success);
      expect(result.current.backgroundColor).toBe(COLORS.backgroundSuccessLight);
      expect(result.current.iconColor).toBe(COLORS.successDark);
      expect(result.current.Icon).toBe(CheckIcon);
    });

    it('should return success style for shown campaigns', () => {
      const { result } = renderHook(() =>
        useAllocationBackground(CampaignDisplayStatus.SHOWN)
      );

      expect(result.current.borderColor).toBe(COLORS.success);
      expect(result.current.Icon).toBe(CheckIcon);
    });
  });
});
