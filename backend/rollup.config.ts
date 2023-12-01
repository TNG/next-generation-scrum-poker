import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { join } from 'path';
import { defineConfig } from 'rollup';

export default defineConfig(
  ['onconnect', 'sendmessage', 'ondisconnect'].map((lambdaName) => {
    const lambdaPath = join(__dirname, lambdaName);
    return {
      input: join(lambdaPath, 'src/app.ts'),
      plugins: [
        typescript({ tsconfig: join(lambdaPath, 'tsconfig.json') }),
        nodeResolve(),
        commonjs(),
        json(),
      ],
      output: {
        file: join(lambdaPath, 'build/app.js'),
        format: 'cjs' as const,
        interop: 'default' as const,
      },
    };
  }),
);
