import React from "react";
import { ViewStyle } from "react-native";
import Svg, { Circle, Rect, G, Path, Defs, ClipPath } from "react-native-svg";

interface QAAIconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: ViewStyle
}

export function QAAIcon({
  width = 40,
  height = 40,
  style,
}: QAAIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 35" fill="none" style={style}>
      <Circle cx="16" cy="16" r="16" fill="#3100BF" />
      <G clipPath="url(#clip0_6600_952)">
        <Path
          d="M21.701 19.5359L24.0001 9.59863H15.2209L14.1991 14.0606H11.4061L10.4013 18.3438H8.92816L8 22.3715H10.529L10.6568 21.7924L9.41353 21.2219H14.429L14.5993 20.4811L12.3853 19.5359H21.701Z"
          fill="#C0E605"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_6600_952">
          <Rect
            width="16.0001"
            height="16"
            fill="white"
            transform="translate(8 8)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
