module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["./tests/setup/jest.setup.js"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    verbose: true,
    testTimeout: 10000,
  };
  