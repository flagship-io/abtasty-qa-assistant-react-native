import {
  setIsCampaignsLoading,
  setBucketingFile,
  splitCampaignsByAllocationActionCreator,
  applyForcedVariation,
  applyForceAllocation,
  unsetForcedAllocation,
  applyForcedUnallocation,
  unsetForcedUnallocation,
  setShouldSendForcedAllocation,
  setShouldSendForcedUnallocation,
  resetAllCampaigns,
  searchCampaignsActionCreator,
  addHitsActionCreator,
} from '../../src/reducers/actionsCreator';

describe('Action Creators', () => {
  it('setIsCampaignsLoading should create correct action', () => {
    expect(setIsCampaignsLoading(true)).toEqual({
      type: 'SET_IS_CAMPAIGNS_LOADING',
      payload: true,
    });
    expect(setIsCampaignsLoading(false)).toEqual({
      type: 'SET_IS_CAMPAIGNS_LOADING',
      payload: false,
    });
  });

  it('setBucketingFile should create correct action', () => {
    const bucketingFile = { campaigns: [], panic: false };
    expect(setBucketingFile(bucketingFile as any)).toEqual({
      type: 'SET_BUCKETING_FILE',
      payload: bucketingFile,
    });
  });

  it('splitCampaignsByAllocationActionCreator should create correct action', () => {
    const params = {
      value: { 'camp-1': { campaignId: 'camp-1', variationGroupId: 'vg-1', variationId: 'v-1' } } as any,
      visitorData: { visitorId: 'v-123', context: {}, hasConsented: true },
      sdkInfo: { name: 'sdk', version: '1.0.0', tag: 'v1' },
    };
    const action = splitCampaignsByAllocationActionCreator(params);
    expect(action.type).toBe('SPLIT_CAMPAIGNS_BY_ALLOCATION');
    expect((action as any).payload).toEqual(expect.objectContaining({ value: params.value, visitorData: params.visitorData }));
  });

  it('applyForcedVariation should create correct action', () => {
    const value = { 'camp-1': {} as any };
    expect(applyForcedVariation(value)).toEqual({
      type: 'APPLY_FORCE_VARIATION',
      payload: value,
    });
  });

  it('applyForceAllocation should create correct action', () => {
    const value = { 'camp-1': {} as any };
    expect(applyForceAllocation(value)).toEqual({
      type: 'APPLY_FORCED_ALLOCATION',
      payload: { value },
    });
  });

  it('unsetForcedAllocation should create correct action', () => {
    expect(unsetForcedAllocation('camp-1')).toEqual({
      type: 'UNSET_FORCED_ALLOCATION',
      payload: { campaignId: 'camp-1' },
    });
  });

  it('applyForcedUnallocation should create correct action', () => {
    const value = { 'camp-1': {} as any };
    expect(applyForcedUnallocation(value)).toEqual({
      type: 'APPLY_FORCE_UNALLOCATION',
      payload: { value },
    });
  });

  it('unsetForcedUnallocation should create correct action', () => {
    expect(unsetForcedUnallocation('camp-1')).toEqual({
      type: 'UNSET_FORCED_UNALLOCATION',
      payload: { campaignId: 'camp-1' },
    });
  });

  it('setShouldSendForcedAllocation should create correct action', () => {
    expect(setShouldSendForcedAllocation(true)).toEqual({
      type: 'SET_SHOULD_SEND_FORCED_ALLOCATION',
      payload: true,
    });
  });

  it('setShouldSendForcedUnallocation should create correct action', () => {
    expect(setShouldSendForcedUnallocation(false)).toEqual({
      type: 'SET_SHOULD_SEND_FORCED_UNALLOCATION',
      payload: false,
    });
  });

  it('resetAllCampaigns should create correct action', () => {
    expect(resetAllCampaigns()).toEqual({
      type: 'RESET_ALL_CAMPAIGNS',
    });
  });

  it('searchCampaignsActionCreator should create correct action', () => {
    expect(searchCampaignsActionCreator('test')).toEqual({
      type: 'SEARCH_CAMPAIGNS',
      payload: { searchTerm: 'test' },
    });
  });

  it('addHitsActionCreator should create correct action', () => {
    const hits = [{ type: 'PAGEVIEW', url: '/home' }, { type: 'EVENT', action: 'click' }];
    expect(addHitsActionCreator(hits)).toEqual({
      type: 'ADD_HITS',
      payload: { value: hits },
    });
  });

  it('addHitsActionCreator should handle empty array', () => {
    expect(addHitsActionCreator([])).toEqual({
      type: 'ADD_HITS',
      payload: { value: [] },
    });
  });
});
