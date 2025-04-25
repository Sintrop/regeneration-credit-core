import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectionWalletButton } from '../ConnectionWalletButton'
import { DeveloperCard } from './DeveloperCard'
import { useNavigate } from 'react-router-dom'
import { RegeneratorCard } from './RegeneratorCard'
import { InspectorCard } from './InspectorCard'
import { ResearcherCard } from './ResearcherCard'
import { ContributorCard } from './ContributorCard'
import { ActivistCard } from './ActivistCard'
import { SupporterCard } from './SupporterCard'
import { UserInvalidatedCard } from './UserInvalidatedCard'

export interface ContentCardProps {
  changeIndicator: (indicator: number) => void
}
interface Props {
  userType: number
  changeIndicator: (indicator: number) => void
}
export function UserCard({ userType, changeIndicator }: Props): JSX.Element {
  const { t } = useTranslation()

  if (userType === 0) {
    return (
      <CardContainer>
        <div className="flex flex-col gap-1 items-center">
          <p className="font-semibold text-white">{t('youAreNotRegistered')}</p>
          <ConnectionWalletButton />
        </div>
      </CardContainer>
    )
  }

  const CardContent = userTypeToCard[userType]

  return (
    <CardContainer>
      <CardContent changeIndicator={changeIndicator} />
    </CardContainer>
  )
}

interface CardContainerProps {
  children: ReactNode
}
function CardContainer({ children }: CardContainerProps): JSX.Element {
  const navigate = useNavigate()

  function handleGoToAccount(): void {
    navigate(`/account`)
  }
  return (
    <button
      className="flex gap-5 bg-container-primary rounded-2xl p-3 h-full min-w-[350px] max-w-[410px] hover:cursor-pointer"
      onClick={handleGoToAccount}
    >
      {children}
    </button>
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
  9: UserInvalidatedCard
}

export type UserCardContentType = keyof typeof userTypeToCard
