import {buildTrie} from "./buildTrie.js";

export default function serve(routes, path) {
  const trie = buildTrie(routes);

  const params = {};
  const segments = path.split('/').filter(Boolean);
  let node = trie;

  for (const seg of segments) {
    if (node.children[seg]) {
      node = node.children[seg];
    } else {
      const paramKey = Object.keys(node.children).find(
        key => key.startsWith(':')
      );

      if (paramKey) {
        const paramName = paramKey.slice(1); // убираем ":"
        params[paramName] = seg;
        node = node.children[paramKey];
      } else {
        throw new Error(`Route not found: ${path}`);
      }
    }
  }

  if (!node.handler) {
    throw new Error(`Route not found: ${path}`);
  }

  return {
    path,
    handler: node.handler,
    params,
  };
}
