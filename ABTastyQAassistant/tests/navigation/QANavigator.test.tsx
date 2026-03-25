import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigationBuilder: jest.fn(() => ({
    state: {
      index: 0,
      routes: [
        { key: 'ScreenA-key', name: 'ScreenA' },
        { key: 'ScreenB-key', name: 'ScreenB' },
      ],
    },
    descriptors: {
      'ScreenA-key': {
        render: () => <Text>Screen A</Text>,
        options: {},
      },
      'ScreenB-key': {
        render: () => <Text>Screen B</Text>,
        options: {},
      },
    },
    NavigationContent: ({ children }: any) => <View>{children}</View>,
  })),
  createNavigatorFactory: jest.fn((Component) => () => ({
    Navigator: Component,
    Screen: () => null,
  })),
  StackRouter: jest.fn(),
}));

import { createQANavigator } from '../../src/navigation/QANavigator';

const ScreenA = () => <Text>Screen A</Text>;
const ScreenB = () => <Text>Screen B</Text>;

const QANav = createQANavigator();

describe('QANavigator', () => {
  it('should render navigator with default state and styles', () => {
    const { toJSON, getByText } = render(
      <QANav.Navigator>
        <QANav.Screen name="ScreenA" component={ScreenA} />
        <QANav.Screen name="ScreenB" component={ScreenB} />
      </QANav.Navigator>
    );

    expect(getByText('Screen A')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render static and function-based header titles', () => {
    const { useNavigationBuilder } = require('@react-navigation/native');
    
    useNavigationBuilder.mockReturnValueOnce({
      state: { index: 0, routes: [{ key: 'ScreenA-key', name: 'ScreenA' }] },
      descriptors: {
        'ScreenA-key': {
          render: () => <Text>Screen A</Text>,
          options: { headerTitle: <Text>Custom Header</Text> },
        },
      },
      NavigationContent: ({ children }: any) => <View>{children}</View>,
    });

    const { getByText } = render(
      <QANav.Navigator>
        <QANav.Screen name="ScreenA" component={ScreenA} />
      </QANav.Navigator>
    );
    expect(getByText('Custom Header')).toBeTruthy();

    const HeaderTitle = ({ canGoBack }: { canGoBack: boolean }) => (
      <Text>{canGoBack ? 'Can Go Back' : 'Cannot Go Back'}</Text>
    );
    
    useNavigationBuilder.mockReturnValueOnce({
      state: { index: 0, routes: [{ key: 'ScreenA-key', name: 'ScreenA' }] },
      descriptors: {
        'ScreenA-key': {
          render: () => <Text>Screen A</Text>,
          options: { headerTitle: HeaderTitle },
        },
      },
      NavigationContent: ({ children }: any) => <View>{children}</View>,
    });

    const { toJSON, getByText: getByText2 } = render(
      <QANav.Navigator>
        <QANav.Screen name="ScreenA" component={ScreenA} />
      </QANav.Navigator>
    );
    expect(getByText2('Cannot Go Back')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle screen visibility and canGoBack correctly', () => {
    const { useNavigationBuilder } = require('@react-navigation/native');
    const HeaderTitle = ({ canGoBack }: { canGoBack: boolean }) => (
      <Text>{canGoBack ? 'Can Go Back' : 'Cannot Go Back'}</Text>
    );
    
    useNavigationBuilder.mockReturnValueOnce({
      state: { index: 1, routes: [{ key: 'ScreenA-key', name: 'ScreenA' }, { key: 'ScreenB-key', name: 'ScreenB' }] },
      descriptors: {
        'ScreenA-key': { render: () => <Text>Screen A</Text>, options: {} },
        'ScreenB-key': { render: () => <Text>Screen B</Text>, options: { headerTitle: HeaderTitle } },
      },
      NavigationContent: ({ children }: any) => <View>{children}</View>,
    });

    const { toJSON, getByText } = render(
      <QANav.Navigator>
        <QANav.Screen name="ScreenA" component={ScreenA} />
        <QANav.Screen name="ScreenB" component={ScreenB} />
      </QANav.Navigator>
    );
    
    expect(getByText('Can Go Back')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
