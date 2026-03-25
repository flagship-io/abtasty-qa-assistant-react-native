import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VariationAction } from '../../../src/components/variation/VariationAction';

// Mock hooks
jest.mock('../../../src/hooks', () => ({
  useAllocatedVariations: jest.fn(() => ({})),
}));

// Mock Button component
jest.mock('../../../src/components/common/Button', () => ({
  Button: ({ label, onPress }: any) => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return React.createElement(
      TouchableOpacity,
      { onPress, testID: 'button' },
      React.createElement(Text, {}, label)
    );
  },
}));

describe('VariationAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show "Your version" when isCurrent is true', () => {
    const { toJSON, getByText } = render(
      <VariationAction isCurrent={true} variationId="v1" />
    );

    expect(getByText('Your version')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "View" button when variation is not allocated and not current', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({});

    const { toJSON, getByText } = render(
      <VariationAction isCurrent={false} variationId="v1" />
    );

    expect(getByText('View')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "Reset" button when variation is allocated', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({
      c1: { variationId: 'v1', campaignId: 'c1' },
    });

    const { toJSON, getByText } = render(
      <VariationAction isCurrent={false} variationId="v1" />
    );

    expect(getByText('Reset')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onView when View button is pressed', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({});

    const mockOnView = jest.fn();
    const { getByText } = render(
      <VariationAction
        isCurrent={false}
        onView={mockOnView}
        variationId="v1"
      />
    );

    const viewButton = getByText('View');
    fireEvent.press(viewButton);

    expect(mockOnView).toHaveBeenCalledTimes(1);
  });

  it('should call onView when Reset button is pressed', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({
      c1: { variationId: 'v1', campaignId: 'c1' },
    });

    const mockOnView = jest.fn();
    const { getByText } = render(
      <VariationAction
        isCurrent={false}
        onView={mockOnView}
        variationId="v1"
      />
    );

    const resetButton = getByText('Reset');
    fireEvent.press(resetButton);

    expect(mockOnView).toHaveBeenCalledTimes(1);
  });

  it('should check allocated variations correctly for matching variationId', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({
      c1: { variationId: 'v2', campaignId: 'c1' },
      c2: { variationId: 'v1', campaignId: 'c2' },
    });

    const { getByText } = render(
      <VariationAction isCurrent={false} variationId="v1" />
    );

    expect(getByText('Reset')).toBeTruthy();
  });

  it('should show View when variationId does not match any allocated variations', () => {
    const { useAllocatedVariations } = require('../../../src/hooks');
    useAllocatedVariations.mockReturnValue({
      c1: { variationId: 'v2', campaignId: 'c1' },
      c2: { variationId: 'v3', campaignId: 'c2' },
    });

    const { getByText } = render(
      <VariationAction isCurrent={false} variationId="v1" />
    );

    expect(getByText('View')).toBeTruthy();
  });
});
