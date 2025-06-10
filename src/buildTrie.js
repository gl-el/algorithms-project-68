// eslint-disable-next-line import/extensions
import TrieNode from './TrieNode.js';

const buildTrie = (routes) => {
  const root = new TrieNode();

  routes.forEach((route) => {
    let node = root;
    const segments = route.path.split('/').filter(Boolean);

    segments.forEach((seg) => {
      const isParam = seg.startsWith(':');
      const key = isParam ? `:${seg.slice(1)}` : seg;

      if (!node.children[key]) {
        const child = new TrieNode();
        if (isParam) {
          const paramName = seg.slice(1);
          child.paramName = paramName;
          child.constraint = route.constraints?.[paramName] || null;
        }
        node.children[key] = child;
      }

      node = node.children[key];
    });

    if (!node.handlers) {
      node.handlers = {};
    }

    const method = route.method || 'GET';

    node.handlers[method] = {
      handler: route.handler,
      routePath: route.path,
      constraints: route.constraints || {},
      method,
    };
  });

  return root;
};

export default buildTrie;
