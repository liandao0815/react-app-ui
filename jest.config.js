module.exports = {
  roots: ['./packages'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testMatch: ['<rootDir>/**/*.(spec|test).(ts|tsx)'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
