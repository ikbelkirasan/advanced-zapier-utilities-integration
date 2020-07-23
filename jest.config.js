module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/lib/"],
  testMatch: ["**/test/**/?(*.)+(spec|test).[jt]s?(x)"],
};
