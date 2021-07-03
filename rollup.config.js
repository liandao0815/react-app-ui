import fs from 'fs'
import path from 'path'
/** rollup plugin */
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'
/** post-css plugin */
import less from 'postcss-less'
import autoprefixer from 'autoprefixer'

const packages = {}
const rollConfig = []
const packageDir = path.join(__dirname, './packages')
const extensions = ['.js', '.jsx', '.ts', '.tsx']
const globals = { react: 'react', 'react-dom': 'react-dom' }

fs.readdirSync(packageDir).forEach(file => {
  const excludeFiles = ['hooks', 'styles', 'utils']

  if (!excludeFiles.includes(file)) {
    const absolutePath = path.join(packageDir, file)
    const isDirectory = fs.lstatSync(absolutePath).isDirectory()
    const isTSFile = path.extname(absolutePath) === '.tsx'
    const basename = path.basename(absolutePath, '.tsx')

    if (isTSFile) {
      packages[basename] = {
        source: `packages/${basename}.tsx`,
        lib_esm: `lib/${basename}.esm.js`,
        lib_umd: `lib/${basename}.js`,
      }
    }
    if (isDirectory) {
      packages[file] = {
        source: `packages/${file}/index.tsx`,
        lib_esm: `lib/${file}/index.esm.js`,
        lib_umd: `lib/${file}/index.js`,
      }
    }
  }
})

const generateConfig = (file, option) => ({
  input: option.source,
  output: [
    {
      file: option.lib_esm,
      format: 'esm',
      sourcemap: true,
      globals,
    },
    {
      file: option.lib_umd,
      format: 'umd',
      name: file,
      sourcemap: true,
      globals,
    },
  ],
  plugins: [
    commonjs(),
    resolve({ extensions }),
    babel({
      extensions,
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    postcss({
      parser: less,
      extract: 'index.css',
      sourceMap: true,
      minimize: true,
      plugins: [autoprefixer()],
    }),
    peerDepsExternal({ includeDependencies: true }),
    terser(),
  ],
})

for (const [file, option] of Object.entries(packages)) {
  rollConfig.push(generateConfig(file, option))
}

export default rollConfig
