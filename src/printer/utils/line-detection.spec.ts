import {
  hasNodeLinebreak,
  isFollowedByEmptyLine,
  isFollowedByNode,
} from "./line-detection";
import type { GoInline, GoBlock } from "@/types/ast/ast";

describe("hasNodeLinebreak", () => {
  it("should return true if there is a linebreak after the node", () => {
    const source = "{{variable}}\nmore content";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(hasNodeLinebreak(mockNode, source)).toBe(true);
  });

  it("should return false if there is content after the node on the same line", () => {
    const source = "{{variable}} more content";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(hasNodeLinebreak(mockNode, source)).toBe(false);
  });

  it("should handle nodes at the end of the source", () => {
    const source = "{{variable}}";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    // When node is at the end with no linebreak, the suffix will not be empty
    // so hasNodeLinebreak returns false
    expect(hasNodeLinebreak(mockNode, source)).toBe(false);
  });
});

describe("isFollowedByEmptyLine", () => {
  it("should return true if followed by an empty line", () => {
    const source = "{{variable}}\n\nnext line";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(isFollowedByEmptyLine(mockNode, source)).toBe(true);
  });

  it("should return false if directly followed by content on next line", () => {
    const source = "{{variable}}\nmore content";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(isFollowedByEmptyLine(mockNode, source)).toBe(false);
  });

  it("should return false if the node is the last in the source", () => {
    const source = "{{variable}}\n";
    const mockNode: GoInline = {
      id: "inline-1",
      type: "inline",
      index: 0,
      length: 12,
      statement: "variable",
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as GoBlock,
    };

    expect(isFollowedByEmptyLine(mockNode, source)).toBe(false);
  });
});

describe("isFollowedByNode", () => {
  it("should return true if followed by whitespace only", () => {
    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: { "id-1": {} as GoInline, "id-2": {} as GoInline },
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as any,
      aliasedContent: "id-1   \n   id-2",
      content: "",
      contentStart: 0,
    };

    const mockNode: GoInline = {
      id: "id-1",
      type: "inline",
      index: 0,
      length: 4,
      statement: "test",
      startDelimiter: "",
      endDelimiter: "",
      parent: mockBlock,
    };

    expect(isFollowedByNode(mockNode)).toBe(true);
  });

  it("should return false if followed by non-whitespace content", () => {
    const mockBlock: GoBlock = {
      id: "block-1",
      type: "block",
      index: 0,
      length: 50,
      keyword: "if",
      children: { "id-1": {} as GoInline, "id-2": {} as GoInline },
      start: {} as GoInline,
      end: {} as GoInline,
      startDelimiter: "",
      endDelimiter: "",
      parent: {} as any,
      aliasedContent: "id-1 content id-2",
      content: "",
      contentStart: 0,
    };

    const mockNode: GoInline = {
      id: "id-1",
      type: "inline",
      index: 0,
      length: 4,
      statement: "test",
      startDelimiter: "",
      endDelimiter: "",
      parent: mockBlock,
    };

    expect(isFollowedByNode(mockNode)).toBe(false);
  });
});
