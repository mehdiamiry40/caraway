export function getLeadSentence(content: string): string {
  const sentenceEnd = content.search(/[.!?](?:\s|$)/);
  if (sentenceEnd === -1) return content;
  return content.slice(0, sentenceEnd + 1);
}
