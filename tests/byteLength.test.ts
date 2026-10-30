import { describe, expect, it } from 'vitest'
import { clampToBytes, fitsBytes, utf8ByteLength } from '@renderer/utils/byteLength'

describe('utf8ByteLength', () => {
  it('counts bytes the way Solidity bytes(text).length does (issue #125)', () => {
    expect(utf8ByteLength('abc')).toBe(3)
    expect(utf8ByteLength('ção')).toBe(5)
    expect(utf8ByteLength('🌱')).toBe(4)
    expect(fitsBytes('ação', 6)).toBe(true)
    expect(fitsBytes('ação', 5)).toBe(false)
  })
})

describe('clampToBytes', () => {
  it('cuts at the byte limit without splitting a character', () => {
    expect(clampToBytes('abcdef', 4)).toBe('abcd')
    expect(clampToBytes('ação', 3)).toBe('aç')
    expect(clampToBytes('a🌱', 4)).toBe('a')
  })
})
