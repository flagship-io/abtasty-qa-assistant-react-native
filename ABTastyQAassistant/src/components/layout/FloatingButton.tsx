import React, { useRef } from "react";
import { StyleSheet, View, Animated, PanResponder, Dimensions } from "react-native";
import { QAAIcon } from "../../assets/icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 60;

interface FloatingButtonProps {
  onPress: () => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

function getAnimatedValue(animValue: Animated.Value): number {
  return (animValue as unknown as { _value: number })._value;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  position = "bottom-right",
}) => {
  const initialPosition = getInitialPosition(position);
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const lastTap = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: false,
        }).start();
        pan.setOffset({
          x: getAnimatedValue(pan.x),
          y: getAnimatedValue(pan.y),
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        pan.flattenOffset();

        const isTap = Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5;
        
        if (isTap) {
          const now = Date.now();
          if (lastTap.current && now - lastTap.current < 300) {
            onPress();
          } else {
            lastTap.current = now;
            setTimeout(() => {
              if (lastTap.current === now) {
                onPress();
              }
            }, 300);
          }
        }

        const currentX = getAnimatedValue(pan.x);
        const currentY = getAnimatedValue(pan.y);

        const boundedX = Math.max(
          0,
          Math.min(SCREEN_WIDTH - BUTTON_SIZE, currentX)
        );
        const boundedY = Math.max(
          0,
          Math.min(SCREEN_HEIGHT - BUTTON_SIZE - 40, currentY)
        );

        if (currentX !== boundedX || currentY !== boundedY) {
          Animated.spring(pan, {
            toValue: { x: boundedX, y: boundedY },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.button}>
        <QAAIcon width={BUTTON_SIZE} height={BUTTON_SIZE} />
      </View>
    </Animated.View>
  );
};

const getInitialPosition = (
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left"
) => {
  const offset = 20;

  const safeBottomPosition = SCREEN_HEIGHT - BUTTON_SIZE - offset - 100;

  switch (position) {
    case "top-right":
      return { x: SCREEN_WIDTH - BUTTON_SIZE - offset, y: offset };
    case "top-left":
      return { x: offset, y: offset };
    case "bottom-right":
      return { x: SCREEN_WIDTH - BUTTON_SIZE - offset, y: safeBottomPosition };
    case "bottom-left":
      return { x: offset, y: safeBottomPosition };
  }
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 9999,
  },
  button: {
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  }
});
