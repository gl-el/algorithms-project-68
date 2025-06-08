import { buildTrie } from "./buildTrie.js";

export default function serve(routes, request) {
  const trie = buildTrie(routes);
  const { path, method } = request;
  const segments = path.split('/').filter(Boolean);
  let node = trie;
  const params = {};

  for (const seg of segments) {
    if (node.children[seg]) {
      node = node.children[seg];
    } else {
      const paramKey = Object.keys(node.children).find(
        key => key.startsWith(':')
      );

      if (paramKey) {
        const paramName = paramKey.slice(1);
        params[paramName] = seg;
        node = node.children[paramKey];
      } else {
        throw new Error(`Route not found: ${path}`);
      }
    }
  }

  const handlerInfo = node.handlers?.[method || 'GET'];

  if (!handlerInfo) {
    throw new Error(`No route matching method: ${method} on path: ${path}`);
  }

  return {
    path,
    method: handlerInfo.method || (method || 'GET'),
    params,
    handler: handlerInfo.handler,
  };
}
