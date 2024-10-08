module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}], // Use this format for ts-jest
  },
  testMatch: ['**/src/**/*.test.ts'],
  verbose: true
};
