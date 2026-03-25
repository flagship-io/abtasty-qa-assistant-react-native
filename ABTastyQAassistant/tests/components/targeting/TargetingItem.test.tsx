import React from 'react';
import { render } from '@testing-library/react-native';
import { TargetingItem } from '../../../src/components/targeting/TargetingItem';
import { TargetingOperator } from '../../../src/types.local';

describe('TargetingItem', () => {
  it('should render "All Users" for fs_all_users targeting', () => {
    const targeting = {
      key: 'fs_all_users',
      operator: TargetingOperator.EQUALS,
      value: true,
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} />
    );

    expect(getByText('All Users')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render key, operator, and value for regular targeting', () => {
    const targeting = {
      key: 'country',
      operator: TargetingOperator.EQUALS,
      value: 'US',
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} />
    );

    expect(getByText('country')).toBeTruthy();
    expect(getByText('EQUALS')).toBeTruthy();
    expect(getByText('US')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render array values with individual items', () => {
    const targeting = {
      key: 'countries',
      operator: TargetingOperator.CONTAINS,
      value: ['US', 'FR', 'UK'],
      matchedValue: new Set(['US']),
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} />
    );

    expect(getByText('countries')).toBeTruthy();
    expect(getByText('CONTAINS')).toBeTruthy();
    expect(getByText('US')).toBeTruthy();
    expect(getByText('FR')).toBeTruthy();
    expect(getByText('UK')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should highlight matched values with success color', () => {
    const targeting = {
      key: 'device',
      operator: TargetingOperator.EQUALS,
      value: 'mobile',
      matchedValue: new Set(['mobile']),
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} />
    );

    const valueElement = getByText('mobile');
    expect(valueElement).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render object values as JSON string', () => {
    const targeting = {
      key: 'metadata',
      operator: TargetingOperator.EQUALS,
      value: { platform: 'iOS', version: '14' },
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} />
    );

    expect(getByText('metadata')).toBeTruthy();
    expect(getByText('{"platform":"iOS","version":"14"}')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show "AND" separator when not last item', () => {
    const targeting = {
      key: 'age',
      operator: TargetingOperator.GREATER_THAN,
      value: 18,
    };

    const { toJSON, getByText } = render(
      <TargetingItem targetings={targeting} isLast={false} />
    );

    expect(getByText('AND')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not show "AND" separator when last item', () => {
    const targeting = {
      key: 'age',
      operator: TargetingOperator.GREATER_THAN,
      value: 18,
    };

    const { toJSON, queryByText } = render(
      <TargetingItem targetings={targeting} isLast={true} />
    );

    expect(queryByText('AND')).toBeNull();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle different operator types', () => {
    const operators = [
      TargetingOperator.EQUALS,
      TargetingOperator.NOT_EQUALS,
      TargetingOperator.CONTAINS,
      TargetingOperator.NOT_CONTAINS,
      TargetingOperator.GREATER_THAN,
      TargetingOperator.LOWER_THAN
    ];
    
    operators.forEach(operator => {
      const targeting = {
        key: 'test',
        operator,
        value: 'value',
      };

      const { getByText } = render(
        <TargetingItem targetings={targeting} />
      );

      expect(getByText(operator)).toBeTruthy();
    });
  });
});
