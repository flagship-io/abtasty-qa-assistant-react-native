import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { IconProps } from "../../types.local";
import { COLORS, SIZE } from "../../constants";

export const ChevronLeftIcon = ({
  width = SIZE.iconSmall,
  height = SIZE.iconSmall,
  color = COLORS.textPrimary,
  style,
}: IconProps) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <G id="isOutlined=false,direction=left">
        <Path
          id="Vector"
          d="M15.1148 17.951C15.0056 18.1626 14.7935 18.336 14.5643 18.401C14.4996 18.4193 14.3862 18.4276 14.2879 18.4212C13.9449 18.3987 14.1446 18.5808 10.9362 15.3673C7.68117 12.107 7.9288 12.3842 7.9288 12.0003C7.9288 11.6163 7.68117 11.8935 10.9362 8.63329C14.2139 5.3504 13.9571 5.58027 14.3466 5.58027C14.5299 5.58027 14.5686 5.58865 14.7118 5.65916C15.1438 5.87182 15.3187 6.37659 15.1109 6.8113C15.0693 6.89842 14.4776 7.50488 12.5243 9.46227L9.99156 12.0003L12.5243 14.5383C14.4749 16.493 15.0693 17.1022 15.1108 17.189C15.2223 17.4223 15.2239 17.7393 15.1148 17.951Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
