import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectionWalletButton } from '../ConnectionWalletButton'
import { DeveloperCard } from './DeveloperCard'
import { RegeneratorCard } from './RegeneratorCard'
import { InspectorCard } from './InspectorCard'
import { ResearcherCard } from './ResearcherCard'
import { ContributorCard } from './ContributorCard'
import { ActivistCard } from './ActivistCard'
import { SupporterCard } from './SupporterCard'
import { UserInvalidatedCard } from './UserInvalidatedCard'
import { LogoutButton } from '../LogoutButton'

export interface ContentCardProps {
  setLastPublishedWork: (block: number) => void
}
interface Props {
  userType: number
  setLastPublishedWork: (block: number) => void
}
export function UserCard({ userType, setLastPublishedWork }: Props): JSX.Element {
  const { t } = useTranslation()

  if (userType === 0) {
    return (
      <CardContainer>
        <div className="flex flex-col gap-1 items-center">
          <p className="font-semibold text-white">{t('actionBar.youAreNotRegistered')}</p>
          <ConnectionWalletButton />
        </div>
      </CardContainer>
    )
  }

  const CardContent = userTypeToCard[userType as UserCardContentType]

  return (
    <CardContainer>
      <CardContent setLastPublishedWork={setLastPublishedWork} />
    </CardContainer>
  )
}

interface CardContainerProps {
  children: ReactNode
}
function CardContainer({ children }: CardContainerProps): JSX.Element {
  return (
    <div className="flex gap-5 bg-container-primary rounded-2xl p-3 h-full relative">
      {children}

      <div className="absolute top-0 right-0">
        <LogoutButton />
      </div>
    </div>
  )
}

const userTypeToCard = {
  1: RegeneratorCard,
  2: InspectorCard,
  3: ResearcherCard,
  4: DeveloperCard,
  5: ContributorCard,
  6: ActivistCard,
  7: SupporterCard,
  8: UserInvalidatedCard
}

export type UserCardContentType = keyof typeof userTypeToCard
