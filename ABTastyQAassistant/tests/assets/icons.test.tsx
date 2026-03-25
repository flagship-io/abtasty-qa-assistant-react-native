import React from 'react';
import renderer from 'react-test-renderer';
import { ArrowLeftIcon } from '../../src/assets/icons/ArrowLeftIcon';
import { CheckIcon } from '../../src/assets/icons/CheckIcon';
import { ChevronRightIcon } from '../../src/assets/icons/ChevronRightIcon';
import { DeleteIcon } from '../../src/assets/icons/DeleteIcon';
import { EyeHideIcon } from '../../src/assets/icons/EyeHideIcon';
import { EyeShowIcon } from '../../src/assets/icons/EyeShowIcon';
import { ResetIcon } from '../../src/assets/icons/ResetIcon';
import { SearchIcon } from '../../src/assets/icons/SearchIcon';
import { WarningIcon } from '../../src/assets/icons/WarningIcon';

const icons = [
  { name: 'ArrowLeftIcon', Component: ArrowLeftIcon },
  { name: 'CheckIcon', Component: CheckIcon },
  { name: 'ChevronRightIcon', Component: ChevronRightIcon },
  { name: 'DeleteIcon', Component: DeleteIcon },
  { name: 'EyeHideIcon', Component: EyeHideIcon },
  { name: 'EyeShowIcon', Component: EyeShowIcon },
  { name: 'ResetIcon', Component: ResetIcon },
  { name: 'SearchIcon', Component: SearchIcon },
  { name: 'WarningIcon', Component: WarningIcon },
];

describe('Icon Components', () => {
  icons.forEach(({ name, Component }) => {
    it(`${name} should render with default props`, () => {
      expect(() => renderer.create(<Component />)).not.toThrow();
    });

    it(`${name} should render with custom props`, () => {
      expect(() => renderer.create(
        <Component width={24} height={24} color="#FF0000" />
      )).not.toThrow();
    });
  });
});
