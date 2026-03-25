import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyList } from '../../../src/components/events/EmptyList';

// Mock the EmptyStateIcon
jest.mock('../../../src/assets/icons/EmptyStateIcon', () => ({
  EmptyStateIcon: () => 'EmptyStateIcon',
}));

describe('EmptyList Component', () => {
  it('should render the component', () => {
    const { toJSON } = render(<EmptyList />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should display primary message', () => {
    const { getByText, toJSON } = render(<EmptyList />);
    expect(getByText('No event has been recorded so far')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should display secondary message', () => {
    const { getByText, toJSON } = render(<EmptyList />);
    expect(getByText('Interact with the page to see events here.')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
