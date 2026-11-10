export function toPlainText(markdown: string) {
  return markdown
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, "")
    .replace(/^\s*\|(.*)\|\s*$/gm, (_, row: string) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .join("    "),
    )
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\*\*(.+?)\*\*|__(.+?)__/g, "$1$2")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1$2")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/→/g, "->")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
