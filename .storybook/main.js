const path = require('path')

module.exports = {
  stories: ['../packages/**/*.story.tsx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader'],
      include: path.resolve(__dirname, '../packages'),
    })
    return config
  },
}
