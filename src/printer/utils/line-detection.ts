import type { GoInline } from "@/types/ast/ast";
import { getFirstBlockParent } from "./ast";

export function hasNodeLinebreak(node: GoInline, source: string): boolean {
  const start = node.index + node.length;
  const end = source.indexOf("\n", start);
  const suffix = source.substring(start, end);

  return !suffix;
}

export function isFollowedByEmptyLine(node: GoInline, source: string): boolean {
  const start = node.index + node.length;
  const firstLineBreak = source.indexOf("\n", start);
  const secondLineBreak = source.indexOf("\n", firstLineBreak + 1);
  const emptyLine = source
    .substring(firstLineBreak + 1, secondLineBreak)
    .trim();
  const isLastNode = !!source.substring(start).match(/^\s*$/);

  return (
    firstLineBreak !== -1 && secondLineBreak !== -1 && !emptyLine && !isLastNode
  );
}

export function isFollowedByNode(node: GoInline): boolean {
  const parent = getFirstBlockParent(node).parent;
  const start = parent.aliasedContent.indexOf(node.id) + node.id.length;

  let nextNodeIndex = -1;
  Object.keys(parent.children).forEach((key) => {
    const index = parent.aliasedContent.indexOf(key, start);
    if (nextNodeIndex === -1 || index < nextNodeIndex) {
      nextNodeIndex = index;
    }
  });

  return !!parent.aliasedContent
    .substring(start, nextNodeIndex)
    .match(/^\s+$/m);
}
