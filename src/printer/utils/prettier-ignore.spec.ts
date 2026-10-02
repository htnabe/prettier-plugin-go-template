import {
  hasPrettierIgnoreLine,
  isPrettierIgnoreBlock,
} from "./prettier-ignore";
import type { GoNode, GoBlock, GoInline, GoRoot } from "@/types/ast/ast";

describe("hasPrettierIgnoreLine", () => {
  it("should return false for root nodes", () => {
    const mockRoot: GoRoot = {
      type: "root",
      index: 0,
      length: 100,
      children: {},
      aliasedContent: "content",
      content: "content",
      contentStart: 0,
    };

    expect(hasPrettierIgnoreLine(mockRoot)).toBe(false);
  });

  it("should return true if node has prettier-ignore comment before it", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 30,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: { "inline-1": mockInline },
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      aliasedContent: "<!-- prettier-ignore -->\ninline-1",
      content: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(hasPrettierIgnoreLine(mockInline)).toBe(true);
  });

  it("should return true if node has prettier-ignore template syntax", () => {
    const mockInline: GoInline = {
      id: "inline-2",
      type: "inline",
      index: 20,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: { "inline-2": mockInline },
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      aliasedContent: "{{ prettier-ignore }}\ninline-2",
      content: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(hasPrettierIgnoreLine(mockInline)).toBe(true);
  });

  it("should return false if prettier-ignore is not present", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: { "inline-1": mockInline },
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      aliasedContent: "<!-- some comment -->\ninline-1",
      content: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(hasPrettierIgnoreLine(mockInline)).toBe(false);
  });
});

describe("isPrettierIgnoreBlock", () => {
  it("should return true for prettier-ignore-start blocks", () => {
    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "prettier-ignore-start",
      children: {},
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    expect(isPrettierIgnoreBlock(mockBlock)).toBe(true);
  });

  it("should return false for non-prettier-ignore blocks", () => {
    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: {},
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    expect(isPrettierIgnoreBlock(mockBlock)).toBe(false);
  });

  it("should return false for inline nodes", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(isPrettierIgnoreBlock(mockInline as unknown as GoNode)).toBe(false);
  });
});
