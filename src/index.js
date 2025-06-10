// eslint-disable-next-line import/extensions
import buildTrie from './buildTrie.js';

export default function serve(routes, request) {
  const trie = buildTrie(routes);
  const { path, method = 'GET' } = request;
  const segments = path.split('/').filter(Boolean);

  let node = trie;
  const params = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const seg of segments) {
    if (node.children[seg]) {
      node = node.children[seg];
      // eslint-disable-next-line no-continue
      continue;
    }

    const paramEntry = Object.entries(node.children).find(([key, child]) => key.startsWith(':')
        && (!child.constraint || new RegExp(`^${child.constraint}`).test(seg)));

    if (paramEntry) {
      const childNode = paramEntry[1];
      params[childNode.paramName] = seg;
      node = childNode;
    } else {
      throw new Error(`Route not found: ${path}`);
    }
  }

  const handlerInfo = node.handlers?.[method];
  if (!handlerInfo) {
    throw new Error(`No matching route for method: ${method} on path: ${path}`);
  }

  return {
    path,
    method,
    params,
    handler: handlerInfo.handler,
  };
}
