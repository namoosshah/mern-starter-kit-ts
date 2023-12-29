import { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  rootDir: ".",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@paths$": "<rootDir>/paths.ts",
  },
  verbose: true,
  // forceExit: true,
  clearMocks: true,
};

export default jestConfig;
