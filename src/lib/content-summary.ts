export function getLeadSentence(content: string): string {
  const sentenceEnd = content.search(/[.!?](?:\s|$)/);
  if (sentenceEnd === -1) return content;
  return content.slice(0, sentenceEnd + 1);
}

/**
 * The rest of `content` after the lead sentence, empty when there is nothing
 * left. Pairs with getLeadSentence so a page that puts the lead in its hero can
 * render the remainder in the body without repeating that first sentence.
 */
export function getBodyAfterLead(content: string): string {
  const lead = getLeadSentence(content);
  return content.slice(lead.length).trim();
}
