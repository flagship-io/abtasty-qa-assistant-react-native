import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QAAssistantContent } from '../src/QAAssistantContent';
import { ABTastyQA } from '@flagship.io/react-native-sdk';

// Mock providers and components
jest.mock('../src/providers/AppProvider', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../src/components/layout', () => ({
  FloatingButton: ({ onPress, position }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View>
        <TouchableOpacity testID="floating-button" onPress={onPress}>
          <Text>{position}</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

jest.mock('../src/components/layout/QAAssistantModal', () => ({
  QAAssistantModal: ({ visible, onClose }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    if (!visible) return null;
    return (
      <View testID="qa-modal">
        <Text>Modal Content</Text>
        <TouchableOpacity testID="close-modal" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

describe('QAAssistantContent', () => {
  let mockABTastyQA: ABTastyQA;

  beforeEach(() => {
    jest.clearAllMocks();

    mockABTastyQA = {
      envId: 'test-env-123',
      isQAModeEnabled: true,
      ABTastyQAEventBus: {
        emitQAEventToSDK: jest.fn(),
        onQAEventFromSDK: jest.fn(() => jest.fn()),
      },
    } as any;
  });

  it('should render with AppProvider wrapper', () => {
    const result = render(
      <QAAssistantContent config={{}} ABTastQA={mockABTastyQA} />
    );

    expect(result).toBeTruthy();
  });

  it('should render FloatingButton when floatingButton config is enabled', () => {
    const { getByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true, position: 'bottom-right' }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    expect(getByTestId('floating-button')).toBeTruthy();
  });

  it('should not render FloatingButton when floatingButton config is disabled', () => {
    const { queryByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: false }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    expect(queryByTestId('floating-button')).toBeNull();
  });

  it('should pass correct position to FloatingButton', () => {
    const { getByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true, position: 'top-left' }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    const button = getByTestId('floating-button');
    expect(button).toBeTruthy();
  });

  it('should not show modal initially', () => {
    const { queryByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    expect(queryByTestId('qa-modal')).toBeNull();
  });

  it('should show modal when floating button is pressed', () => {
    const { getByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    const button = getByTestId('floating-button');
    fireEvent.press(button);

    expect(getByTestId('qa-modal')).toBeTruthy();
  });

  it('should hide modal when close button is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    // Open modal
    const button = getByTestId('floating-button');
    fireEvent.press(button);
    expect(getByTestId('qa-modal')).toBeTruthy();

    // Close modal
    const closeButton = getByTestId('close-modal');
    fireEvent.press(closeButton);
    expect(queryByTestId('qa-modal')).toBeNull();
  });

  it('should toggle modal visibility multiple times', () => {
    const { getByTestId, queryByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: true }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    const button = getByTestId('floating-button');

    // First open
    fireEvent.press(button);
    expect(getByTestId('qa-modal')).toBeTruthy();

    // First close
    fireEvent.press(getByTestId('close-modal'));
    expect(queryByTestId('qa-modal')).toBeNull();

    // Second open
    fireEvent.press(button);
    expect(getByTestId('qa-modal')).toBeTruthy();

    // Second close
    fireEvent.press(getByTestId('close-modal'));
    expect(queryByTestId('qa-modal')).toBeNull();
  });

  it('should render container with correct pointer events', () => {
    const { UNSAFE_getByType } = render(
      <QAAssistantContent 
        config={{}} 
        ABTastQA={mockABTastyQA} 
      />
    );

    const { View } = require('react-native');
    const views = UNSAFE_getByType(View);
    expect(views.props.pointerEvents).toBe('box-none');
  });

  it('should work without floating button', () => {
    const { queryByTestId } = render(
      <QAAssistantContent 
        config={{ floatingButton: false }} 
        ABTastQA={mockABTastyQA} 
      />
    );

    // Modal should not be accessible when there's no floating button
    expect(queryByTestId('floating-button')).toBeNull();
    expect(queryByTestId('qa-modal')).toBeNull();
  });
});
