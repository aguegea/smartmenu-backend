import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageDirectory: "coverage",
    testMatch: [
        "**/?(*.)+(spec|test).[tj]s?(x)",
    ],
    setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "<rootDir>/tests/jest.setup.ts" // Ignorar setup
    ],
};

export default config;