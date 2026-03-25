import { useRef, useCallback } from "react";
import { Animated, Dimensions, PanResponder, Platform } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DISMISS_THRESHOLD = 150;
const DISMISS_VELOCITY = 0.5;

/**
 *
 * @returns `translateY` – Animated value to apply as `{ transform: [{ translateY }] }`
 * @returns `panHandlers` – spread onto the root `Animated.View` of the sheet
 */
export function useSwipeToDismiss(onDismiss: () => void) {
  const translateY = useRef(new Animated.Value(0)).current;

  const resetPosition = useCallback(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [translateY]);

  const dismiss = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onDismiss();
    });
  }, [translateY, onDismiss]);

  const panResponder = useRef(
    PanResponder.create({
      // Only intercept gestures on Android — iOS handles this natively
      onStartShouldSetPanResponder: () => Platform.OS === "android",
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        Platform.OS === "android" && dy > 5 && Math.abs(dy) > Math.abs(dx),
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) {
          translateY.setValue(dy);
        }
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > DISMISS_THRESHOLD || vy > DISMISS_VELOCITY) {
          dismiss();
        } else {
          resetPosition();
        }
      },
      onPanResponderTerminate: () => resetPosition(),
    })
  ).current;

  return { translateY, panHandlers: panResponder.panHandlers };
}
