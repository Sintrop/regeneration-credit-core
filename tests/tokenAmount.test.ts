import { describe, expect, it } from 'vitest'
import {
  amountToWei,
  normalizeAmountInput,
  parseAmountInput,
  weiToInput
} from '@renderer/utils/tokenAmount'

describe('normalizeAmountInput', () => {
  it('reads pt and es amounts with dot thousands and comma decimals (issue #107)', () => {
    expect(normalizeAmountInput('10.000', 'pt')).toBe('10000')
    expect(normalizeAmountInput('1.234.567,89', 'pt')).toBe('1234567.89')
    expect(normalizeAmountInput('10,5', 'es')).toBe('10.5')
    expect(normalizeAmountInput('10000', 'pt')).toBe('10000')
  })

  it('reads en amounts with comma thousands and dot decimals', () => {
    expect(normalizeAmountInput('10,000', 'en')).toBe('10000')
    expect(normalizeAmountInput('10,000.25', 'en')).toBe('10000.25')
    expect(normalizeAmountInput('0.5', 'en')).toBe('0.5')
  })

  it('rejects malformed input', () => {
    expect(normalizeAmountInput('10.00', 'pt')).toBeNull()
    expect(normalizeAmountInput('1,2,3', 'pt')).toBeNull()
    expect(normalizeAmountInput('-5', 'en')).toBeNull()
    expect(normalizeAmountInput('abc', 'en')).toBeNull()
    expect(normalizeAmountInput('', 'en')).toBeNull()
  })
})

describe('amountToWei', () => {
  it('converts without floating point', () => {
    expect(amountToWei('0,1', 'pt')).toBe(100000000000000000n)
    expect(amountToWei('1.000.000', 'pt')).toBe(1000000000000000000000000n)
    expect(amountToWei('1.1234567890123456789', 'en')).toBeNull()
  })

  it('parses values for balance checks', () => {
    expect(parseAmountInput('2,5', 'pt')).toBe(2.5)
    expect(Number.isNaN(parseAmountInput('x', 'pt'))).toBe(true)
  })
})

describe('weiToInput', () => {
  it('writes the exact amount with the language separator and reads back to the same wei', () => {
    const wei = 1_234_567_890_000_000_000_123n
    expect(weiToInput(wei, 'pt')).toBe('1234,567890000000000123')
    expect(weiToInput(wei, 'en')).toBe('1234.567890000000000123')
    expect(amountToWei(weiToInput(wei, 'pt'), 'pt')).toBe(wei)
    expect(amountToWei(weiToInput(wei, 'en'), 'en')).toBe(wei)
    expect(weiToInput(5n * 10n ** 18n, 'pt')).toBe('5')
    expect(weiToInput(0n, 'pt')).toBe('')
  })
})
