import type { GoInline, GoBlock, GoRoot } from "@/types/ast/ast";
import {
  getFirstBlockParent,
  isBlockEnd,
  isBlockStart,
} from "@/features/printer/utils/ast";

describe("getFirstBlockParent", () => {
  it("should return the parent node if it is a block", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 10,
      statement: "test",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 30,
      keyword: "if",
      children: { "inline-1": mockInline },
      start: mockInline,
      end: null,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      aliasedContent: "inline-1",
      content: "inline-1",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    const result = getFirstBlockParent(mockInline);
    expect(result.parent).toBe(mockBlock);
    expect(result.child).toBe(mockInline);
  });

  it("should skip intermediate non-block parents to find the first block parent", () => {
    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: {},
      start: {} as GoInline,
      end: null,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 10,
      length: 10,
      statement: "test",
      startDelimiter: "",
      endDelimiter: "",
      parent: mockBlock,
    };

    const result = getFirstBlockParent(mockInline);
    expect(result.parent).toBe(mockBlock);
    expect(result.child).toBe(mockInline);
  });
});

describe("isBlockEnd", () => {
  it("should return true if the node is a block end node", () => {
    const mockInline: GoInline = {
      id: "end-1",
      type: "inline",
      index: 40,
      length: 10,
      statement: "end",
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
      children: { "end-1": mockInline },
      start: {} as GoInline,
      end: mockInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(isBlockEnd(mockInline)).toBe(true);
  });

  it("should return false if the node is not a block end node", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 10,
      length: 10,
      statement: "test",
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
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(isBlockEnd(mockInline)).toBe(false);
  });
});

describe("isBlockStart", () => {
  it("should return true if the node is a block start node", () => {
    const mockStartInline: GoInline = {
      id: "start-1",
      type: "inline",
      index: 0,
      length: 10,
      statement: "if",
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
      children: { "start-1": mockStartInline },
      start: mockStartInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoRoot,
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    mockStartInline.parent = mockBlock;

    expect(isBlockStart(mockStartInline)).toBe(true);
  });

  it("should return false if the node is not a block start node", () => {
    const mockInline: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 10,
      length: 10,
      statement: "test",
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
      content: "",
      aliasedContent: "",
      contentStart: 0,
    };

    mockInline.parent = mockBlock;

    expect(isBlockStart(mockInline)).toBe(false);
  });
});
