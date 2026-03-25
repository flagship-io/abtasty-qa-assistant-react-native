import { HttpError } from '../../src/api/HttpError';

describe('HttpError', () => {
  describe('constructor', () => {
    it('should create error with status code and message', () => {
      const error = new HttpError(404, 'Not Found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.headers).toBeUndefined();
    });

    it('should create error with headers', () => {
      const headers = {
        'Content-Type': 'application/json',
        'X-Request-Id': '12345',
      };
      const error = new HttpError(500, 'Internal Server Error', headers);

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
      expect(error.headers).toEqual(headers);
    });

    it('should handle 200 OK status', () => {
      const error = new HttpError(200, 'OK');

      expect(error.statusCode).toBe(200);
      expect(error.message).toBe('OK');
    });

    it('should handle 401 Unauthorized', () => {
      const error = new HttpError(401, 'Unauthorized');

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Unauthorized');
    });

    it('should handle 403 Forbidden', () => {
      const error = new HttpError(403, 'Forbidden');

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Forbidden');
    });

    it('should handle 500 Internal Server Error', () => {
      const error = new HttpError(500, 'Internal Server Error');

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe('Internal Server Error');
    });

    it('should be throwable', () => {
      expect(() => {
        throw new HttpError(400, 'Bad Request');
      }).toThrow(HttpError);

      expect(() => {
        throw new HttpError(400, 'Bad Request');
      }).toThrow('Bad Request');
    });

    it('should preserve stack trace', () => {
      const error = new HttpError(500, 'Server Error');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });

    it('should handle empty message', () => {
      const error = new HttpError(500, '');

      expect(error.message).toBe('');
      expect(error.statusCode).toBe(500);
    });

    it('should handle empty headers object', () => {
      const error = new HttpError(404, 'Not Found', {});

      expect(error.headers).toEqual({});
    });
  });

  describe('error handling', () => {
    it('should be catchable', () => {
      try {
        throw new HttpError(404, 'Resource not found');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        if (error instanceof HttpError) {
          expect(error.statusCode).toBe(404);
          expect(error.message).toBe('Resource not found');
        }
      }
    });

    it('should support instanceof checks', () => {
      const error = new HttpError(403, 'Access denied');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof HttpError).toBe(true);
    });
  });
});
