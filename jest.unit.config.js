module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage/unit",
    testEnvironment: "node",
    testMatch: [
      "**/__unit_tests__/**/*.[jt]s?(x)",
      "**/unit.?(spec|test).[tj]s?(x)"
    ],
    setupFiles: ["<rootDir>testsetup.unit.js"]
};