## Project Structure

Modular core under [`src/`](../../src/):

| Path                                 | Role                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| [`src/index.ts`](../../src/index.ts) | Plugin entrypoint; exports `languages`, `options`, `parsers`, and `printers`       |
| [`src/config/`](../../src/config/)   | Plugin constants, language registration, and user option definitions               |
| [`src/parser/`](../../src/parser/)   | Parser orchestration (`parsers.ts`) and regex AST builder (`parse-go-template.ts`) |
| [`src/printer/`](../../src/printer/) | Printer orchestration (`printers.ts`) and printer helper utilities                 |
| [`src/types/`](../../src/types/)     | AST and option types (`src/types/ast/ast.ts`, guards, parser-option interfaces)    |
| [`src/utils/`](../../src/utils/)     | Shared utility helpers such as ULID ID generation and collection helpers           |
| [`src/tests/`](../../src/tests/)     | Auto-discovered fixture tests for formatting behavior                              |

## Formatting Flow

Parser in [`src/parser/parse-go-template.ts`](../../src/parser/parse-go-template.ts) builds aliased AST.
Printer `embed()` in [`src/printer/printers.ts`](../../src/printer/printers.ts) maps IDs back to formatted children through Prettier HTML.
The final document output is emitted from that formatted tree.
