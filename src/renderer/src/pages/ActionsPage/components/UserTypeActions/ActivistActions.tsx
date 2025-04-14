import {
  activistAbi,
  activistAddress,
  sequoiaActivistAbi,
  sequoiaActivistAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'
import { ActionComponent } from '../ActionComponent/ActionComponent'
import { Abi } from 'viem'

export function ActivistActions(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()

  const activistContractAddressToUse = chainId === 250225 ? activistAddress : sequoiaActivistAddress
  const activistAbiToUse = chainId === 250225 ? activistAbi : sequoiaActivistAbi

  return (
    <div className="flex flex-col">
      <p className="text-white">{t('activistActions')}</p>

      <ActionComponent
        actionName="withdraw"
        addressContract={activistContractAddressToUse}
        abi={activistAbiToUse as Abi}
      />
    </div>
  )
}
