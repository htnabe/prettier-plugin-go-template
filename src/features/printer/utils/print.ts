import type {
  GoInline,
  GoInlineEndDelimiter,
  GoInlineStartDelimiter,
  GoUnformattable,
} from "@/types/ast/ast";
import type { GoTemplateParserOptions } from "@/types/go-template-parser-options";
import { type AstPath, type Doc, type ParserOptions } from "prettier";
import pkg from "prettier/doc.js";
import { isBlockEnd, isBlockStart } from "./ast";
import {
  hasNodeLinebreak,
  isFollowedByEmptyLine,
  isFollowedByNode,
} from "./line-detection";

const { builders } = pkg;

type ExtendedParserOptions = ParserOptions & GoTemplateParserOptions;

export function printMultiBlock(
  path: AstPath,
  print: (path: AstPath) => Doc,
): Doc {
  return path.map(print, "blocks");
}

export function printInline(
  node: GoInline,
  parserOptions: ExtendedParserOptions,
): Doc {
  const isBlockNode = isBlockEnd(node) || isBlockStart(node);
  const emptyLine =
    isFollowedByEmptyLine(node, parserOptions.originalText) &&
    isFollowedByNode(node)
      ? builders.softline
      : "";

  const result: Doc[] = [
    printStatement(node.statement, parserOptions.goTemplateBracketSpacing, {
      start: node.startDelimiter,
      end: node.endDelimiter,
    }),
  ];

  return builders.group([...result, emptyLine], {
    shouldBreak:
      hasNodeLinebreak(node, parserOptions.originalText) && !isBlockNode,
  });
}

export function printStatement(
  statement: string,
  addSpaces: boolean,
  delimiter: { start: GoInlineStartDelimiter; end: GoInlineEndDelimiter } = {
    start: "",
    end: "",
  },
) {
  const space = addSpaces ? " " : "";
  const shouldBreak = statement.includes("\n");

  const content = shouldBreak
    ? statement
        .trim()
        .split("\n")
        .map((line, index, array) =>
          index === array.length - 1
            ? [line.trim(), builders.softline]
            : builders.indent([line.trim(), builders.softline]),
        )
    : [statement.trim()];

  return builders.group(
    [
      "{{",
      delimiter.start,
      space,
      ...content,
      shouldBreak ? "" : space,
      delimiter.end,
      "}}",
    ],
    { shouldBreak },
  );
}

export function printUnformattable(
  node: GoUnformattable,
  targetOpts: ExtendedParserOptions,
) {
  const start = targetOpts.originalText.lastIndexOf("\n", node.index - 1);
  const line = targetOpts.originalText.substring(
    start,
    node.index + node.length,
  );
  const lineWithoutAdditionalContent =
    line.replace(node.content, "").match(/\s*$/)?.[0] ?? "";

  return printPlainBlock(lineWithoutAdditionalContent + node.content, false);
}

export function printPlainBlock(text: string, hardlines = true): Doc {
  const isTextEmpty = (input: string) => !!input.match(/^\s*$/);

  const lines = text.split("\n");

  const segments = lines.filter(
    (value, i) => !(i === 0 || i === lines.length - 1) || !isTextEmpty(value),
  );

  return [
    ...segments.map((content, i) => [
      hardlines || i ? builders.hardline : "",
      builders.trim,
      content,
    ]),
    hardlines ? builders.hardline : "",
  ];
}
