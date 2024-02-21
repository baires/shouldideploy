const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  coverageReporters: [["text", { file: 'coverage.txt' }]]
};

export default config
