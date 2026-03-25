import { getBucketingFile } from '../../src/api';
import { HttpError } from '../../src/api/HttpError';
import { BucketingDTO, CampaignType } from '../../src/types.local';

// Mock global fetch
global.fetch = jest.fn();

describe('API - getBucketingFile', () => {
  const mockEnvId = 'test-env-123';
  const expectedUrl = `https://cdn.flagship.io/${mockEnvId}/bucketing.json`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful requests', () => {
    it('should fetch bucketing file with correct URL and parse response', async () => {
      const mockBucketingData: Partial<BucketingDTO> = {
        campaigns: [
          {
            id: 'campaign1',
            name: 'Test Campaign',
            type: CampaignType.ab,
            status: 'active',
            displayStatus: 'SHOWN',
            variationGroups: [],
          } as any,
        ],
        accountSettings: {},
      };

      const mockJson = jest.fn().mockResolvedValueOnce(mockBucketingData);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: mockJson,
      });

      const result = await getBucketingFile(mockEnvId);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, { signal: undefined });
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBucketingData);
    });

    it('should pass custom AbortSignal to fetch', async () => {
      const mockAbortController = new AbortController();
      const mockBucketingData: Partial<BucketingDTO> = {
        campaigns: [],
        accountSettings: {},
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockBucketingData),
      });

      await getBucketingFile(mockEnvId, mockAbortController.signal);

      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, { signal: mockAbortController.signal });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle empty campaigns array', async () => {
      const emptyBucketingData: Partial<BucketingDTO> = {
        campaigns: [],
        accountSettings: {},
      };

      const mockJson = jest.fn().mockResolvedValueOnce(emptyBucketingData);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: mockJson,
      });

      const result = await getBucketingFile(mockEnvId);

      expect(result).toEqual(emptyBucketingData);
      expect(mockJson).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error handling', () => {
    it('should throw HttpError on 4xx client errors', async () => {
      const errorBody = { error: 'Invalid environment ID' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 400,
        json: jest.fn().mockResolvedValueOnce(errorBody),
      });

      await expect(getBucketingFile(mockEnvId)).rejects.toThrow(HttpError);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpError on 5xx server errors', async () => {
      const errorBody = { error: 'Server error' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 500,
        json: jest.fn().mockResolvedValueOnce(errorBody),
      });

      await expect(getBucketingFile(mockEnvId)).rejects.toThrow(HttpError);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should propagate network errors', async () => {
      const networkError = new Error('Network request failed');
      (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(getBucketingFile(mockEnvId)).rejects.toThrow('Network request failed');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle abort signal correctly', async () => {
      const controller = new AbortController();
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);
      controller.abort();

      await expect(getBucketingFile(mockEnvId, controller.signal)).rejects.toThrow('The operation was aborted');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('should call fetch and json() exactly once per request', async () => {
      const mockBucketingData: Partial<BucketingDTO> = {
        campaigns: [],
        accountSettings: {},
      };

      const mockJson = jest.fn().mockResolvedValueOnce(mockBucketingData);
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        status: 200,
        json: mockJson,
      });

      await getBucketingFile(mockEnvId);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledTimes(1);
    });
  });
});
