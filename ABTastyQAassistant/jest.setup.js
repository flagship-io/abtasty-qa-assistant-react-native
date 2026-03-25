
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};


jest.mock('react-native', () => {
  const React = require('react');
  
  const createMockComponent = (name) => {
    return ({ children, testID, ...props }) => {
      return React.createElement(name, { testID, ...props }, children);
    };
  };

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
    },
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((style) => {
        if (!style) return {};
        if (Array.isArray(style)) {
          return style.reduce((acc, s) => {
            const flattened = typeof s === 'object' ? s : {};
            return { ...acc, ...flattened };
          }, {});
        }
        if (typeof style === 'object') return style;
        return {};
      }),
    },
    View: createMockComponent('View'),
    Text: createMockComponent('Text'),
    TouchableOpacity: createMockComponent('TouchableOpacity'),
    ScrollView: createMockComponent('ScrollView'),
    TextInput: createMockComponent('TextInput'),
    Modal: createMockComponent('Modal'),
    Pressable: createMockComponent('Pressable'),
    FlatList: createMockComponent('FlatList'),
    SectionList: createMockComponent('SectionList'),
    Image: createMockComponent('Image'),
    ActivityIndicator: createMockComponent('ActivityIndicator'),
    Switch: createMockComponent('Switch'),
    Animated: {
      View: createMockComponent('AnimatedView'),
      Text: createMockComponent('AnimatedText'),
      Image: createMockComponent('AnimatedImage'),
      timing: jest.fn(() => ({ start: jest.fn() })),
      spring: jest.fn(() => ({ start: jest.fn() })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(),
        _value: 0,
      })),
      ValueXY: jest.fn(() => ({
        x: { _value: 0 },
        y: { _value: 0 },
        setValue: jest.fn(),
        setOffset: jest.fn(),
        flattenOffset: jest.fn(),
      })),
      event: jest.fn((args, config) => jest.fn()),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    PanResponder: {
      create: jest.fn((config) => ({
        panHandlers: {
          onStartShouldSetResponder: () => true,
          onMoveShouldSetResponder: () => true,
          onResponderGrant: jest.fn(),
          onResponderMove: jest.fn(),
          onResponderRelease: jest.fn(),
        },
      })),
    },
    useWindowDimensions: jest.fn(() => ({ width: 375, height: 812 })),
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Path: 'Path',
  G: 'G',
  Circle: 'Circle',
  Rect: 'Rect',
  Line: 'Line',
  Polygon: 'Polygon',
  Polyline: 'Polyline',
  Ellipse: 'Ellipse',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
}));



jest.mock('@flagship.io/react-native-sdk', () => ({
  TargetingOperator: {
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS',
    CONTAINS: 'CONTAINS',
    NOT_CONTAINS: 'NOT_CONTAINS',
    EXISTS: 'EXISTS',
    NOT_EXISTS: 'NOT_EXISTS',
    GREATER_THAN: 'GREATER_THAN',
    LOWER_THAN: 'LOWER_THAN',
    GREATER_THAN_OR_EQUALS: 'GREATER_THAN_OR_EQUALS',
    LOWER_THAN_OR_EQUALS: 'LOWER_THAN_OR_EQUALS',
    STARTS_WITH: 'STARTS_WITH',
    ENDS_WITH: 'ENDS_WITH',
  },
  QAEventQaAssistantName: {
    QA_READY: 'QA_READY',
    QA_APPLY_FORCED_ALLOCATION: 'QA_APPLY_FORCED_ALLOCATION',
    QA_APPLY_FORCED_UNALLOCATION: 'QA_APPLY_FORCED_UNALLOCATION',
  },
  QAEventSdkName: {
    SDK_ALLOCATED_VARIATIONS: 'SDK_ALLOCATED_VARIATIONS',
    SDK_HIT_SENT: 'SDK_HIT_SENT',
  },
  FlagshipProvider: function (props) { return props.children; },
  useFlagship: function () {
    return {
      visitor: null,
      start: jest.fn(),
    };
  },
}));