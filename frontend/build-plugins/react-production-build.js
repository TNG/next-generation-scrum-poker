export const reactProductionBuild = () => {
  return {
    name: 'react-production-build',
    resolveId(id, importer) {
      if (id.includes('/es-react/dev/')) {
        return this.resolve(id.replace('/es-react/dev/', '/es-react/'), importer, {
          skipSelf: true,
        });
      }
    },
  };
};
