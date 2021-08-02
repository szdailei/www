const config = {
  moduleFileExtensions: ['js', 'jsx', 'mjs'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|js?|tsx?|ts?|mjs?)$',
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  reporters: ['default', ['jest-html-reporters', { publicPath: 'reports' }]],
  verbose: false,
};

export default config;
