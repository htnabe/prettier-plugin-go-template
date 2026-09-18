import { afterEach, describe, expect, it, vi } from "vitest";
import { parseGoTemplate } from "./parse-go-template";
import type { GoNode } from "@/types/ast/ast";
import type { ParserOptions } from "prettier";

const parserOptions = {} as ParserOptions<GoNode>;

const createMockMatch = (
  index: number | undefined,
  overrides?: {
    statement?: string;
    keyword?: string;
    startdelimiter?: string;
    endDelimiter?: string;
  },
) => ({
  0: "{{ if true }}",
  length: 1,
  index,
  groups: {
    statement: "if true",
    keyword: "if",
    startdelimiter: "",
    endDelimiter: "",
    ...overrides,
  },
});

describe("parseGoTemplate error guards", () => {
  // Some guards below are integrity checks for impossible-or-rare states under
  // normal parsing flow. Keep mock-based tests to prevent accidental removal
  // of these defensive throws during refactors.
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('throws "Regex match index undefined." for a malformed match object', async () => {
    vi.spyOn(String.prototype, "matchAll").mockReturnValue([
      createMockMatch(undefined),
    ] as any);

    expect(() => parseGoTemplate("{{ if true }}", parserOptions)).toThrow(
      new Error("Regex match index undefined."),
    );
  });

  // Uses a mock because normal input should not empty the stack mid-loop.
  // Real-world cause (rare): internal state corruption by future refactors.
  it('throws "Node stack empty." when parsing text with an empty stack state', async () => {
    vi.doMock("@/utils/last", () => ({
      default: () => undefined,
    }));

    vi.spyOn(String.prototype, "matchAll").mockReturnValue([
      createMockMatch(0),
    ] as any);

    const { parseGoTemplate } = await import("./parse-go-template");

    expect(() => parseGoTemplate("{{ if true }}", parserOptions)).toThrow(
      new Error("Node stack empty."),
    );
  });

  // Uses a mock because regex-defined groups should include `statement` for
  // formattable matches. Real-world cause (rare): regex/group changes causing
  // contract mismatch between parser logic and capture groups.
  it('throws "Formattable match without statement." for a statement-less match', () => {
    vi.spyOn(String.prototype, "matchAll").mockReturnValue([
      createMockMatch(0, { statement: undefined }),
    ] as any);

    expect(() => parseGoTemplate("{{ }}", parserOptions)).toThrow(
      new Error("Formattable match without statement."),
    );
  });

  // Example: {{ end }} appears without a matching opening block like {{ if }}.
  it('throws "Encountered unexpected end keyword." for orphan {{ end }} at root', () => {
    expect(() => parseGoTemplate("{{ end }}", parserOptions)).toThrow(
      new Error("Encountered unexpected end keyword."),
    );
  });

  // Example: {{ define "title }} has an unclosed string literal.
  it("throws for unclosed string literals in template statements", () => {
    expect(() => parseGoTemplate('{{ define "title }}', parserOptions)).toThrow(
      new Error("String literal is not closed. Invalid Go template statement"),
    );
  });

  // Comment actions are opaque payloads and may include unmatched quotes.
  it("does not throw for unmatched quotes inside comment actions", () => {
    expect(() => parseGoTemplate('{{/* " */}}', parserOptions)).not.toThrow();
  });

  // Uses a mock because normal AST assembly should always provide a parent
  // shape with `children` in this branch. Real-world cause (rare): malformed
  // parent linkage introduced by block/else handling refactors.
  it('throws "Could not find child in parent." for malformed {{ else }} parent linkage', async () => {
    vi.doMock("@/utils/last", () => ({
      default: () => ({
        type: "block",
        id: "block-id",
        index: 0,
        parent: {},
      }),
    }));

    vi.spyOn(String.prototype, "matchAll").mockReturnValue([
      createMockMatch(0, {
        statement: "else",
        keyword: "else",
      }),
    ] as any);

    const { parseGoTemplate } = await import("./parse-go-template");

    expect(() => parseGoTemplate("{{ else }}", parserOptions)).toThrow(
      new Error("Could not find child in parent."),
    );
  });

  // Example: {{ if }}\n<span>Invalid</span> without a closing {{ end }}.
  it('throws "Missing end block." for unclosed {{ if }} blocks', () => {
    expect(() =>
      parseGoTemplate("{{ if }}\n<span>Invalid</span>", parserOptions),
    ).toThrow(new Error("Missing end block."));
  });
});
