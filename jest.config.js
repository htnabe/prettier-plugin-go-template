import { createDefaultEsmPreset } from "ts-jest";

const preset = createDefaultEsmPreset();

const config = {
  ...preset,
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
