// @ts-check

import {expect, describe, test} from 'vitest';
import serve from '../index';

describe('serve', () => {
  test('should match static route', () => {
    const routes = [
      {
        method: 'GET',
        path: '/courses',
        handler: {
          body: 'courses!'
        },
      },
    ]

    const result = serve(routes, {path: '/courses'});
    expect(result.handler.body).toBe('courses!');
    expect(result.params).toEqual({});
  });

  test('should match dynamic route', () => {
    const routes = [
      {
        method: 'GET',
        path: '/courses/:id',
        handler: {
          body: 'course'
        },
      },
      {
        method: 'GET',
        path: '/courses/:course_id/exercises/:id',
        handler: {
          body: 'exercise'
        },
      }
    ];

    const result = serve(routes, {path: '/courses/php_trees'});
    expect(result.handler.body).toBe('course');
    expect(result).toEqual({
      path: '/courses/php_trees',
      handler: {body: 'course'},
      method: 'GET',
      params: {id: 'php_trees'}
    })
  });

  test('should match method route', () => {
    const routes = [
      {
        method: 'GET',
        path: '/courses/:id',
        handler: {
          body: 'course'
        },
      },
      {
        method: 'POST',
        path: '/courses',
        handler: {
          body: 'created'
        },
      },
      {
        method: 'GET',
        path: '/courses/:course_id/exercises/:id',
        handler: {
          body: 'exercise'
        },
      }
    ];

    const result = serve(routes, {path: '/courses', method: 'POST'});
    expect(result.handler.body).toBe('created');
    expect(result).toEqual({
      path: '/courses',
      handler: {body: 'created'},
      method: 'POST',
      params: {}
    })
  });

  test('should throw error for unknown route', () => {
    const routes = [
      {
        path: '/courses',
        handler: {body: 'courses'},
      },
    ];

    expect(() => serve(routes, {path: '/unknown'})).toThrow('Route not found: /unknown');
  });

  test('should match constraints', () => {
    const routes = [
      {
        path: '/courses/:course_id/exercises/:id',
        handler: {
          body: 'exercise!'
        },
        constraints: {id: '\\d+', course_id: '^[a-z]+$'},
      },
    ];

    const result = serve(routes, {path: '/courses/js/exercises/1'});

    expect(result.handler.body).toBe('exercise!');
    expect(result).toEqual({
      handler: {body: 'exercise!'},
      path: '/courses/js/exercises/1',
      params: {id: '1', course_id: 'js'},
      method: 'GET'
    })
  })

  test('should throw on constraints', () => {
    const routes = [
      {
        path: '/courses/:course_id/exercises/:id',
        handler: {
          body: 'exercise!'
        },
        constraints: {id: '\\d+', course_id: '^[a-z]+$'},
      },
    ];

    const path = '/courses/noop/exercises/js'

    expect(() => serve(routes, { path })).toThrow(`Invalid parameter format in path: ${path}`);
  })
});
