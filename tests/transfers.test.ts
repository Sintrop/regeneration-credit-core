import { describe, expect, it } from 'vitest'

import * as C from '@renderer/services/contracts'
import { classifyTransfer } from '@renderer/services/myTokens/transfersService'

const me = '0xAbC0000000000000000000000000000000000001'
const other = '0x0000000000000000000000000000000000000002'

describe('classifyTransfer', () => {
  it('tells sends, receives, burns and pool withdrawals apart', () => {
    expect(classifyTransfer(me, other, me.toLowerCase())).toEqual({ kind: 'send' })
    expect(classifyTransfer(other, me, me)).toEqual({ kind: 'receive' })
    expect(classifyTransfer(me, '0x0000000000000000000000000000000000000000', me)).toEqual({
      kind: 'burn'
    })
    expect(classifyTransfer(C.researcherPoolAddress, me, me)).toEqual({
      kind: 'poolWithdraw',
      poolType: 3
    })
  })
})
