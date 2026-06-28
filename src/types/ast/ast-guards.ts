import type { GoBlock, GoMultiBlock, GoNode, GoRoot } from "@/types/ast/ast";

const astGuards = {
  isBlock(node: GoNode): node is GoBlock {
    return node.type === "block";
  },

  isMultiBlock(node: GoNode): node is GoMultiBlock {
    return node.type === "double-block";
  },

  isRoot(node: GoNode): node is GoRoot {
    return node.type === "root";
  },
};

export default astGuards;
