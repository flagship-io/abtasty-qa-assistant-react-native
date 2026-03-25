import React from "react";
import { Path, Svg, G } from "react-native-svg";
import { SIZE, COLORS } from "../../constants";
import { IconProps } from "../../types.local";

export function ChevronDownIcon({
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
      <G id="isOutlined=false,direction=down">
        <Path
          id="Vector"
          d="M17.9515 8.44649C18.1631 8.55564 18.3365 8.76775 18.4015 8.99698C18.4198 9.06166 18.4281 9.17511 18.4217 9.27334C18.3992 9.61642 18.5813 9.41664 15.3677 12.625C12.1075 15.8801 12.3847 15.6325 12.0008 15.6325C11.6168 15.6325 11.894 15.8801 8.63377 12.625C5.35089 9.34738 5.58076 9.60418 5.58076 9.21468C5.58076 9.03142 5.58914 8.99268 5.65965 8.84945C5.87231 8.41745 6.37708 8.24259 6.81179 8.45033C6.89891 8.49197 7.50537 9.08371 9.46276 11.037L12.0008 13.5697L14.5388 11.037C16.4935 9.08638 17.1027 8.49195 17.1895 8.45045C17.4228 8.33897 17.7398 8.33734 17.9515 8.44649Z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
