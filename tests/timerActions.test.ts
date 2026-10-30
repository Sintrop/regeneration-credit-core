import { describe, expect, it } from 'vitest'

import * as C from '@renderer/services/contracts'
import { timerRows } from '@renderer/services/timers/timerActions'
import { UserTimer } from '@renderer/services/timers/userTimers'
import { blocksToDuration } from '@renderer/utils/blocksToDuration'

const available = (key: UserTimer['key']): UserTimer => ({ key, status: 'available' })

describe('timerRows', () => {
  it('opens the publish and invite modals on the researcher contract', () => {
    const rows = timerRows([available('publishResearch'), available('invite')], 3)
    expect(rows.map((row) => row.target)).toMatchObject([
      { type: 'modal', actionName: 'addResearch', addressContract: C.researcherAddress },
      {
        type: 'modal',
        actionName: 'invite',
        addressContract: C.researcherAddress,
        userTypeToInvite: 3
      }
    ])
  })

  it('splits the activist regenerator/inspector invite into two rows', () => {
    const rows = timerRows([available('inviteRegeneratorInspector'), available('invite')], 6)
    expect(
      rows.map((row) => [
        row.id,
        row.label,
        row.target?.type === 'modal' && row.target.userTypeToInvite
      ])
    ).toEqual([
      ['inviteRegenerator', 'actions.inviteRegenerator', 1],
      ['inviteInspector', 'actions.inviteInspector', 2],
      ['invite', 'actions.inviteActivist', 6]
    ])
  })

  it('sends inspection requests and supporter actions to the right contracts', () => {
    const [request] = timerRows([available('requestInspection')], 1)
    expect(request.target).toMatchObject({
      actionName: 'requestInspection',
      addressContract: C.inspectionAddress
    })

    const [offset, invite] = timerRows([available('offset'), available('invite')], 7)
    expect(offset.target).toMatchObject({ actionName: 'offsetting', addressContract: C.rcAddress })
    expect(invite).toMatchObject({
      label: 'timers.actions.inviteSupporter',
      target: { addressContract: C.invitationAddress, userTypeToInvite: 7 }
    })
  })

  it('routes actions that need an item picked first', () => {
    expect(timerRows([available('acceptInspection')], 2)[0].target).toEqual({
      type: 'route',
      path: '/inspections'
    })
    expect(timerRows([available('vote')], 4)[0].target).toEqual({
      type: 'route',
      path: '/resources?type=report'
    })
    expect(timerRows([available('vote')], 5)[0].target).toEqual({
      type: 'route',
      path: '/resources?type=contribution'
    })
  })

  it('withdraws from the user type contract', () => {
    const [row] = timerRows([available('withdraw')], 2)
    expect(row.target).toMatchObject({
      actionName: 'withdraw',
      addressContract: C.inspectorAddress
    })
  })
})

describe('blocksToDuration', () => {
  it('picks the largest unit at 13 s per block', () => {
    expect(blocksToDuration(600)).toEqual({ value: 2, unit: 'hours' })
    expect(blocksToDuration(100000)).toEqual({ value: 15, unit: 'days' })
    expect(blocksToDuration(1)).toEqual({ value: 1, unit: 'minutes' })
  })
})
