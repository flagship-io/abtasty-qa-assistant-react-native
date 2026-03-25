import { format, validateVariationType } from '../../src/utils/index';
import { VisitorVariations } from '@flagship.io/react-native-sdk';

describe('utils/index', () => {
  describe('format', () => {
    it('should replace placeholders with provided values', () => {
      const template = 'Hello {{name}}, you have {{count}} messages';
      const data = { name: 'John', count: 5 };
      
      const result = format(template, data);
      
      expect(result).toBe('Hello John, you have 5 messages');
    });

    it('should handle single placeholder', () => {
      const template = 'Welcome {{username}}';
      const data = { username: 'Alice' };
      
      const result = format(template, data);
      
      expect(result).toBe('Welcome Alice');
    });

    it('should handle numeric values', () => {
      const template = 'Price: ${{price}}';
      const data = { price: 29.99 };
      
      const result = format(template, data);
      
      expect(result).toBe('Price: $29.99');
    });

    it('should handle multiple occurrences of the same placeholder', () => {
      const template = '{{name}} said: "Hi {{name}}!"';
      const data = { name: 'Bob' };
      
      const result = format(template, data);
      
      expect(result).toBe('Bob said: "Hi Bob!"');
    });

    it('should handle empty template', () => {
      const template = '';
      const data = {};
      
      const result = format(template, data);
      
      expect(result).toBe('');
    });
  });

  describe('validateVariationType', () => {
    const validVariation: VisitorVariations = {
      variationId: 'var-123',
      variationGroupId: 'group-456',
      campaignId: 'campaign-789',
    };

    it('should return true for valid variations data', () => {
      const data = {
        'campaign1': validVariation,
        'campaign2': {
          variationId: 'var-456',
          variationGroupId: 'group-789',
          campaignId: 'campaign-012',
        },
      };

      expect(validateVariationType(data)).toBe(true);
    });

    it('should return true for empty object', () => {
      expect(validateVariationType({})).toBe(true);
    });

    it('should return false for null', () => {
      expect(validateVariationType(null as any)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(validateVariationType('string' as any)).toBe(false);
      expect(validateVariationType(123 as any)).toBe(false);
      expect(validateVariationType([] as any)).toBe(false);
    });

    it('should return false when variationId is missing', () => {
      const data = {
        'campaign1': {
          variationGroupId: 'group-456',
          campaignId: 'campaign-789',
        },
      };

      expect(validateVariationType(data as any)).toBe(false);
    });
  });
});