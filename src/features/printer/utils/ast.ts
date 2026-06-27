import type { GoBlock, GoInline, GoNode, GoRoot } from "@/types/ast/ast";
import astGuards from "@/types/ast/ast-guards";

export function getFirstBlockParent(node: Exclude<GoNode, GoRoot>): {
  parent: GoBlock | GoRoot;
  child: typeof node;
} {
  let previous = node;
  let current = node.parent;

  while (!astGuards.isBlock(current) && !astGuards.isRoot(current)) {
    previous = current;
    current = current.parent;
  }

  return {
    child: previous,
    parent: current,
  };
}

export function isBlockEnd(node: GoInline): boolean {
  const { parent } = getFirstBlockParent(node);
  return astGuards.isBlock(parent) && parent.end === node;
}

export function isBlockStart(node: GoInline): boolean {
  const { parent } = getFirstBlockParent(node);
  return astGuards.isBlock(parent) && parent.start === node;
}
