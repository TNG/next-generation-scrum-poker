import typescript from '@rollup/plugin-typescript';
import { join } from 'path';
import { defineConfig } from 'rollup';

export default defineConfig(
  ['onconnect', 'sendmessage', 'ondisconnect'].map((lambdaName) => {
    const lambdaPath = join(__dirname, lambdaName);
    return {
      input: join(lambdaPath, 'src/app.ts'),
      external: ['aws-sdk'],
      plugins: [typescript({ tsconfig: join(lambdaPath, 'tsconfig.json') })],
      output: {
        file: join(lambdaPath, 'build/app.js'),
        format: 'cjs' as const,
        interop: 'default' as const,
      },
    };
  })
);
