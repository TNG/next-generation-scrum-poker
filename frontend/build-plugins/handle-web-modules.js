import path from 'path';

export const handleWebModules = () => {
  const resolvedIds = Object.create(null);
  return {
    name: 'handle-web-modules',
    resolveId(id) {
      if (id.startsWith('/web_modules')) {
        return resolvedIds[id] || (resolvedIds[id] = path.resolve(__dirname, `.${id}`));
      }
    },
  };
};
