#!/usr/bin/env node
"use strict";

// PostToolUse hook: when a TypeScript source file or package.json is edited,
// inject a reminder to keep AGENTS.md current.

const chunks = [];
process.stdin.on("data", (d) => chunks.push(d));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString());
    const toolInput = data.toolInput || {};

    // Collect all file paths that were touched by this tool call.
    const filePaths = [];
    if (typeof toolInput.filePath === "string") {
      filePaths.push(toolInput.filePath);
    }
    if (Array.isArray(toolInput.replacements)) {
      for (const r of toolInput.replacements) {
        if (typeof r.filePath === "string") filePaths.push(r.filePath);
      }
    }

    const srcPattern = /(?:^|\/)src\/[^/].*\.ts$|(?:^|\/)package\.json$/;
    if (filePaths.some((fp) => srcPattern.test(fp))) {
      process.stdout.write(
        JSON.stringify({
          systemMessage:
            "You edited a source file. Before ending your turn, review AGENTS.md and update it if commands, architecture, plugin options, or pitfalls have changed. Outdated documentation is treated as a bug.",
        }),
      );
    }
  } catch (_) {
    // Non-fatal: silently ignore parse errors so normal agent flow is unblocked.
  }
});
