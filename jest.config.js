import dotenv from 'dotenv';
dotenv.config();

export default {
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { presets: ['@babel/preset-env'] }]
  },
  collectCoverageFrom: ['src/**/*.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  testEnvironment: 'node'
};
