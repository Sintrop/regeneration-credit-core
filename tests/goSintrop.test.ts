import { describe, expect, it } from 'vitest'

import { extractCommands, nodeCommand, pickReleaseAsset } from '@renderer/utils/goSintrop'

describe('go-sintrop helpers', () => {
  it('fills the reward address in the official start command, with double quotes for every shell', () => {
    const command = nodeCommand('windows', '0xAbC')
    expect(command.startsWith('.\\geth.exe ')).toBe(true)
    expect(command).toContain('--syncmode "full"')
    expect(command).toContain('--networkid 250225')
    expect(command).toContain('--miner.etherbase=0xAbC')
  })

  it('unpacks on Unix and lifts the quarantine only on macOS', () => {
    expect(extractCommands('windows', 'a.zip')).toEqual([])
    expect(extractCommands('ubuntu', 'a.zip')).not.toContain('xattr -d com.apple.quarantine geth')
    expect(extractCommands('macos', 'a.zip')).toContain('xattr -d com.apple.quarantine geth')
  })

  it('picks the zip for the system', () => {
    const assets = [
      { name: 'go-sintrop-linux-v1.zip', browser_download_url: 'l' },
      { name: 'go-sintrop-win64-v1.zip', browser_download_url: 'w' }
    ]
    expect(pickReleaseAsset(assets, 'windows')?.browser_download_url).toBe('w')
    expect(pickReleaseAsset(assets, 'macos')).toBeUndefined()
  })
})
