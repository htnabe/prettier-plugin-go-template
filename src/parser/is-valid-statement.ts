type State = "normal" | "inDouble" | "inRaw";

/**
 * Validates the content of a Go template action statement (inside `{{ ... }}`).
 * Returns false when it contains an unterminated double-quoted (") or raw (`) string literal.
 */
export function isValidStatement(statement: string): boolean {
  let state: State = "normal";
  let backslashCount = 0;

  // Iterate through each character in the statement
  for (const char of statement) {
    // Update the state based on the current character
    if (state === "normal") {
      if (char === '"') {
        state = "inDouble";
      } else if (char === "`") {
        state = "inRaw";
      } else {
        continue;
      }
    } else if (state === "inRaw") {
      if (char === "`") {
        state = "normal";
      } else {
        continue;
      }
    } else if (state === "inDouble") {
      if (char === '"') {
        if (backslashCount % 2 === 0) {
          state = "normal";
        }
      }
      backslashCount = char === "\\" ? backslashCount + 1 : 0;
    }
  }

  // check the state
  return state === "normal";
}
