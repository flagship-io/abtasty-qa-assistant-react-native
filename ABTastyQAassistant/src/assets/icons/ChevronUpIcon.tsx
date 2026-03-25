import React from "react";
import { SIZE, COLORS } from "../../constants";
import { IconProps } from "../../types.local";
import Svg, { Path, G } from "react-native-svg";

export function ChevronUpIcon({
  width = SIZE.iconSmall,
  height = SIZE.iconSmall,
  color = COLORS.textPrimary,
  style,
}: IconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <G id="isOutlined=false,direction=up">
        <Path
          id="Vector"
          d="M6.04951 15.5535C5.83791 15.4444 5.66451 15.2322 5.59951 15.003C5.58118 14.9383 5.57287 14.8249 5.57931 14.7267C5.60175 14.3836 5.41971 14.5834 8.63323 11.375C11.8935 8.11989 11.6162 8.36752 12.0002 8.36752C12.3842 8.36752 12.1069 8.11989 15.3672 11.375C18.6501 14.6526 18.4202 14.3958 18.4202 14.7853C18.4202 14.9686 18.4118 15.0073 18.3413 15.1505C18.1287 15.5825 17.6239 15.7574 17.1892 15.5497C17.1021 15.508 16.4956 14.9163 14.5382 12.963L12.0002 10.4303L9.46222 12.963C7.50749 14.9136 6.8983 15.5081 6.81149 15.5495C6.57821 15.661 6.26117 15.6627 6.04951 15.5535Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
