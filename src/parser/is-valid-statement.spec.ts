import { isValidStatement } from "./is-valid-statement";

describe("isValidStatement", () => {
  type TestCase = {
    name: string;
    statement: string;
    expected: boolean;
  };

  const CASES: TestCase[] = [
    {
      name: "returns true for statement without quotes",
      statement: "{{if true}}content{{end}}",
      expected: true,
    },
    {
      name: "returns true for closed double-quoted string",
      statement: `define "Norwegian krone"`,
      expected: true,
    },
    {
      name: "returns false for unclosed double-quoted string",
      statement: `define "Norwegian krone`,
      expected: false,
    },
    {
      name: "returns true when escaped quote appears inside double quotes",
      statement: String.raw`define "a\"b"`,
      expected: true,
    },
    {
      name: "returns true for closed raw string with double quote inside",
      statement: String.raw`define \`a"b\``,
      expected: true,
    },
    {
      name: "returns false for unclosed raw string",
      statement: String.raw`define \`a"b`,
      expected: false,
    },
    {
      name: "returns true for multiline closed double-quoted string",
      statement: `define "line1
line2"`,
      expected: true,
    },
    {
      name: "returns false for multiline unclosed double-quoted string",
      statement: `define "line1
line2`,
      expected: false,
    },
  ];

  it.each(CASES)("$name", ({ statement, expected }) => {
    const result = isValidStatement(statement);
    expect(result).toBe(expected);
  });
});
