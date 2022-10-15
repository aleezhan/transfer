module.exports = {
    "preset": "ts-jest/presets/default-esm",
    "globals": {
        "ts-jest": {
            "useESM": true
        }
    },
    testPathIgnorePatterns: [".d.ts", ".js", '<rootDir>/node_modules/'],
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
