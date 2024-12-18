module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage/integration",
    testEnvironment: "node",
    testMatch: [
      "**/__integ_tests__/**/*.test.[jt]s?(x)",
      "**/integration.test.[tj]s?(x)"
    ],
    setupFiles: ["<rootDir>testsetup.integration.js"]
};