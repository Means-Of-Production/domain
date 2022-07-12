module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.{ts,tsx,js,jsx}",
        "!src/**/*d.ts"
    ],
    coveragePathIgnorePatterns: [
        "jest.config.js",
        "/node_modules/",
        "/dist/",
    ],
    moduleNameMapper: {
        '^@meansofproduction/(.*)$': '<rootDir>/packages/$1/'
    }
};