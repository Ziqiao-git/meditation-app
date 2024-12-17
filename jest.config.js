module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
    
    // Test environment
    testEnvironment: "node",
    
    // Test match patterns
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    // Add these settings for test environment
    setupFiles: ["<rootDir>testsetup.js"]
  };