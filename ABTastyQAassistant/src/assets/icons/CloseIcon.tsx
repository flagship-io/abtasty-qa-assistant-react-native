import React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS, SIZE } from "../../constants";

interface CloseIconProps {
  width?: number;
  height?: number;
  color?: string;
  style?: object;
}

export function CloseIcon({
  width = SIZE.iconSmall,
  height = SIZE.iconSmall,
  color = COLORS.textPrimary,
}: CloseIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.15716 6.15643C6.48911 5.82448 7.0273 5.82448 7.35924 6.15643L12.0008 10.798L16.6424 6.15643C16.9743 5.82449 17.5125 5.82448 17.8445 6.15643C18.1764 6.48837 18.1764 7.02656 17.8445 7.35851L13.2029 12.0001L17.8445 16.6417C18.1764 16.9736 18.1764 17.5118 17.8445 17.8438C17.5125 18.1757 16.9743 18.1757 16.6424 17.8438L12.0008 13.2022L7.35924 17.8438C7.0273 18.1757 6.48911 18.1757 6.15716 17.8437C5.82522 17.5118 5.82522 16.9736 6.15716 16.6417L10.7988 12.0001L6.15716 7.35851C5.82522 7.02657 5.82522 6.48837 6.15716 6.15643Z"
        fill={color}
      />
    </Svg>
  );
}
