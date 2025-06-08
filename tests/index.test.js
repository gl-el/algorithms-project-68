// @ts-check

import { expect, describe, test } from 'vitest';
import serve from '../index';

describe('serve', () => {
  test('should match static route', () => {
    const routes = [
      {
        path: '/courses',
        handler: { body: 'courses' },
      },
    ];

    const result = serve(routes, '/courses');
    expect(result.handler.body).toBe('courses');
    expect(result.params).toEqual({});
  });

  test('should match dynamic route', () => {
    const routes = [
      {
        path: '/courses/:id',
        handler: {
          body: 'course'
        },
      },
      {
        path: '/courses/:course_id/exercises/:id',
        handler: {
          body: 'exercise'
        },
      }
    ];

    const result = serve(routes,  '/courses/php_trees');
    expect(result.handler.body).toBe('course');
    expect(result).toEqual({ path: '/courses/php_trees', handler: { body: 'course'}, params: { id: 'php_trees' } })
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
