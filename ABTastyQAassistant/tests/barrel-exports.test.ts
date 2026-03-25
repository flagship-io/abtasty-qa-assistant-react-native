/**
 * Tests barrel index.ts files to ensure exports are properly wired up.
 * This covers the 0% function coverage on re-export files.
 */

// Mock navigation dependencies used by some components
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  useRoute: jest.fn(() => ({ params: {} })),
  NavigationContainer: ({ children }: any) => children,
  NavigationIndependentTree: ({ children }: any) => children,
  createNavigatorFactory: jest.fn(() => jest.fn(() => ({
    Navigator: ({ children }: any) => children,
    Screen: () => null,
  }))),
  useNavigationBuilder: jest.fn(),
  StackRouter: jest.fn(),
}));

jest.mock('@react-navigation/material-top-tabs', () => ({
  createMaterialTopTabNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: () => null,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('barrel exports', () => {
  it('should export from src/index', () => {
    const exports = require('../src/index');
    expect(exports.QAAssistant).toBeDefined();
    expect(exports.COLORS).toBeDefined();
    expect(exports.CAMPAIGN_TYPE_LABELS).toBeDefined();
    expect(exports.DEFAULT_CONFIG).toBeDefined();
  });

  it('should export from src/components/campaign', () => {
    const exports = require('../src/components/campaign');
    expect(exports.CampaignItem).toBeDefined();
    expect(exports.CampaignMetaDataRow).toBeDefined();
    expect(exports.CollapsibleCampaigns).toBeDefined();
  });

  it('should export from src/components/common', () => {
    const exports = require('../src/components/common');
    expect(exports.Alert).toBeDefined();
    expect(exports.Badge).toBeDefined();
    expect(exports.Button).toBeDefined();
    expect(exports.FlagValue).toBeDefined();
    expect(exports.SearchBar).toBeDefined();
  });

  it('should export from src/components/layout', () => {
    const exports = require('../src/components/layout');
    expect(exports.Header).toBeDefined();
    expect(exports.FloatingButton).toBeDefined();
    expect(exports.SummaryBar).toBeDefined();
  });

  it('should export from src/components/targeting', () => {
    const exports = require('../src/components/targeting');
    expect(exports.TargetingItem).toBeDefined();
    expect(exports.TargetingGroupItem).toBeDefined();
    expect(exports.TargetingVariationGr).toBeDefined();
  });

  it('should export from src/components/variation', () => {
    const exports = require('../src/components/variation');
    expect(exports.CurrentVariation).toBeDefined();
    expect(exports.CollapsibleVariation).toBeDefined();
    expect(exports.VariationAction).toBeDefined();
  });

  it('should export from src/hooks', () => {
    const exports = require('../src/hooks');
    expect(exports.useAppContext).toBeDefined();
    expect(exports.useSwipeToDismiss).toBeDefined();
    expect(exports.useCampaign).toBeDefined();
    expect(exports.useCampaignVariationStates).toBeDefined();
    expect(exports.useCanShowVariationAction).toBeDefined();
    expect(exports.useAllocatedVariations).toBeDefined();
    expect(exports.useForcedVariations).toBeDefined();
    expect(exports.useForcedAllocations).toBeDefined();
    expect(exports.useForcedUnallocations).toBeDefined();
    expect(exports.useCampaignVariations).toBeDefined();
    expect(exports.useVariation).toBeDefined();
    expect(exports.useActiveVariationId).toBeDefined();
    expect(exports.useForcedVariationActions).toBeDefined();
    expect(exports.useCampaignAllocation).toBeDefined();
    expect(exports.useCampaignUnallocation).toBeDefined();
  });

  it('should export from src/contexts/appContext', () => {
    const exports = require('../src/contexts/appContext');
    expect(exports.AppContext).toBeDefined();
  });

  it('should export from src/contexts/hitsContext', () => {
    const exports = require('../src/contexts/hitsContext');
    expect(exports.HitsContext).toBeDefined();
  });
});
