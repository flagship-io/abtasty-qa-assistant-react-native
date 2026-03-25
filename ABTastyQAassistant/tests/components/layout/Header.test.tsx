import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../../../src/components/layout/Header';
import { useNavigation } from '@react-navigation/native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock icons
jest.mock('../../../src/assets/icons', () => ({
  QAAIcon: () => 'QAAIcon',
  CloseIcon: () => 'CloseIcon',
  ArrowLeftIcon: () => 'ArrowLeftIcon',
}));

describe('Header', () => {
  let mockNavigation: any;
  let mockOnClose: jest.Mock;

  beforeEach(() => {
    mockNavigation = {
      goBack: jest.fn(),
    };
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    mockOnClose = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render header with title and close button', () => {
    const { getByText } = render(<Header onClose={mockOnClose} />);

    expect(getByText('QA Assistant')).toBeTruthy();
  });

  it('should call onClose when close button is pressed', () => {
    const { UNSAFE_getAllByType } = render(<Header onClose={mockOnClose} />);
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    
    // Close button should be the last touchable
    const closeButton = touchables[touchables.length - 1];
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not render back button when canGoBack is false', () => {
    const { UNSAFE_getAllByType } = render(
      <Header onClose={mockOnClose} canGoBack={false} />
    );
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);

    // Only close button should be present
    expect(touchables).toHaveLength(1);
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });



  it('should render back button when canGoBack is true', () => {
    const { UNSAFE_getAllByType } = render(
      <Header onClose={mockOnClose} canGoBack={true} />
    );
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);

    // Both back and close buttons should be present
    expect(touchables).toHaveLength(2);
  });

  it('should call navigation.goBack when back button is pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <Header onClose={mockOnClose} canGoBack={true} />
    );
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);

    // Back button should be the first touchable
    const backButton = touchables[0];
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle multiple close button presses', () => {
    const { UNSAFE_getAllByType } = render(<Header onClose={mockOnClose} />);
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const closeButton = touchables[0];

    fireEvent.press(closeButton);
    fireEvent.press(closeButton);
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(3);
  });

  it('should handle multiple back button presses', () => {
    const { UNSAFE_getAllByType } = render(
      <Header onClose={mockOnClose} canGoBack={true} />
    );
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const backButton = touchables[0];

    fireEvent.press(backButton);
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalledTimes(2);
  });
});
