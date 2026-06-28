import type { GoTemplateParserOptions } from "@/types/go-template-parser-options";

const options: {
  [K in keyof GoTemplateParserOptions]: any;
} = {
  goTemplateBracketSpacing: {
    type: "boolean",
    category: "Global",
    description:
      "Specifies whether the brackets should have spacing around the statement.",
    default: true,
  },
} as const;

export default options;
