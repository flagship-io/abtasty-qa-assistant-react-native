import React from 'react';
import { render } from '@testing-library/react-native';
import { AllocationItem } from '../../../src/components/allocation/AllocationItem';

describe('AllocationItem Component', () => {
  it('should render with different allocation values', () => {
    // Standard allocation
    const standard = render(
      <AllocationItem variationName="Variation A" allocation={50} />
    );
    expect(standard.getByText('Variation A:')).toBeTruthy();
    expect(standard.getByText('50%')).toBeTruthy();
    expect(standard.toJSON()).toMatchSnapshot();
    
    // Zero allocation
    const zero = render(<AllocationItem variationName="Variation B" allocation={0} />);
    expect(zero.getByText('0%')).toBeTruthy();
    expect(zero.toJSON()).toMatchSnapshot();
    
    // 100% allocation
    const full = render(<AllocationItem variationName="Control" allocation={100} />);
    expect(full.getByText('100%')).toBeTruthy();
    expect(full.toJSON()).toMatchSnapshot();
    
    // Undefined allocation defaults to 0
    const undef = render(<AllocationItem variationName="No Allocation" />);
    expect(undef.getByText('0%')).toBeTruthy();
    expect(undef.toJSON()).toMatchSnapshot();
    
    // Decimal allocation
    const decimal = render(<AllocationItem variationName="Decimal" allocation={33.33} />);
    expect(decimal.getByText('33.33%')).toBeTruthy();
    expect(decimal.toJSON()).toMatchSnapshot();
  });

  it('should handle undefined variation name', () => {
    const { getByText, toJSON } = render(<AllocationItem allocation={25} />);
    expect(getByText('25%')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
