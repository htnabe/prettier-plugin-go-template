import type { GoNode } from "@/types/ast/ast";
import constants from "@/config/constants";
import type { Parser } from "prettier";
import { parseGoTemplate } from "@/features/parser/parse-go-template";

const parsers = {
  [constants.PLUGIN_KEY]: <Parser<GoNode>>{
    astFormat: constants.PLUGIN_KEY,
    preprocess: (text) =>
      // Cut away trailing newline to normalize formatting.
      text.endsWith("\n") ? text.slice(0, text.length - 1) : text,
    parse: parseGoTemplate,
    locStart: (node) => node.index,
    locEnd: (node) => node.index + node.length,
  },
};

export default parsers;
