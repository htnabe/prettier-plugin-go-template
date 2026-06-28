import type {
  GoNode,
  GoRoot,
  GoBlock,
  GoBlockKeyword,
  GoInlineStartDelimiter,
  GoInlineEndDelimiter,
  GoInline,
  GoMultiBlock,
} from "@/types/ast/ast";
import astGuards from "@/types/ast/ast-guards";
import { createIdGenerator } from "@/utils/create-id-generator";
import last from "@/utils/last";
import type { Parser } from "prettier";
import { aliasNodeContent } from "@/features/parser/alias-node-content";

export const parseGoTemplate: Parser<GoNode>["parse"] = (text) => {
  const regex =
    /{{(?<startdelimiter>-|<|%|\/\*)?\s*(?<statement>(?<keyword>if|range|block|with|define|end|else|prettier-ignore-start|prettier-ignore-end)?[\s\S]*?)\s*(?<endDelimiter>-|>|%|\*\/)?}}|(?<unformattableScript><(script)((?!<)[\s\S])*>((?!<\/script)[\s\S])*?{{[\s\S]*?<\/(script)>)|(?<unformattableStyle><(style)((?!<)[\s\S])*>((?!<\/style)[\s\S])*?{{[\s\S]*?<\/(style)>)/g;
  const root: GoRoot = {
    type: "root",
    content: text,
    aliasedContent: "",
    children: {},
    index: 0,
    contentStart: 0,
    length: text.length,
  };
  const nodeStack: (GoBlock | GoRoot)[] = [root];
  const getId = createIdGenerator();

  for (const match of text.matchAll(regex)) {
    const current = last(nodeStack);
    const keyword = match.groups?.keyword as GoBlockKeyword | undefined;
    const statement = match.groups?.statement;
    const unformattable =
      match.groups?.unformattableScript ?? match.groups?.unformattableStyle;

    const startDelimiter = (match.groups?.startdelimiter ??
      "") as GoInlineStartDelimiter;
    const endDelimiter = (match.groups?.endDelimiter ??
      "") as GoInlineEndDelimiter;

    if (current === undefined) {
      throw Error("Node stack empty.");
    }

    if (match.index === undefined) {
      throw Error("Regex match index undefined.");
    }
    const id = getId();
    if (unformattable) {
      current.children[id] = {
        id,
        type: "unformattable",
        index: match.index,
        length: match[0].length,
        content: unformattable,
        parent: current,
      };
      continue;
    }

    if (statement === undefined) {
      throw Error("Formattable match without statement.");
    }

    const inline: GoInline = {
      index: match.index,
      length: match[0].length,
      startDelimiter,
      endDelimiter,
      parent: current!,
      type: "inline",
      statement,
      id,
    };

    if (keyword === "end" || keyword === "prettier-ignore-end") {
      if (current.type !== "block") {
        throw Error("Encountered unexpected end keyword.");
      }

      current.length = match[0].length + match.index - current.index;
      current.content = text.substring(current.contentStart, match.index);
      current.aliasedContent = aliasNodeContent(current);
      current.end = inline;

      if (current.parent.type === "double-block") {
        const firstChild = current.parent.blocks[0];
        const lastChild =
          current.parent.blocks[current.parent.blocks.length - 1];

        current.parent.length =
          lastChild.index + lastChild.length - firstChild.index;
      }

      nodeStack.pop();
    } else if (astGuards.isBlock(current) && keyword === "else") {
      const nextChild: GoBlock = {
        type: "block",
        start: inline,
        end: null,
        children: {},
        keyword,
        index: match.index,
        parent: current.parent,
        contentStart: match.index + match[0].length,
        content: "",
        aliasedContent: "",
        length: -1,
        id: getId(),
        startDelimiter,
        endDelimiter,
      };

      if (astGuards.isMultiBlock(current.parent)) {
        current.parent.blocks.push(nextChild);
      } else {
        const multiBlock: GoMultiBlock = {
          type: "double-block",
          parent: current.parent,
          index: current.index,
          length: -1,
          keyword,
          id: current.id,
          blocks: [current, nextChild],
        };
        nextChild.parent = multiBlock;
        current.parent = multiBlock;

        if ("children" in multiBlock.parent) {
          multiBlock.parent.children[multiBlock.id] = multiBlock;
        } else {
          throw Error("Could not find child in parent.");
        }
      }

      current.id = getId();
      current.length = match[0].length + match.index - current.index;
      current.content = text.substring(current.contentStart, match.index);
      current.aliasedContent = aliasNodeContent(current);

      nodeStack.pop();
      nodeStack.push(nextChild);
    } else if (keyword) {
      const block: GoBlock = {
        type: "block",
        start: inline,
        end: null,
        children: {},
        keyword: keyword as GoBlockKeyword,
        index: match.index,
        parent: current,
        contentStart: match.index + match[0].length,
        content: "",
        aliasedContent: "",
        length: -1,
        id: getId(),
        startDelimiter,
        endDelimiter,
      };

      current.children[block.id] = block;
      nodeStack.push(block);
    } else {
      current.children[inline.id] = inline;
    }
  }

  if (!astGuards.isRoot(nodeStack.pop()!)) {
    throw Error("Missing end block.");
  }

  root.aliasedContent = aliasNodeContent(root);

  return root;
};
