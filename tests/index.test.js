// @ts-check

import { expect, describe, test } from 'vitest';
import serve from '../index';

describe('serve', () => {
  test('should return correct handler', () => {
    const routes = [
      {
        path: '/courses',
        handler: { body: 'courses' },
      },
      {
        path: '/courses/basics',
        handler: { body: 'basics' },
      },
    ];

    const handler = serve(routes, '/courses');
    expect(handler.body).toBe('courses');
  });

  test('should throw error for unknown route', () => {
    const routes = [
      {
        path: '/courses',
        handler: { body: 'courses' },
      },
    ];

    expect(() => serve(routes, '/unknown')).toThrow('Route not found: /unknown');
  });
});
