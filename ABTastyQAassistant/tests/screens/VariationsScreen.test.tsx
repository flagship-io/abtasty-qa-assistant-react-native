import React from 'react';
import { render } from '@testing-library/react-native';
import { VariationScreen } from '../../src/screens/VariationsScreen';
import { CampaignType } from '../../src/types.local';

// Mock navigation
const mockRoute = {
  params: { campaignId: 'camp-1' },
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => mockRoute,
}));

// Mock hooks
const mockCampaign = {
  id: 'camp-1',
  name: 'Test Campaign',
  type: CampaignType.ab,
  variationGroups: [
    {
      id: 'vg-1',
      name: 'Variation Group 1',
      variations: [
        { id: 'var-1', name: 'Control', reference: true, modifications: { type: 'JSON', value: {} } },
        { id: 'var-2', name: 'Variant A', reference: false, modifications: { type: 'JSON', value: {} } },
      ],
    },
  ],
};

const mockVariations = [
  { id: 'var-1', name: 'Control', reference: true, modifications: { type: 'JSON', value: {} } },
  { id: 'var-2', name: 'Variant A', reference: false, modifications: { type: 'JSON', value: {} } },
];

jest.mock('../../src/hooks', () => ({
  useCampaign: jest.fn(() => mockCampaign),
  useCampaignVariations: jest.fn(() => mockVariations),
  useActiveVariationId: jest.fn(() => 'var-1'),
  useVariation: jest.fn(() => ({ id: 'var-1', name: 'Control' })),
  useCanShowVariationAction: jest.fn(() => true),
}));

// Mock components
jest.mock('../../src/components/variation', () => {
  const { Text } = require('react-native');
  const React = require('react');
  return {
    CollapsibleVariation: ({ variation, isCurrent }: any) =>
      React.createElement(Text, {}, `CollapsibleVariation: ${variation.id}, current=${isCurrent}`),
  };
});

describe('VariationScreen', () => {
  const { useCampaign, useCampaignVariations, useActiveVariationId, useVariation } = require('../../src/hooks');

  beforeEach(() => {
    jest.clearAllMocks();
    useCampaign.mockReturnValue(mockCampaign);
    useCampaignVariations.mockReturnValue(mockVariations);
    useActiveVariationId.mockReturnValue('var-1');
    useVariation.mockReturnValue({ id: 'var-1', name: 'Control' });
  });

  it('should render current variation and collapsible variations', () => {
    const campaignWithCurrent = {
      ...mockCampaign,
      currentVariation: { id: 'var-1', name: 'Control' },
    };
    useCampaign.mockReturnValue(campaignWithCurrent);

    const { toJSON, getByText } = render(<VariationScreen />);
    
    expect(getByText('CollapsibleVariation: var-1, current=true')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-2, current=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without current variation', () => {
    const campaignWithoutCurrent = {
      ...mockCampaign,
      currentVariation: null,
    };
    useCampaign.mockReturnValue(campaignWithoutCurrent);

    useActiveVariationId.mockReturnValue(null);
    useVariation.mockReturnValue(null);

    const { toJSON, getByText } = render(<VariationScreen />);
    
    expect(getByText('CollapsibleVariation: var-1, current=false')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-2, current=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle single variation', () => {
    const singleVariation = [
      { id: 'var-1', name: 'Only Variation', reference: true, modifications: { type: 'JSON', value: {} } },
    ];
    useCampaignVariations.mockReturnValue(singleVariation);

    const campaignWithSingleVar = {
      ...mockCampaign,
      currentVariation: { id: 'var-1', name: 'Only Variation' },
    };
    useCampaign.mockReturnValue(campaignWithSingleVar);

    const { toJSON, getByText, queryByText } = render(<VariationScreen />);
    
    expect(getByText('CollapsibleVariation: var-1, current=true')).toBeTruthy();
    expect(queryByText(/var-2/)).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle multiple variations with active highlight', () => {
    const multipleVariations = [
      { id: 'var-1', name: 'Control', reference: true, modifications: { type: 'JSON', value: {} } },
      { id: 'var-2', name: 'Variant A', reference: false, modifications: { type: 'JSON', value: {} } },
      { id: 'var-3', name: 'Variant B', reference: false, modifications: { type: 'JSON', value: {} } },
    ];
    useCampaignVariations.mockReturnValue(multipleVariations);
    useActiveVariationId.mockReturnValue('var-2');
    useVariation.mockReturnValue({ id: 'var-2', name: 'Variant A' });

    const campaignWithMulti = {
      ...mockCampaign,
      currentVariation: { id: 'var-2', name: 'Variant A' },
    };
    useCampaign.mockReturnValue(campaignWithMulti);

    const { toJSON, getByText } = render(<VariationScreen />);
    
    expect(getByText('CollapsibleVariation: var-1, current=false')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-2, current=true')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-3, current=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render scrollable list for many variations', () => {
    const manyVariations = Array.from({ length: 10 }, (_, i) => ({
      id: `var-${i + 1}`,
      name: `Variation ${i + 1}`,
      reference: i === 0,
      modifications: { type: 'JSON', value: {} },
    }));
    useCampaignVariations.mockReturnValue(manyVariations);
    useActiveVariationId.mockReturnValue('var-5');
    useVariation.mockReturnValue({ id: 'var-5', name: 'Variation 5' });

    const campaignWithMany = {
      ...mockCampaign,
      currentVariation: { id: 'var-5', name: 'Variation 5' },
    };
    useCampaign.mockReturnValue(campaignWithMany);

    const { toJSON, getByText } = render(<VariationScreen />);
    
    expect(getByText('CollapsibleVariation: var-1, current=false')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-5, current=true')).toBeTruthy();
    expect(getByText('CollapsibleVariation: var-10, current=false')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
