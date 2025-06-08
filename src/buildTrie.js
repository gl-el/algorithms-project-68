import {TrieNode} from "./TrieNode.js";

export const buildTrie = (routes) => {
  const root = new TrieNode();

  for (const route of routes) {
    let node = root;
    const segments = route.path.split('/').filter(Boolean);

    for (const seg of segments) {
      if (seg.startsWith(':')) {
        const paramName = seg.slice(1);
        const paramKey = `:${paramName}`;

        if (!node.children[paramKey]) {
          node.children[paramKey] = new TrieNode();
        }

        node = node.children[paramKey];

      } else {
        if (!node.children[seg]) {
          node.children[seg] = new TrieNode();
        }
        node = node.children[seg];
      }
    }

    if (!node.handlers) {
      node.handlers = {};
    }

    const method = route.method || 'GET';

    node.handlers[method] = {
      handler: route.handler,
      routePath: route.path,
    };
  }

  return root;
};
