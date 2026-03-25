import { renderHook } from '@testing-library/react-native';
import { useSwipeToDismiss } from '../../src/hooks/useSwipeToDismiss';

// Helpers to access the mocked RN modules
const getRN = () => require('react-native');

// Capture the PanResponder config passed on hook initialisation
function renderHookAndCaptureConfig(onDismiss = jest.fn()) {
  let capturedConfig: Record<string, (...args: unknown[]) => unknown> = {};

  const { PanResponder, Animated } = getRN();
  (PanResponder.create as jest.Mock).mockImplementationOnce((cfg) => {
    capturedConfig = cfg;
    return { panHandlers: {} };
  });

  const translateYMock = {
    setValue: jest.fn(),
    _value: 0,
  };
  (Animated.Value as jest.Mock).mockReturnValueOnce(translateYMock);

  const { result } = renderHook(() => useSwipeToDismiss(onDismiss));

  return { result, capturedConfig, translateYMock, onDismiss };
}

// ─────────────────────────────────────────────────────────────
// Return shape
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – return value', () => {
  it('returns translateY and panHandlers', () => {
    const { result } = renderHookAndCaptureConfig();
    expect(result.current.translateY).toBeDefined();
    expect(result.current.panHandlers).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────
// onStartShouldSetPanResponder
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – onStartShouldSetPanResponder', () => {
  it('returns true on Android', () => {
    const { Platform } = getRN();
    Platform.OS = 'android';

    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onStartShouldSetPanResponder()).toBe(true);

    Platform.OS = 'ios';
  });

  it('returns false on iOS', () => {
    const { Platform } = getRN();
    Platform.OS = 'ios';

    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onStartShouldSetPanResponder()).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// onMoveShouldSetPanResponder
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – onMoveShouldSetPanResponder', () => {
  afterEach(() => {
    getRN().Platform.OS = 'ios';
  });

  it('returns true when Android + downward vertical drag', () => {
    getRN().Platform.OS = 'android';
    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onMoveShouldSetPanResponder(null, { dy: 10, dx: 2 })).toBe(true);
  });

  it('returns false when dy is too small', () => {
    getRN().Platform.OS = 'android';
    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onMoveShouldSetPanResponder(null, { dy: 3, dx: 0 })).toBe(false);
  });

  it('returns false when horizontal drag dominates', () => {
    getRN().Platform.OS = 'android';
    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onMoveShouldSetPanResponder(null, { dy: 10, dx: 20 })).toBe(false);
  });

  it('returns false on iOS regardless of gesture', () => {
    getRN().Platform.OS = 'ios';
    const { capturedConfig } = renderHookAndCaptureConfig();
    expect(capturedConfig.onMoveShouldSetPanResponder(null, { dy: 100, dx: 0 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// onPanResponderMove
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – onPanResponderMove', () => {
  it('sets translateY to dy when dy is positive', () => {
    const { capturedConfig, translateYMock } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderMove(null, { dy: 80 });
    expect(translateYMock.setValue).toHaveBeenCalledWith(80);
  });

  it('does not move when dy is zero', () => {
    const { capturedConfig, translateYMock } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderMove(null, { dy: 0 });
    expect(translateYMock.setValue).not.toHaveBeenCalled();
  });

  it('does not move when dy is negative (upward drag)', () => {
    const { capturedConfig, translateYMock } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderMove(null, { dy: -50 });
    expect(translateYMock.setValue).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// onPanResponderRelease – dismiss threshold
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – onPanResponderRelease (dismiss)', () => {
  it('calls Animated.timing and then onDismiss when dy exceeds threshold', () => {
    const { Animated } = getRN();
    const startMock = jest.fn((cb) => cb && cb());
    (Animated.timing as jest.Mock).mockReturnValueOnce({ start: startMock });

    const onDismiss = jest.fn();
    const { capturedConfig, translateYMock } = renderHookAndCaptureConfig(onDismiss);

    capturedConfig.onPanResponderRelease(null, { dy: 200, vy: 0.1 });

    expect(Animated.timing).toHaveBeenCalled();
    expect(startMock).toHaveBeenCalled();
    expect(translateYMock.setValue).toHaveBeenCalledWith(0);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses when velocity exceeds threshold even if dy is small', () => {
    const { Animated } = getRN();
    const startMock = jest.fn((cb) => cb && cb());
    (Animated.timing as jest.Mock).mockReturnValueOnce({ start: startMock });

    const onDismiss = jest.fn();
    const { capturedConfig } = renderHookAndCaptureConfig(onDismiss);

    capturedConfig.onPanResponderRelease(null, { dy: 50, vy: 0.8 });

    expect(Animated.timing).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('resets position when dy and vy are below thresholds', () => {
    const { Animated } = getRN();
    const springStartMock = jest.fn();
    (Animated.spring as jest.Mock).mockReturnValueOnce({ start: springStartMock });

    const onDismiss = jest.fn();
    const { capturedConfig } = renderHookAndCaptureConfig(onDismiss);

    capturedConfig.onPanResponderRelease(null, { dy: 50, vy: 0.2 });

    expect(Animated.spring).toHaveBeenCalled();
    expect(springStartMock).toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// onPanResponderTerminate
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – onPanResponderTerminate', () => {
  it('resets position when gesture is terminated by the system', () => {
    const { Animated } = getRN();
    const springStartMock = jest.fn();
    (Animated.spring as jest.Mock).mockReturnValueOnce({ start: springStartMock });

    const { capturedConfig } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderTerminate();

    expect(Animated.spring).toHaveBeenCalled();
    expect(springStartMock).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────
// dismiss animation config
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – dismiss animation parameters', () => {
  it('animates to full screen height with 250ms duration', () => {
    const { Animated, Dimensions } = getRN();
    (Dimensions.get as jest.Mock).mockReturnValue({ width: 375, height: 812 });

    const startMock = jest.fn();
    (Animated.timing as jest.Mock).mockReturnValueOnce({ start: startMock });

    const { capturedConfig } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderRelease(null, { dy: 200, vy: 0.1 });

    expect(Animated.timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 812, duration: 250, useNativeDriver: true })
    );
  });
});

// ─────────────────────────────────────────────────────────────
// resetPosition animation config
// ─────────────────────────────────────────────────────────────
describe('useSwipeToDismiss – resetPosition animation parameters', () => {
  it('springs back to 0 with bounciness 4', () => {
    const { Animated } = getRN();
    const springStartMock = jest.fn();
    (Animated.spring as jest.Mock).mockReturnValueOnce({ start: springStartMock });

    const { capturedConfig } = renderHookAndCaptureConfig();
    capturedConfig.onPanResponderRelease(null, { dy: 10, vy: 0.1 });

    expect(Animated.spring).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 0, bounciness: 4, useNativeDriver: true })
    );
  });
});
