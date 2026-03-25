import React from "react";
import Svg, { Path, G } from "react-native-svg";
import { IconProps } from "../../types.local";
import { COLORS, SIZE } from "../../constants";

export const ChevronRightIcon = ({
  width = SIZE.iconSmall,
  height = SIZE.iconSmall,
  color = COLORS.textPrimary,
  style,
}: IconProps) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    style={style}
  >
    <G>
      <Path
        id="Vector"
        d="M8.00826 6.04903C8.11741 5.83742 8.32952 5.66402 8.55875 5.59903C8.62343 5.58069 8.73687 5.57239 8.83511 5.57882C9.17819 5.60126 8.97841 5.41922 12.1868 8.63275C15.4419 11.893 15.1942 11.6158 15.1942 11.9997C15.1942 12.3837 15.4419 12.1065 12.1868 15.3667C8.90915 18.6496 9.16595 18.4197 8.77645 18.4197C8.59319 18.4197 8.55445 18.4114 8.41122 18.3408C7.97922 18.1282 7.80435 17.6234 8.0121 17.1887C8.05374 17.1016 8.64548 16.4951 10.5988 14.5377L13.1315 11.9997L10.5988 9.46173C8.64815 7.507 8.05371 6.89781 8.01222 6.811C7.90074 6.57772 7.89911 6.26068 8.00826 6.04903Z"
        fill={color}
      />
    </G>
  </Svg>
);
