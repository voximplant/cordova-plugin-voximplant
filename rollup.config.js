import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  nodeResolve(),
  commonJs(),
  typeScript({
    tsconfig: "tsconfig.json",
    tsconfigOverride: {
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        module: 'ES2015',
      },
    },
  }),
  terser()
];

export default [{
  input: 'www/index.ts',
  output: {
    file: 'dist/VoximplantPlugin.min.js',
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  },
  plugins: plugins
}];
