import React from 'react';
import { render } from '@testing-library/react-native';
import { QAAssistantModal } from '../../../src/components/layout/QAAssistantModal';

// Mock all dependencies
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  NavigationIndependentTree: ({ children }: { children: React.ReactNode }) => children,
  useNavigation: jest.fn(),
}));

jest.mock('../../../src/navigation/QANavigator', () => ({
  createQANavigator: jest.fn(() => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  })),
}));

jest.mock('../../../src/screens/HomeScreen', () => ({
  HomeScreen: () => null,
}));

jest.mock('../../../src/screens/CampaignDetailsScreen', () => ({
  CampaignDetailsScreen: () => null,
}));

jest.mock('../../../src/components/layout/Header', () => ({
  Header: () => null,
}));

jest.mock('../../../src/hooks/useSwipeToDismiss', () => ({
  useSwipeToDismiss: jest.fn(() => ({
    translateY: { _value: 0 },
    panHandlers: { onStartShouldSetResponder: jest.fn() },
  })),
}));

describe('QAAssistantModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // Rendering
  // ─────────────────────────────────────────────
  describe('rendering', () => {
    it('renders when visible is true', () => {
      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={true} onClose={mockOnClose} />
      );
      const { Modal } = require('react-native');
      expect(UNSAFE_getByType(Modal)).toBeTruthy();
    });

    it('renders when visible is false', () => {
      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={false} onClose={mockOnClose} />
      );
      const { Modal } = require('react-native');
      expect(UNSAFE_getByType(Modal)).toBeTruthy();
    });

    it('renders SafeAreaView with correct edges', () => {
      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={true} onClose={mockOnClose} />
      );
      const { SafeAreaView } = require('react-native-safe-area-context');
      const safeArea = UNSAFE_getByType(SafeAreaView);
      expect(safeArea.props.edges).toEqual(['bottom', 'left', 'right']);
    });

    it('renders the navigation structure', () => {
      const result = render(
        <QAAssistantModal visible={true} onClose={mockOnClose} />
      );
      expect(result).toBeTruthy();
    });
  });

  // ─────────────────────────────────────────────
  // Modal props
  // ─────────────────────────────────────────────
  describe('Modal props', () => {
    function getModal(visible = true) {
      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={visible} onClose={mockOnClose} />
      );
      const { Modal } = require('react-native');
      return UNSAFE_getByType(Modal);
    }

    it('forwards the visible prop', () => {
      expect(getModal(true).props.visible).toBe(true);
      expect(getModal(false).props.visible).toBe(false);
    });

    it('sets animationType to "slide"', () => {
      expect(getModal().props.animationType).toBe('slide');
    });

    it('sets presentationStyle to "pageSheet"', () => {
      expect(getModal().props.presentationStyle).toBe('pageSheet');
    });

    it('passes onClose as onRequestClose', () => {
      expect(getModal().props.onRequestClose).toBe(mockOnClose);
    });
  });

  // ─────────────────────────────────────────────
  // Swipe-to-dismiss integration
  // ─────────────────────────────────────────────
  describe('swipe-to-dismiss integration', () => {
    it('calls useSwipeToDismiss with the onClose callback', () => {
      const { useSwipeToDismiss } = require('../../../src/hooks/useSwipeToDismiss');
      render(<QAAssistantModal visible={true} onClose={mockOnClose} />);
      expect(useSwipeToDismiss).toHaveBeenCalledWith(mockOnClose);
    });

    it('applies translateY transform from useSwipeToDismiss to the Animated.View', () => {
      const { Animated } = require('react-native');
      const mockTranslateY = { _value: 0 };
      const { useSwipeToDismiss } = require('../../../src/hooks/useSwipeToDismiss');
      (useSwipeToDismiss as jest.Mock).mockReturnValueOnce({
        translateY: mockTranslateY,
        panHandlers: {},
      });

      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={true} onClose={mockOnClose} />
      );

      const animatedView = UNSAFE_getByType(Animated.View);
      const transform = animatedView.props.style[1]?.transform;
      expect(transform).toEqual([{ translateY: mockTranslateY }]);
    });

    it('spreads panHandlers onto the Animated.View', () => {
      const { Animated } = require('react-native');
      const mockPanHandlers = { onStartShouldSetResponder: jest.fn(), testHandlerProp: true };
      const { useSwipeToDismiss } = require('../../../src/hooks/useSwipeToDismiss');
      (useSwipeToDismiss as jest.Mock).mockReturnValueOnce({
        translateY: { _value: 0 },
        panHandlers: mockPanHandlers,
      });

      const { UNSAFE_getByType } = render(
        <QAAssistantModal visible={true} onClose={mockOnClose} />
      );

      const animatedView = UNSAFE_getByType(Animated.View);
      expect(animatedView.props.testHandlerProp).toBe(true);
    });

    it('updates swipe handler when onClose prop changes', () => {
      const { useSwipeToDismiss } = require('../../../src/hooks/useSwipeToDismiss');
      const firstClose = jest.fn();
      const secondClose = jest.fn();

      const { rerender } = render(
        <QAAssistantModal visible={true} onClose={firstClose} />
      );
      rerender(<QAAssistantModal visible={true} onClose={secondClose} />);

      const calls = (useSwipeToDismiss as jest.Mock).mock.calls;
      expect(calls[0][0]).toBe(firstClose);
      expect(calls[1][0]).toBe(secondClose);
    });
  });
});
