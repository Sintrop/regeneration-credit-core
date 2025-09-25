import { CommunityIcon } from '@renderer/assets/icon/CommunityIcon'
import { ComputerIcon } from '@renderer/assets/icon/ComputerIcon'
import { ContractsIcon } from '@renderer/assets/icon/ContractsIcon'
import { ContributionsIcon } from '@renderer/assets/icon/ContributionsIcon'
import { DashboardIcon } from '@renderer/assets/icon/DashboardIcon'
import { DevelopmentIcon } from '@renderer/assets/icon/DevelopmentIcon'
import { ImpactCalculatorIcon } from '@renderer/assets/icon/ImpactCalculator'
import { InspectionIcon } from '@renderer/assets/icon/InspectionIcon'
import { IpfsIcon } from '@renderer/assets/icon/IpfsIcon'
import { MyTokensIcon } from '@renderer/assets/icon/MyTokensIcon'
import { PoolsIcon } from '@renderer/assets/icon/PoolsIcon'
import { RcIcon } from '@renderer/assets/icon/RcIcon'
import { RcIndexIcon } from '@renderer/assets/icon/RcIndex'
import { RcStatsIcon } from '@renderer/assets/icon/RcStatsIcon'
import { ResearchesIcon } from '@renderer/assets/icon/ResearchesIcon'

interface Props {
  name: IconName
  size?: number
  color?: string
}

export function Icon({ name, color, size }: Props): JSX.Element {
  const Icon = icons[name]
  return <Icon size={size} color={color} />
}

const icons = {
  community: CommunityIcon,
  contracts: ContractsIcon,
  contributions: ContributionsIcon,
  computer: ComputerIcon,
  development: DevelopmentIcon,
  dashboard: DashboardIcon,
  inspections: InspectionIcon,
  ipfs: IpfsIcon,
  myTokens: MyTokensIcon,
  rcStats: RcStatsIcon,
  researches: ResearchesIcon,
  pools: PoolsIcon,
  impactCalculator: ImpactCalculatorIcon,
  rcIndex: RcIndexIcon,
  rc: RcIcon
}

export type IconName = keyof typeof icons
export interface IconBaseProps {
  size?: number
  color?: string
}
