/** UTF-8 byte length: Solidity checks bytes(text).length, so "ç" counts as 2 and an emoji as 4. */
export function utf8ByteLength(text: string): number {
  let bytes = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    if (code <= 0x7f) bytes += 1
    else if (code <= 0x7ff) bytes += 2
    else if (code <= 0xffff) bytes += 3
    else bytes += 4
  }
  return bytes
}

export function fitsBytes(text: string, maxBytes: number): boolean {
  return utf8ByteLength(text) <= maxBytes
}

/** Cuts text to at most maxBytes UTF-8 bytes without splitting a character. */
export function clampToBytes(text: string, maxBytes: number): string {
  let bytes = 0
  let result = ''
  for (const char of text) {
    const size = utf8ByteLength(char)
    if (bytes + size > maxBytes) break
    bytes += size
    result += char
  }
  return result
}
