import typescript from '@rollup/plugin-typescript';
import { join } from 'path';
import { defineConfig } from 'rollup';

export default ['onconnect', 'sendmessage', 'ondisconnect'].map((lambdaName) => {
  const lambdaPath = join(__dirname, lambdaName);
  return defineConfig({
    input: join(lambdaPath, 'src/app.ts'),
    external: [
      '@aws-sdk/client-apigatewaymanagementapi',
      '@aws-sdk/client-dynamodb',
      '@aws-sdk/lib-dynamodb',
    ],
    plugins: [typescript({ tsconfig: join(lambdaPath, 'tsconfig.json') })],
    output: {
      file: join(lambdaPath, 'build/app.js'),
      format: 'cjs',
      interop: 'default',
    },
  });
});
