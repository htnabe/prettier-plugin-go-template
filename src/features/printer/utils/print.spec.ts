import { printStatement, printPlainBlock } from "./print";

describe("printStatement", () => {
  it("should return a Doc object", () => {
    const result = printStatement("variable", true);

    expect(result).toBeDefined();
    expect(typeof result).not.toBe("string");
  });

  it("should handle statements with and without spacing", () => {
    const resultWithSpaces = printStatement("variable", true);
    const resultWithoutSpaces = printStatement("variable", false);

    expect(resultWithSpaces).toBeDefined();
    expect(resultWithoutSpaces).toBeDefined();
  });

  it("should accept custom delimiters", () => {
    const result = printStatement("variable", true, {
      start: "-",
      end: "-",
    });

    expect(result).toBeDefined();
  });

  it("should handle multiline statements", () => {
    const multilineStatement = "if test\n  result\nend";
    const result = printStatement(multilineStatement, true);

    expect(result).toBeDefined();
  });

  it("should handle empty statements", () => {
    const result = printStatement("", true);

    expect(result).toBeDefined();
  });
});

describe("printPlainBlock", () => {
  it("should return a Doc object", () => {
    const text = "line 1\nline 2";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should handle single line text", () => {
    const text = "single line";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should handle multiline text", () => {
    const text = "line 1\nline 2\nline 3";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should handle empty text", () => {
    const text = "";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should handle text with leading and trailing whitespace", () => {
    const text = "  \nline 1\nline 2\n  ";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should process with hardlines parameter set to true", () => {
    const text = "line 1\nline 2";
    const result = printPlainBlock(text, true);

    expect(result).toBeDefined();
  });

  it("should process with hardlines parameter set to false", () => {
    const text = "line 1\nline 2";
    const result = printPlainBlock(text, false);

    expect(result).toBeDefined();
  });
});
