import React from "react";
import { SIZE, COLORS } from "../../constants";
import { IconProps } from "../../types.local";
import { Path, Svg, G } from "react-native-svg";

export const CheckIcon = ({
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
      <G id="isOutlined=false,isBold=false">
        <Path
          id="Vector"
          d="M18.0989 5.37862C18.1993 5.31888 18.3422 5.25495 18.4165 5.23652C18.6586 5.17651 19.0133 5.21237 19.231 5.31888C19.6386 5.51829 19.8802 5.87358 19.9107 6.31822C19.9317 6.62465 19.8728 6.84709 19.7068 7.08926C19.5449 7.32544 10.7246 18.3437 10.5886 18.4797C10.5229 18.5454 10.3805 18.6427 10.2723 18.6959C10.0976 18.7816 10.0393 18.7925 9.75461 18.7925C9.47409 18.7925 9.41215 18.7813 9.26134 18.7035C9.01864 18.5781 4.53163 15.2049 4.37298 15.0285C4.1938 14.8293 4.10708 14.617 4.08864 14.3322C4.0339 13.4867 4.8207 12.8527 5.62256 13.0963C5.83483 13.1608 6.00878 13.2825 7.70311 14.5527L9.552 15.9387L13.7342 10.713C17.4829 6.02879 17.9352 5.47601 18.0989 5.37862Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};
