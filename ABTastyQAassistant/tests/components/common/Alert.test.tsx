import React from 'react';
import { render } from '@testing-library/react-native';
import { Alert } from '../../../src/components/common/Alert';

// Mock the WarningIcon
jest.mock('../../../src/assets/icons/WarningIcon', () => ({
  WarningIcon: () => 'WarningIcon',
}));

describe('Alert Component', () => {
  it('should render with different alert types', () => {
    // Default warning type
    const { toJSON: warningJSON } = render(<Alert message="Warning" />);
    expect(warningJSON()).toMatchSnapshot();

    // Error type
    const { toJSON: errorJSON } = render(<Alert message="Error message" type="error" />);
    const errorTree = errorJSON();
    expect(errorTree).toMatchSnapshot();
    expect(JSON.stringify(errorTree)).toContain('Error message');

    // Info type
    const { toJSON: infoJSON } = render(<Alert message="Info message" type="info" />);
    expect(infoJSON()).toMatchSnapshot();

    // Success type
    const { toJSON: successJSON } = render(<Alert message="Success message" type="success" />);
    expect(successJSON()).toMatchSnapshot();
  });

  it('should render with custom icon configurations', () => {
    const CustomIcon = () => 'CustomIcon';
    
    // Custom icon - verify custom icon is used
    const { toJSON: customIconJSON } = render(
      <Alert message="Custom icon" icon={<CustomIcon />} />
    );
    expect(customIconJSON()).toMatchSnapshot();

    // Null icon - verify no icon rendered
    const { toJSON: nullIconJSON } = render(<Alert message="No icon" icon={null} />);
    expect(nullIconJSON()).toMatchSnapshot();

    // Custom icon size - verify component renders with iconSize prop
    const { toJSON: iconSizeJSON } = render(
      <Alert message="Large icon" iconSize={24} />
    );
    expect(iconSizeJSON()).toMatchSnapshot();
  });

  it('should apply custom styles', () => {
    const customStyle = { marginTop: 20 };
    const customTextStyle = { fontSize: 18 };
    
    const { toJSON } = render(
      <Alert 
        message="Styled alert"
        style={customStyle}
        textStyle={customTextStyle}
      />
    );
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
    expect(JSON.stringify(tree)).toContain('20');
    expect(JSON.stringify(tree)).toContain('18');
  });

  it('should have displayName set to Alert', () => {
    expect(Alert.displayName).toBe('Alert');
  });
});
