import React from 'react';
import { render } from '@testing-library/react-native';
import { EventList } from '../../../src/components/events/EventList';

// Mock CollapseEvent
jest.mock('../../../src/components/events/EventCollapse', () => ({
  CollapseEvent: ({ hit }: { hit: Record<string, unknown> }) => 
    `CollapseEvent: ${hit.t || 'ACTIVATE'}`,
}));

describe('EventList Component', () => {
  const FIXED_TIMESTAMP = 1609459200000; 
  
  it('should render with empty hits array', () => {
    const { toJSON } = render(<EventList hits={[]} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with single hit', () => {
    const hits = [{ t: 'PAGE_VIEW', timestamp: FIXED_TIMESTAMP }];
    const { toJSON } = render(<EventList hits={hits} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with multiple hits', () => {
    const hits = [
      { t: 'PAGE_VIEW', timestamp: FIXED_TIMESTAMP },
      { t: 'CLICK', timestamp: FIXED_TIMESTAMP - 1000 },
      { t: 'CONVERSION', timestamp: FIXED_TIMESTAMP - 2000 },
    ];
    const { toJSON } = render(<EventList hits={hits} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render hits in order', () => {
    const hits = [
      { t: 'FIRST', timestamp: 1 },
      { t: 'SECOND', timestamp: 2 },
    ];
    const { toJSON } = render(<EventList hits={hits} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle hits with complex data', () => {
    const hits = [
      { 
        t: 'CONVERSION', 
        timestamp: FIXED_TIMESTAMP,
        value: 100,
        data: { nested: { deep: 'value' } },
        array: [1, 2, 3],
      },
    ];
    const { toJSON } = render(<EventList hits={hits} />);
    expect(toJSON()).toMatchSnapshot();
  });

  // ─────────────────────────────────────────────────────────────
  // Exercise renderItem and keyExtractor directly so Istanbul
  // covers lines 14-15 (the FlatList mock does not invoke them).
  // ─────────────────────────────────────────────────────────────
  it('renderItem returns a CollapseEvent element for a hit', () => {
    const { FlatList } = require('react-native');
    const hit = { t: 'PAGE_VIEW', timestamp: FIXED_TIMESTAMP };
    const { UNSAFE_getByType } = render(<EventList hits={[hit]} />);

    const flatListNode = UNSAFE_getByType(FlatList);
    const element = flatListNode.props.renderItem({ item: hit });

    expect(element).toBeTruthy();
  });

  it('keyExtractor returns a string index', () => {
    const { FlatList } = require('react-native');
    const hit = { t: 'PAGE_VIEW', timestamp: FIXED_TIMESTAMP };
    const { UNSAFE_getByType } = render(<EventList hits={[hit]} />);

    const flatListNode = UNSAFE_getByType(FlatList);
    const key = flatListNode.props.keyExtractor(hit, 0);

    expect(key).toBe('0');
  });
});
