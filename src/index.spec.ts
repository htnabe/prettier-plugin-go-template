import * as prettier from "prettier";
import * as GoTemplatePlugin from "./index";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { jest } from "@jest/globals";
import type { GoTemplateParserOptions } from "./types/go-template-parser-options";

const prettify = (code: string, options: Partial<GoTemplateParserOptions>) =>
  Promise.resolve(
    prettier.format(code, {
      parser: "go-template" as any,
      plugins: [GoTemplatePlugin],
      ...options,
    }),
  );

const testFolder = join(fileURLToPath(new URL(".", import.meta.url)), "tests");
const tests = readdirSync(testFolder);

describe("format", () => {
  tests.forEach((test) =>
    it(test, async () => {
      const path = join(testFolder, test);
      const input = readFileSync(join(path, "input.html")).toString();
      const expected = readFileSync(join(path, "expected.html")).toString();

      const configPath = join(path, "config.json");
      const configString =
        existsSync(configPath) && readFileSync(configPath)?.toString();
      const configObject = configString ? JSON.parse(configString) : {};

      const expectedError = expected.match(/Error\("(?<message>.*)"\)/)?.groups
        ?.message;

      const format = () => prettify(input, configObject);

      if (expectedError) {
        jest.spyOn(console, "error").mockImplementation(() => {});
        await expect(format()).rejects.toEqual(new Error(expectedError));
      } else {
        const result = prettify(input, configObject);
        await expect(result).resolves.toEqual(expected);
        // Check that a second prettifying is not changing the result again.
        await expect(
          result.then((formatted) => prettify(formatted, configObject)),
        ).resolves.toEqual(expected);
      }
    }),
  );
});
