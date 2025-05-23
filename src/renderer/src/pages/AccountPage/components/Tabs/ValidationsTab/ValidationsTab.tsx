import { useEffect, useState } from 'react'
import { Loading } from '@renderer/components/Loading/Loading'
import { useEra } from '@renderer/hooks/useEra'
import {
  sequoiaValidationAbi,
  sequoiaValidationAddress,
  validationAbi,
  validationAddress
} from '@renderer/services/contracts'
import { ValidationProps } from '@renderer/types/validation'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'
import { ValidationUserItem } from './ValidationUserItem'
import { EraSelector } from '@renderer/components/EraSelector/EraSelector'

interface Props {
  address: string
}

export function ValidationsTab({ address }: Props): JSX.Element {
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

  const validations = data as ValidationProps[]

  if (validations) {
    return (
      <div className="flex flex-col mt-5">
        <EraSelector currentEra={currentEra} onChange={setEra} selectedEra={era} />

        {isLoading ? (
          <div className="mx-auto overflow-hidden">
            <Loading />
          </div>
        ) : (
          <>
            {validations.length === 0 ? (
              <div className="">
                <p className="text-white text-center">{t('noValidationsInThisEra')}</p>
              </div>
            ) : (
              <>
                {validations.map((item) => (
                  <ValidationUserItem key={item.validator} validation={item} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    )
  }

  return <div />
}
