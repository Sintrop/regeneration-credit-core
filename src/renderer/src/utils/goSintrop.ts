export type NodeOs = 'windows' | 'ubuntu' | 'macos'

export const GO_SINTROP_RELEASES_URL = 'https://github.com/Sintrop/go-sintrop/releases/latest'
export const SINTROP_TUTORIALS_URL = 'https://www.sintrop.com/tutorials'

/** ContributorRules contribution #1: "Sintrop node and solo mining guide on Ubuntu". */
export const MINING_GUIDE_CONTRIBUTION_ID = 1

/** Release file per system (go-sintrop publishes geth alone, plus an "alltools" bundle). */
const ASSET_PREFIX: Record<NodeOs, string> = {
  windows: 'go-sintrop-win64-',
  ubuntu: 'go-sintrop-linux-',
  macos: 'go-sintrop-osx-'
}

export interface ReleaseAsset {
  name: string
  browser_download_url: string
}

export function pickReleaseAsset(assets: ReleaseAsset[], os: NodeOs): ReleaseAsset | undefined {
  return assets.find(
    (asset) => asset.name.startsWith(ASSET_PREFIX[os]) && asset.name.endsWith('.zip')
  )
}

/** Official go-sintrop start command (sintrop.com/tutorials, "How to run a Sintrop node") with the reward address filled in. */
export function nodeCommand(os: NodeOs, address: string): string {
  const binary = os === 'windows' ? '.\\geth.exe' : './geth'
  const etherbase = address || '0x0000000000000000000000000000000000000000'
  return `${binary} --identity Sintrop --datadir ./sintrop_node --sintrop --syncmode "full" --networkid 250225 --cache=1024 --port 25225 --http.vhosts=* --http.addr "0.0.0.0" --http.port 8545 --http=true --miner.threads=1 --miner.etherbase=${etherbase} console`
}

/** Terminal commands to unpack the release. The zip already stores geth as executable. */
export function extractCommands(os: NodeOs, assetName: string): string[] {
  if (os === 'windows') return []
  const commands = ['cd ~/Downloads', `unzip ${assetName} -d go-sintrop`, 'cd go-sintrop']
  // geth is only ad-hoc signed, so Gatekeeper blocks the browser-downloaded copy until the quarantine is lifted.
  if (os === 'macos') commands.push('xattr -d com.apple.quarantine geth')
  return commands
}
