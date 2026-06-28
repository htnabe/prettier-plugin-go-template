import type { GoNode } from "@/types/ast/ast";
import astGuards from "@/types/ast/ast-guards";
import { getFirstBlockParent } from "./ast";

export function hasPrettierIgnoreLine(node: GoNode): boolean {
  if (astGuards.isRoot(node)) {
    return false;
  }

  const { parent, child } = getFirstBlockParent(node);

  const regex = new RegExp(
    `(?:<!--|{{).*?prettier-ignore.*?(?:-->|}})\n.*${child.id}`,
  );

  return !!parent.aliasedContent.match(regex);
}

export function isPrettierIgnoreBlock(node: GoNode): boolean {
  return astGuards.isBlock(node) && node.keyword === "prettier-ignore-start";
}
