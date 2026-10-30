const LABEL_PREFIX =
  /^(t[íi]tulo|title|thesis|tese|descri[çc][ãa]o|description|resumo|summary)\b[\s:-]*/i
const LANGUAGE_PREFIX = /^(en|pt|es)\s+(?=[A-Z])/i
const HEADING_MAX_LENGTH = 70

/** Strips markdown headings, leading field labels ("Descrição:") and language codes ("EN ") from on-chain text. */
export function cleanResourceText(text?: string): string {
  return (text ?? '')
    .replace(/^#+\s*/gm, '')
    .replace(LABEL_PREFIX, '')
    .replace(LANGUAGE_PREFIX, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Uses the title when the resource has one, otherwise the start of its description. */
export function resourceHeading(title: string | undefined, body: string | undefined): string {
  const cleanTitle = cleanResourceText(title)
  if (cleanTitle) return cleanTitle

  const cleanBody = cleanResourceText(body)
  return cleanBody.length > HEADING_MAX_LENGTH
    ? `${cleanBody.slice(0, HEADING_MAX_LENGTH).trimEnd()}…`
    : cleanBody
}
