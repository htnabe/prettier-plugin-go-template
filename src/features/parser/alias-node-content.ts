import type { GoBlock, GoRoot } from "@/types/ast/ast";

export function aliasNodeContent(current: GoBlock | GoRoot): string {
  let result = current.content;

  Object.entries(current.children)
    .sort(([_, node1], [__, node2]) => node2.index - node1.index)
    .forEach(
      ([id, node]) =>
        (result =
          result.substring(0, node.index - current.contentStart) +
          id +
          result.substring(node.index + node.length - current.contentStart)),
    );

  return result;
}
