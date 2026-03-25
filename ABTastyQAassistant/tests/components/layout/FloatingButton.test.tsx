import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingButton } from '../../../src/components/layout/FloatingButton';

// Mock icons
jest.mock('../../../src/assets/icons', () => ({
  QAAIcon: () => 'QAAIcon',
}));

const getRN = () => require('react-native');

/** Render FloatingButton with a captured PanResponder config and controlled Animated mocks. */
function renderWithPanCapture(
  opts: {
    onPress?: jest.Mock;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    panX?: number;
    panY?: number;
  } = {},
) {
  const { PanResponder, Animated } = getRN();
  const { onPress = jest.fn(), position, panX = 50, panY = 100 } = opts;

  let capturedConfig: Record<string, (...args: unknown[]) => unknown> = {};

  const mockPan = {
    x: { _value: panX },
    y: { _value: panY },
    setOffset: jest.fn(),
    setValue: jest.fn(),
    flattenOffset: jest.fn(),
  };
  const mockScale = { _value: 1 };

  (Animated.ValueXY as jest.Mock).mockReturnValueOnce(mockPan);
  (Animated.Value as jest.Mock).mockReturnValueOnce(mockScale);
  (PanResponder.create as jest.Mock).mockImplementationOnce((cfg: Record<string, unknown>) => {
    capturedConfig = cfg as Record<string, (...args: unknown[]) => unknown>;
    return { panHandlers: {} };
  });

  render(<FloatingButton onPress={onPress} {...(position ? { position } : {})} />);

  return { capturedConfig, mockPan, mockScale, onPress };
}

describe('FloatingButton Component', () => {
  it('should render at all positions', () => {
    const onPress = jest.fn();
    
    // Default bottom-right
    const defaultTree = render(<FloatingButton onPress={onPress} />).toJSON();
    expect(defaultTree).toMatchSnapshot();
    
    // Top-right
    const topRightTree = render(<FloatingButton onPress={onPress} position="top-right" />).toJSON();
    expect(topRightTree).toMatchSnapshot();
    
    // Top-left
    const topLeftTree = render(<FloatingButton onPress={onPress} position="top-left" />).toJSON();
    expect(topLeftTree).toMatchSnapshot();
    
    // Bottom-left
    const bottomLeftTree = render(<FloatingButton onPress={onPress} position="bottom-left" />).toJSON();
    expect(bottomLeftTree).toMatchSnapshot();
    
    // Bottom-right explicitly
    const bottomRightTree = render(<FloatingButton onPress={onPress} position="bottom-right" />).toJSON();
    expect(bottomRightTree).toMatchSnapshot();
  });
});

// ─────────────────────────────────────────────────────────────
// PanResponder callbacks
// ─────────────────────────────────────────────────────────────
describe('FloatingButton – PanResponder callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('onStartShouldSetPanResponder always returns true', () => {
    const { capturedConfig } = renderWithPanCapture();
    expect(capturedConfig.onStartShouldSetPanResponder()).toBe(true);
  });

  it('onMoveShouldSetPanResponder always returns true', () => {
    const { capturedConfig } = renderWithPanCapture();
    expect(capturedConfig.onMoveShouldSetPanResponder()).toBe(true);
  });

  it('onPanResponderGrant springs scale to 0.9, captures offset, resets delta', () => {
    const { Animated } = getRN();
    const { capturedConfig, mockPan, mockScale } = renderWithPanCapture({ panX: 50, panY: 100 });

    (capturedConfig.onPanResponderGrant as () => void)();

    expect(Animated.spring).toHaveBeenCalledWith(mockScale, {
      toValue: 0.9,
      useNativeDriver: false,
    });
    expect(mockPan.setOffset).toHaveBeenCalledWith({ x: 50, y: 100 });
    expect(mockPan.setValue).toHaveBeenCalledWith({ x: 0, y: 0 });
  });

  it('onPanResponderRelease springs scale back to 1 and flattens offset', () => {
    const { Animated } = getRN();
    const { capturedConfig, mockPan, mockScale } = renderWithPanCapture();

    // large drag — not a tap
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 50, dy: 50 });

    expect(Animated.spring).toHaveBeenCalledWith(mockScale, {
      toValue: 1,
      useNativeDriver: false,
    });
    expect(mockPan.flattenOffset).toHaveBeenCalled();
  });

  it('single tap: calls onPress after 300 ms (setTimeout path)', () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { capturedConfig } = renderWithPanCapture({ onPress });

    // dx + dy both < 5 → counts as tap
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 1, dy: 1 });

    expect(onPress).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onPress).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('double tap: calls onPress immediately on second tap within 300 ms', () => {
    jest.useFakeTimers();
    const base = 1_000_000;
    const onPress = jest.fn();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(base)
      .mockReturnValueOnce(base + 100); // within 300 ms

    const { capturedConfig } = renderWithPanCapture({ onPress });

    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 0, dy: 0 });
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 0, dy: 0 });

    expect(onPress).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('single tap after previous tap > 300 ms ago: calls onPress via timeout', () => {
    jest.useFakeTimers();
    const base = 1_000_000;
    const onPress = jest.fn();
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(base)
      .mockReturnValueOnce(base + 500); // > 300 ms → not a double-tap

    const { capturedConfig } = renderWithPanCapture({ onPress });

    // First tap sets lastTap
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 0, dy: 0 });
    jest.runAllTimers();
    // Second "tap" after 500 ms
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 0, dy: 0 });
    jest.runAllTimers();

    expect(onPress).toHaveBeenCalledTimes(2);

    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('springs pan to bounded position when dragged out of screen bounds', () => {
    const { Animated } = getRN();
    // SCREEN_WIDTH=375, SCREEN_HEIGHT=812, BUTTON_SIZE=60
    // maxX = 375 - 60 = 315, maxY = 812 - 60 - 40 = 712
    const { capturedConfig, mockPan } = renderWithPanCapture({ panX: 400, panY: 900 });

    // large drag — not a tap
    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 50, dy: 50 });

    expect(Animated.spring).toHaveBeenCalledWith(mockPan, {
      toValue: { x: 315, y: 712 },
      useNativeDriver: false,
    });
  });

  it('does not spring pan when position is already within bounds', () => {
    const { Animated } = getRN();
    const { capturedConfig } = renderWithPanCapture({ panX: 100, panY: 200 });

    (capturedConfig.onPanResponderRelease as (e: null, g: object) => void)(null, { dx: 50, dy: 50 });

    // Only the scale spring (toValue:1) should be called — no pan spring
    const panSpringCalls = (Animated.spring as jest.Mock).mock.calls.filter(
      (call) => call[1]?.toValue?.x !== undefined,
    );
    expect(panSpringCalls).toHaveLength(0);
  });
});
