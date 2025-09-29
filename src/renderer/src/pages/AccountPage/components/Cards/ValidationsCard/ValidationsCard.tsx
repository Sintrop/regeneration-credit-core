import { useEffect, useState } from 'react'
import { Loading } from '@renderer/components/Loading/Loading'
import { useEra } from '@renderer/hooks/useEra'
import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'
import { EraSelector } from '@renderer/components/EraSelector/EraSelector'
import { formatUnits } from 'viem'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { useUserValidations } from '@renderer/domain/Validation/events/useUserValidations'
import { UserValidationProps } from '@renderer/domain/Validation/types'
import { User } from '@renderer/components/User/User'

interface Props {
  address: string
  profilePage?: boolean
}

export function ValidationsCard({ address, profilePage }: Props): JSX.Element {
  const { t } = useTranslation()
  const { currentEra } = useEra()
  const [era, setEra] = useState(0)
  const { validations } = useUserValidations({ userAddress: address, era })

  useEffect(() => {
    setEra(currentEra)
  }, [currentEra])

  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? validationAddress : sequoiaValidationAddress,
    abi: chainId === 250225 ? validationAbi : sequoiaValidationAbi,
    functionName: 'getUserValidations',
    args: [address, era]
  })

  const validationsCount = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1">
      <p className="text-gray-300 text-sm">{t('account.validations')}</p>
      <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />

      {isLoading ? (
        <div className="overflow-hidden">
          <Loading size={50} />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-34 h-16 rounded-2xl flex flex-col items-center justify-center bg-container-primary">
            <p className="font-bold text-white text-xl">{validationsCount}</p>
            <p className="text-gray-300 text-xs">{t('account.validationsReceived')}</p>
          </div>

          {validationsCount > 0 && (
            <div className="flex flex-col mt-3">
              <div className="flex flex-col gap-3">
                {validations.map((item, index) => (
                  <ValidationItem key={index} validation={item} />
                ))}
              </div>
            </div>
          )}

          {!profilePage && (
            <div className="w-full mt-5">
              <VoteToInvalidate resourceType="user" userWallet={address} wFull />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ValidationItemProps {
  validation: UserValidationProps
}

function ValidationItem({ validation }: ValidationItemProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1 bg-container-primary rounded-2xl p-3">
      <User address={validation.validatorAddress} />
      <p className="text-gray-300 text-xs">{t('common.justification')}</p>
      <p className="text-white text-sm">{validation.justification}</p>
    </div>
  )
}
