import React, { act } from "react";
import { render } from "@testing-library/react-native";
import { CollapsibleCampaigns } from "../../../src/components/campaign/CollapsibleCampaigns";
import {
  CampaignDisplayStatus,
  CampaignType,
  WebSDKCampaignStatus,
} from "../../../src/types.local";

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock icons
jest.mock("../../../src/assets/icons/ChevronDownIcon", () => ({
  ChevronDownIcon: () => "ChevronDownIcon",
}));
jest.mock("../../../src/assets/icons/ChevronUpIcon", () => ({
  ChevronUpIcon: () => "ChevronUpIcon",
}));
jest.mock("../../../src/assets/icons/ChevronRightIcon", () => ({
  ChevronRightIcon: () => "ChevronRightIcon",
}));

const createMockCampaign = (id: string, name: string) => ({
  id,
  name,
  slug: `${id}-slug`,
  type: CampaignType.ab,
  status: WebSDKCampaignStatus.ACCEPTED,
  displayStatus: CampaignDisplayStatus.SHOWN,
  hasTargetingMatched: true,
  variationGroups: [
    {
      id: "vg-1",
      name: "Variation Group 1",
      variations: [
        {
          id: "var-1",
          name: "Variation 1",
          reference: false,
          modifications: { type: "JSON", value: {} },
        },
      ],
      targeting: { targetingGroups: [] },
    },
  ],
});

describe("CollapsibleCampaigns Component", () => {
  const mockCampaigns = [
    createMockCampaign("camp-1", "Campaign 1"),
    createMockCampaign("camp-2", "Campaign 2"),
  ];

  it("should render collapsed by default", () => {
    const { toJSON } = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("should render expanded when defaultExpanded is true", () => {
    const { toJSON } = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
        defaultExpanded={true}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("should show correct campaign count for multiple campaigns", () => {
    const { toJSON, getByText } = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("2 campaigns")).toBeTruthy();
  });

  it("should show singular text for single campaign", () => {
    const singleCampaign = [createMockCampaign("camp-1", "Single Campaign")];
    const { toJSON, getByText } = render(
      <CollapsibleCampaigns
        campaigns={singleCampaign}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("1 campaign")).toBeTruthy();
  });

  it("should render with different badge statuses", () => {
    // SHOWN status
    const shownTree = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    ).toJSON();
    expect(shownTree).toMatchSnapshot();

    // HIDDEN status
    const hiddenTree = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.HIDDEN}
        badgeStatus={WebSDKCampaignStatus.REJECTED}
      />,
    ).toJSON();
    expect(hiddenTree).toMatchSnapshot();

    // RESET status
    const resetTree = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.RESET}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    ).toJSON();
    expect(resetTree).toMatchSnapshot();
  });

  it("should render with empty campaigns array", () => {
    const { toJSON } = render(
      <CollapsibleCampaigns
        campaigns={[]}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("should toggle expanded state on header press", () => {
    const { toJSON, getByText } = render(
      <CollapsibleCampaigns
        campaigns={mockCampaigns}
        badgeDisplayStatus={CampaignDisplayStatus.SHOWN}
        badgeStatus={WebSDKCampaignStatus.ACCEPTED}
      />,
    );

    // Component should render
    expect(toJSON()).toMatchSnapshot();

    // Find and press the header
    const countText = getByText("2 campaigns");
    const touchable = countText.parent;
    act(() => {
      if (touchable?.props?.onPress) {
        touchable.props.onPress();
      }
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
