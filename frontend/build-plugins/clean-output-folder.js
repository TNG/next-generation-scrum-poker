import path from 'path';
import rimraf from 'rimraf';

export const cleanOutputFolder = () => {
  return {
    name: 'clean-output-folder',
    generateBundle(options) {
      rimraf.sync(path.resolve(options.dir));
    },
  };
};
