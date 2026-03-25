import React from 'react';
import { render } from '@testing-library/react-native';
import { ContextPage } from '../../src/screens/ContextScreen';

// Mock hooks
jest.mock('../../src/hooks', () => ({
  useAppContext: jest.fn(() => ({
    appDataState: {
      visitorData: {
        userId: 'test-user-123',
        anonymousId: 'anon-456',
        context: {
          device_type: 'mobile',
          os_name: 'iOS',
        },
      },
    },
  })),
}));

// Mock utils
jest.mock('../../src/utils', () => ({
  formatEventContent: jest.fn((data) => JSON.stringify(data, null, 2)),
}));

describe('ContextScreen', () => {
  it('should render formatted visitor data', () => {
    const { toJSON, getByText } = render(<ContextPage />);
    
    // Should render formatted JSON content
    expect(getByText(/"userId":/)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle empty visitor data', () => {
    const { useAppContext } = require('../../src/hooks');
    
    // Mock with empty visitor data
    useAppContext.mockReturnValueOnce({
      appDataState: {
        visitorData: null,
      },
    });

    const { toJSON } = render(<ContextPage />);
    
    expect(toJSON()).toMatchSnapshot();
  });

});
