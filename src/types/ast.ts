export interface WithDelimiter {
  startDelimiter: GoInlineStartDelimiter;
  endDelimiter: GoInlineEndDelimiter;
}

export interface GoInline extends GoBaseNode<"inline">, WithDelimiter {
  statement: string;
}

export interface GoBlock extends GoBaseNode<"block">, WithDelimiter {
  keyword: GoBlockKeyword;
  children: {
    [id: string]: GoNode;
  };
  start: GoInline;
  end: GoInline | null;
  content: string;
  aliasedContent: string;
  contentStart: number;
}

export type GoNode =
  | GoRoot
  | GoBlock
  | GoInline
  | GoMultiBlock
  | GoUnformattable;

export type GoBlockKeyword =
  | "if"
  | "range"
  | "block"
  | "with"
  | "define"
  | "else"
  | "prettier-ignore-start"
  | "prettier-ignore-end"
  | "end";

export type GoRoot = { type: "root" } & Omit<
  GoBlock,
  | "type"
  | "keyword"
  | "parent"
  | "statement"
  | "id"
  | "startDelimiter"
  | "endDelimiter"
  | "start"
  | "end"
>;

export interface GoBaseNode<Type extends string> {
  id: string;
  type: Type;
  index: number;
  length: number;
  parent: GoBlock | GoRoot | GoMultiBlock;
}

export interface GoMultiBlock extends GoBaseNode<"double-block"> {
  blocks: (GoBlock | GoMultiBlock)[];
  keyword: GoBlockKeyword;
}

export type GoSharedDelimiter = "%" | "-" | "";
export type GoInlineStartDelimiter = "<" | "/*" | GoSharedDelimiter;
export type GoInlineEndDelimiter = ">" | "*/" | GoSharedDelimiter;

export interface GoUnformattable extends GoBaseNode<"unformattable"> {
  content: string;
}
