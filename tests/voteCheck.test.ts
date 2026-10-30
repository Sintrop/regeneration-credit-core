import { describe, expect, it } from 'vitest'

import { voteBlockFromRevert } from '../src/renderer/src/services/votes/voteCheck'

describe('voteBlockFromRevert', () => {
  it('maps the validation revert strings of the contracts', () => {
    expect(voteBlockFromRevert('Not a voter user')).toBe('notVoter')
    expect(voteBlockFromRevert('Not a voter')).toBe('notVoter')
    expect(voteBlockFromRevert('Wait timeBetweenVotes')).toBe('wait')
    expect(voteBlockFromRevert('Already voted')).toBe('alreadyVoted')
    expect(voteBlockFromRevert('Research not VALID')).toBe('votingClosed')
    expect(voteBlockFromRevert('This contribution is not VALID')).toBe('votingClosed')
    expect(voteBlockFromRevert("Can't validade anymore")).toBe('votingClosed')
    expect(voteBlockFromRevert('Penalties already applied')).toBe('alreadyInvalidated')
    expect(voteBlockFromRevert('Supporter validation not allowed')).toBe('supporter')
    expect(voteBlockFromRevert('User already denied')).toBe('userDenied')
    expect(voteBlockFromRevert('Regenerator has reached validation immunity')).toBe('immune')
  })

  it('tells a denied voter apart from a denied target', () => {
    expect(voteBlockFromRevert('User denied')).toBe('voterDenied')
    expect(voteBlockFromRevert('User already denied')).toBe('userDenied')
  })

  it('falls back to unknown', () => {
    expect(voteBlockFromRevert('execution reverted')).toBe('unknown')
  })
})
