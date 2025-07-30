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

interface Props {
  address: string
  profilePage?: boolean
}

export function ValidationsCard({ address, profilePage }: Props): JSX.Element {
  const { t } = useTranslation()
  const { currentEra } = useEra()

  const [era, setEra] = useState(0)

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

  const validationsCount = data ? formatUnits(BigInt(data as string), 0) : 0

  return (
    <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1">
      <p className="text-gray-300 text-sm">{t('validations')}</p>
      <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />

      {isLoading ? (
        <div className="overflow-hidden">
          <Loading size={50} />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="w-34 h-16 rounded-2xl flex flex-col items-center justify-center bg-container-primary">
            <p className="font-bold text-white text-xl">{validationsCount}</p>
            <p className="text-gray-300 text-xs">{t('validationsReceived')}</p>
          </div>

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
