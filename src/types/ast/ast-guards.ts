import type {
  GoBlock,
  GoInline,
  GoMultiBlock,
  GoNode,
  GoRoot,
} from "@/types/ast/ast";

const astGuards = {
  isInline(node: GoNode): node is GoInline {
    return node.type === "inline";
  },

  isBlock(node: GoNode): node is GoBlock {
    return node.type === "block";
  },

  isMultiBlock(node: GoNode): node is GoMultiBlock {
    return node.type === "double-block";
  },

  isRoot(node: GoNode): node is GoRoot {
    return node.type === "root";
  },

  isUnformattable(node: GoNode): node is GoRoot {
    return node.type === "unformattable";
  },
};

export default astGuards;
