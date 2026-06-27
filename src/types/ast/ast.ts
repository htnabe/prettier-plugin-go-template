export type GoSharedDelimiter = "%" | "-" | "";
export type GoInlineStartDelimiter = "<" | "/*" | GoSharedDelimiter;
export type GoInlineEndDelimiter = ">" | "*/" | GoSharedDelimiter;

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

export interface GoBaseNode<Type extends string> {
  id: string;
  type: Type;
  index: number;
  length: number;
  parent: GoBlock | GoRoot | GoMultiBlock;
}

/**
 * Carries explicit start/end delimiter variants used by Go template statements.
 */
export interface WithDelimiter {
  startDelimiter: GoInlineStartDelimiter;
  endDelimiter: GoInlineEndDelimiter;
}

export interface GoInline extends GoBaseNode<"inline">, WithDelimiter {
  statement: string;
}

/**
 * Represents raw regions that must be preserved as-is and skipped by formatting.
 */
export interface GoUnformattable extends GoBaseNode<"unformattable"> {
  content: string;
}

export interface GoBlock extends GoBaseNode<"block">, WithDelimiter {
  keyword: GoBlockKeyword;
  /** Child nodes keyed by generated node id for stable alias replacement. */
  children: {
    [id: string]: GoNode;
  };
  start: GoInline;
  end: GoInline | null;
  content: string;
  /**
   * Content with child nodes replaced by ids so HTML formatting can run first,
   * then children can be re-injected from the map.
   */
  aliasedContent: string;
  contentStart: number;
}

/**
 * Groups related branch blocks (for example, if/else chains) as a single node.
 */
export interface GoMultiBlock extends GoBaseNode<"double-block"> {
  blocks: (GoBlock | GoMultiBlock)[];
  keyword: GoBlockKeyword;
}

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

export type GoNode =
  | GoRoot
  | GoBlock
  | GoInline
  | GoMultiBlock
  | GoUnformattable;
