module.exports = {
  presets: [
    ['@babel/preset-env', { modules: false }],
    ['@babel/preset-typescript'],
    ['@babel/preset-react'],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-typescript',
    'transform-class-properties',
  ],
}
