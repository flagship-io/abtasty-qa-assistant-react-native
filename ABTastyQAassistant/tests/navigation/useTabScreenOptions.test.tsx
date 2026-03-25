import { useTabScreenOptions } from '../../src/navigation/useTabScreenOptions';
import { COLORS } from '../../src/constants';

describe('useTabScreenOptions', () => {
  it('should return default options with all style configurations', () => {
    const options = useTabScreenOptions();

    // Snapshot for overall structure
    expect(options).toMatchSnapshot();

    // Tab bar base styles
    expect(options.tabBarStyle).toEqual({
      backgroundColor: COLORS.modalBackground,
    });
    expect(options.tabBarScrollEnabled).toBe(true);
    expect(options.tabBarGap).toBe(8);
    
    // Tint colors
    expect(options.tabBarActiveTintColor).toBe(COLORS.secondary);
    expect(options.tabBarInactiveTintColor).toBe(COLORS.textPrimary);
    
    // Indicator style
    expect(options.tabBarIndicatorStyle).toEqual({
      backgroundColor: COLORS.secondary,
      height: 4,
    });
    
    // Label style
    expect(options.tabBarLabelStyle).toEqual({
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'none',
    });
    
    // Item style
    expect(options.tabBarItemStyle).toEqual({
      width: 'auto',
    });
  });

  it('should merge and override custom options correctly', () => {
    const customOptions = {
      tabBarStyle: {
        backgroundColor: '#custom',
      },
      tabBarActiveTintColor: '#FF0000',
      tabBarGap: 16,
    };

    const options = useTabScreenOptions(customOptions);

    // Custom options should override defaults
    expect(options.tabBarStyle).toEqual({
      backgroundColor: '#custom',
    });
    expect(options.tabBarActiveTintColor).toBe('#FF0000');
    expect(options.tabBarGap).toBe(16);
    
    // Non-overridden defaults should remain
    expect(options.tabBarInactiveTintColor).toBe(COLORS.textPrimary);
    expect(options.tabBarScrollEnabled).toBe(true);
  });

  it('should handle undefined and empty custom options', () => {
    const optionsUndefined = useTabScreenOptions(undefined);
    const optionsEmpty = useTabScreenOptions({});

    // Both should return all defaults
    [optionsUndefined, optionsEmpty].forEach(options => {
      expect(options.tabBarStyle).toEqual({
        backgroundColor: COLORS.modalBackground,
      });
      expect(options.tabBarScrollEnabled).toBe(true);
      expect(options.tabBarGap).toBe(8);
    });
  });
});
