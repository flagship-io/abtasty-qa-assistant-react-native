import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../src/components/common/Button';

describe('Button Component', () => {
  it('should render with label', () => {
    const { toJSON } = render(<Button label="Click Me" />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render with icons and custom properties', () => {
    const LeftIcon = () => 'LeftIcon';
    const RightIcon = () => 'RightIcon';
    const onPressMock = jest.fn();
    
    // With onPress handler - verify handler is attached
    const { toJSON: withPressJSON } = render(<Button label="Press Me" onPress={onPressMock} />);
    expect(withPressJSON()).toMatchSnapshot();
    
    // With left icon - verify icon is rendered
    const { toJSON: leftIconJSON, getByText: getLeftText } = render(
      <Button label="With Left Icon" leftIcon={<LeftIcon />} />
    );
    expect(getLeftText('With Left Icon')).toBeTruthy();
    expect(leftIconJSON()).toMatchSnapshot();
    
    // With right icon - verify icon is rendered
    const { toJSON: rightIconJSON } = render(
      <Button label="With Right Icon" rightIcon={<RightIcon />} />
    );
    expect(rightIconJSON()).toMatchSnapshot();
    
    // With both icons - verify both icons rendered
    const { toJSON: bothIconsJSON } = render(
      <Button label="With Both Icons" leftIcon={<LeftIcon />} rightIcon={<RightIcon />} />
    );
    expect(bothIconsJSON()).toMatchSnapshot();
  });

  it('should apply custom styling properties', () => {
    // Custom backgroundColor - verify style is in tree
    const { toJSON: bgJSON } = render(<Button label="Colored" backgroundColor="#ff0000" />);
    const bgTree = bgJSON();
    expect(bgTree).toMatchSnapshot();
    expect(JSON.stringify(bgTree)).toContain('#ff0000');
    
    // Custom borderRadius - verify style is in tree
    const { toJSON: radiusJSON } = render(<Button label="Rounded" borderRadius={16} />);
    const radiusTree = radiusJSON();
    expect(radiusTree).toMatchSnapshot();
    expect(JSON.stringify(radiusTree)).toContain('16');
    
    // Custom border - verify styles are in tree
    const { toJSON: borderJSON } = render(<Button label="Bordered" borderColor="#000000" borderWidth={2} />);
    const borderTree = borderJSON();
    expect(borderTree).toMatchSnapshot();
    expect(JSON.stringify(borderTree)).toContain('#000000');
    expect(JSON.stringify(borderTree)).toContain('2');
    
    // Custom textColor - verify text style is in tree
    const { toJSON: textColorJSON } = render(<Button label="Colored Text" textColor="#ffffff" />);
    const textColorTree = textColorJSON();
    expect(textColorTree).toMatchSnapshot();
    expect(JSON.stringify(textColorTree)).toContain('#ffffff');
    
    // Custom style object - verify custom style is merged
    const { toJSON: customStyleJSON } = render(<Button label="Custom Style" style={{ marginTop: 10 }} />);
    const customStyleTree = customStyleJSON();
    expect(customStyleTree).toMatchSnapshot();
    expect(JSON.stringify(customStyleTree)).toContain('10');
  });
});
