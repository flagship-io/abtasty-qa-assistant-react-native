import {
  DEFAULT_CONFIG,
  COLORS,
  SIZE,
  CAMPAIGN_TYPE_LABELS,
  BUCKETING_API_URL,
} from "../../src/constants";

describe("constants", () => {
  describe("DEFAULT_CONFIG", () => {
    it("should have all required properties", () => {
      expect(DEFAULT_CONFIG).toBeDefined();
      expect(DEFAULT_CONFIG.position).toBeDefined();
      expect(DEFAULT_CONFIG.floatingButton).toBeDefined();
    });

    it("should have correct default values", () => {
      expect(DEFAULT_CONFIG.position).toBe("bottom-right");
      expect(DEFAULT_CONFIG.floatingButton).toBe(true);
    });

    it("should have correct types", () => {
      expect(typeof DEFAULT_CONFIG.position).toBe("string");
      expect(typeof DEFAULT_CONFIG.floatingButton).toBe("boolean");
    });
  });

  describe("COLORS", () => {
    it("should define all basic colors", () => {
      expect(COLORS.primary).toBeDefined();
      expect(COLORS.secondary).toBeDefined();
      expect(COLORS.success).toBeDefined();
      expect(COLORS.warning).toBeDefined();
      expect(COLORS.danger).toBeDefined();
    });

    it("should use valid hex color format", () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      expect(COLORS.primary).toMatch(hexColorRegex);
      expect(COLORS.secondary).toMatch(hexColorRegex);
      expect(COLORS.success).toMatch(hexColorRegex);
      expect(COLORS.warning).toMatch(hexColorRegex);
      expect(COLORS.danger).toMatch(hexColorRegex);
    });

    it("should define text colors", () => {
      expect(COLORS.textPrimary).toBeDefined();
      expect(COLORS.textSecondary).toBeDefined();
      expect(COLORS.text).toBeDefined();
      expect(COLORS.textLight).toBeDefined();
      expect(COLORS.textGray).toBeDefined();
    });

    it("should define background colors", () => {
      expect(COLORS.background).toBeDefined();
      expect(COLORS.backgroundSecondary).toBeDefined();
      expect(COLORS.backgroundDark).toBeDefined();
    });

    it("should define dark variants", () => {
      expect(COLORS.successDark).toBeDefined();
      expect(COLORS.warningDark).toBeDefined();
      expect(COLORS.dangerDark).toBeDefined();
    });

    it("should define light backgrounds", () => {
      expect(COLORS.backgroundSuccessLight).toBeDefined();
      expect(COLORS.backgroundWarningLight).toBeDefined();
      expect(COLORS.backgroundDangerLight).toBeDefined();
    });

    it("should define UI element colors", () => {
      expect(COLORS.border).toBeDefined();
      expect(COLORS.separator).toBeDefined();
      expect(COLORS.modalBackground).toBeDefined();
    });
  });

  describe("SIZE", () => {
    it("should define all sizes", () => {
      expect(SIZE.iconSmall).toBeDefined();
      expect(SIZE.iconMedium).toBeDefined();
      expect(SIZE.iconLarge).toBeDefined();
      expect(SIZE.floatingButton).toBeDefined();
    });

    it("should have correct values", () => {
      expect(SIZE.iconSmall).toBe(24);
      expect(SIZE.iconMedium).toBe(32);
      expect(SIZE.iconLarge).toBe(40);
      expect(SIZE.floatingButton).toBe(56);
    });

    it("should have numeric types", () => {
      expect(typeof SIZE.iconSmall).toBe("number");
      expect(typeof SIZE.iconMedium).toBe("number");
      expect(typeof SIZE.iconLarge).toBe("number");
      expect(typeof SIZE.floatingButton).toBe("number");
    });

    it("should have positive values", () => {
      expect(SIZE.iconSmall).toBeGreaterThan(0);
      expect(SIZE.iconMedium).toBeGreaterThan(0);
      expect(SIZE.iconLarge).toBeGreaterThan(0);
      expect(SIZE.floatingButton).toBeGreaterThan(0);
    });

    it("should have ascending size order for icons", () => {
      expect(SIZE.iconSmall).toBeLessThan(SIZE.iconMedium);
      expect(SIZE.iconMedium).toBeLessThan(SIZE.iconLarge);
    });
  });

  describe("CAMPAIGN_TYPE_LABELS", () => {
    it("should define all campaign types", () => {
      expect(CAMPAIGN_TYPE_LABELS.ab).toBeDefined();
      expect(CAMPAIGN_TYPE_LABELS.toggle).toBeDefined();
      expect(CAMPAIGN_TYPE_LABELS.feature).toBeDefined();
    });

    it("should have correct labels", () => {
      expect(CAMPAIGN_TYPE_LABELS.ab).toBe("A/B Test");
      expect(CAMPAIGN_TYPE_LABELS.toggle).toBe("Feature Toggle");
      expect(CAMPAIGN_TYPE_LABELS.feature).toBe("Feature Flag");
    });

    it("should have string values", () => {
      expect(typeof CAMPAIGN_TYPE_LABELS.ab).toBe("string");
      expect(typeof CAMPAIGN_TYPE_LABELS.toggle).toBe("string");
      expect(typeof CAMPAIGN_TYPE_LABELS.feature).toBe("string");
    });

    it("should have non-empty labels", () => {
      expect(CAMPAIGN_TYPE_LABELS.ab.length).toBeGreaterThan(0);
      expect(CAMPAIGN_TYPE_LABELS.toggle.length).toBeGreaterThan(0);
      expect(CAMPAIGN_TYPE_LABELS.feature.length).toBeGreaterThan(0);
    });
  });

  describe("BUCKETING_API_URL", () => {
    it("should be defined", () => {
      expect(BUCKETING_API_URL).toBeDefined();
      expect(typeof BUCKETING_API_URL).toBe("string");
    });

    it("should have correct URL pattern", () => {
      expect(BUCKETING_API_URL).toContain("https://");
      expect(BUCKETING_API_URL).toContain("flagship.io");
      expect(BUCKETING_API_URL).toContain("/bucketing.json");
    });

    it("should have environment ID placeholder", () => {
      expect(BUCKETING_API_URL).toContain("{{envId}}");
    });

    it("should be a valid URL template", () => {
      const testEnvId = "test-env-123";
      const url = BUCKETING_API_URL.replace("{{envId}}", testEnvId);
      expect(() => new URL(url)).not.toThrow();
      expect(url).toContain(testEnvId);
    });
  });
});
