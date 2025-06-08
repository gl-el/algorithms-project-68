export default function serve(routes, path) {
  const route = routes.find(route => route.path === path);

  if (!route) {
    throw new Error(`Route not found: ${path}`);
  }

  return route.handler;
}
