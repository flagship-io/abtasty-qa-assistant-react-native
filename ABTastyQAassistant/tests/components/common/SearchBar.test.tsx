import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../../../src/components/common/SearchBar';

// Mock the icons
jest.mock('../../../src/assets/icons', () => ({
  CloseIcon: () => 'CloseIcon',
  SearchIcon: () => 'SearchIcon',
}));

describe('SearchBar Component', () => {
  it('should render with default empty value', () => {
    const { toJSON } = render(<SearchBar />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with initial value', () => {
    const { toJSON, getByDisplayValue } = render(<SearchBar value="initial search" />);
    expect(getByDisplayValue('initial search')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar onChangeText={onChangeTextMock} />
    );
    
    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, 'test search');
    
    expect(onChangeTextMock).toHaveBeenCalledWith('test search');
  });

  it('should update internal state when value prop changes', () => {
    const { rerender, toJSON, getByDisplayValue } = render(<SearchBar value="first" />);
    expect(getByDisplayValue('first')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
    
    rerender(<SearchBar value="second" />);
    expect(getByDisplayValue('second')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle undefined value prop', () => {
    const { toJSON } = render(<SearchBar value={undefined} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should clear text when clear button is pressed', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText, getByTestId } = render(
      <SearchBar value="some text" onChangeText={onChangeTextMock} />
    );
    
    const input = getByPlaceholderText('Search...');
    fireEvent.changeText(input, '');
    
    expect(onChangeTextMock).toHaveBeenCalledWith('');
  });

  it('should render with empty string value', () => {
    const { toJSON, getByPlaceholderText } = render(<SearchBar value="" />);
    expect(getByPlaceholderText('Search...')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  // ─────────────────────────────────────────────────────────────
  // handleClearSearch — close button behaviour
  // ─────────────────────────────────────────────────────────────

  it('pressing the icon when searchQuery has text clears it and calls onChangeText', () => {
    const onChangeText = jest.fn();
    const { UNSAFE_getAllByType } = render(<SearchBar value="hello" onChangeText={onChangeText} />);
    const { TouchableOpacity } = require('react-native');
    const [iconButton] = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(iconButton);
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  it('pressing the icon when searchQuery is empty does nothing (early return)', () => {
    const onChangeText = jest.fn();
    const { UNSAFE_getAllByType } = render(<SearchBar value="" onChangeText={onChangeText} />);
    const { TouchableOpacity } = require('react-native');
    const [iconButton] = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(iconButton);
    expect(onChangeText).not.toHaveBeenCalled();
  });

  it('pressing the clear icon without onChangeText prop does not throw', () => {
    const { UNSAFE_getAllByType } = render(<SearchBar value="text" />);
    const { TouchableOpacity } = require('react-native');
    const [iconButton] = UNSAFE_getAllByType(TouchableOpacity);
    expect(() => fireEvent.press(iconButton)).not.toThrow();
  });

  it('shows SearchIcon child when empty and CloseIcon child when non-empty (snapshot)', () => {
    const { toJSON, rerender } = render(<SearchBar value="" />);
    expect(toJSON()).toMatchSnapshot();

    rerender(<SearchBar value="abc" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
