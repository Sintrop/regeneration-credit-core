import { useEffect, useState } from 'react'
import { Loading } from '@renderer/components/Loading/Loading'
import { useEra } from '@renderer/hooks/useEra'
import { validationAbi, validationAddress } from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useReadContract } from 'wagmi'
import { EraSelector } from '@renderer/components/EraSelector/EraSelector'
import { formatUnits } from 'viem'
import { VoteToInvalidate } from '@renderer/components/VoteToInvalidate/VoteToInvalidate'
import { useUserValidations } from '@renderer/domain/Validation/events/useUserValidations'
import { UserValidationProps } from '@renderer/domain/Validation/types'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'

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

  const { data, isLoading } = useReadContract({
    address: validationAddress,
    abi: validationAbi,
    functionName: 'getUserValidations',
    args: [address, era]
  })

  const validationsCount = data ? parseInt(formatUnits(BigInt(data as string), 0)) : 0

  return (
    <section className="flex flex-col gap-3 p-5 rounded-2xl bg-card-primary">
      <p className="text-white font-bold">{t('account.validations')}</p>
      <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />

      {isLoading ? (
        <div className="overflow-hidden">
          <Loading size={50} />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="p-4 rounded-xl bg-card-secondary">
            <p className="font-bold text-white text-2xl">{validationsCount}</p>
            <p className="text-gray-400 text-xs">{t('account.validationsReceived')}</p>
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
    </section>
  )
}

interface ValidationItemProps {
  validation: UserValidationProps
}

function ValidationItem({ validation }: ValidationItemProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2 bg-card-secondary rounded-xl p-3">
      <UserBadge address={validation.validatorAddress} />
      <p className="text-gray-300 text-xs">{t('common.justification')}</p>
      <p className="text-white text-sm">{validation.justification}</p>
    </div>
  )
}
