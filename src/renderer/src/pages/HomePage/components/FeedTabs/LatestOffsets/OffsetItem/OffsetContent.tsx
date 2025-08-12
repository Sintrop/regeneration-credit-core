import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import RcImage from '@renderer/assets/images/rc.png'
import { useChainId, useReadContract } from 'wagmi'
import {
  researcherAbi,
  researcherAddress,
  sequoiaResearcherAbi,
  sequoiaResearcherAddress
} from '@renderer/services/contracts'
import { Loading } from '@renderer/components/Loading/Loading'
import { CalculatorItemProps } from '@renderer/types/researcher'

interface Props {
  burnedTokens?: string
  calculatorItemId?: string
}

export function OffsetContent({ burnedTokens, calculatorItemId }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? researcherAddress : sequoiaResearcherAddress,
    abi: chainId === 250225 ? researcherAbi : sequoiaResearcherAbi,
    functionName: 'getCalculatorItem',
    args: [calculatorItemId]
  })

  const calculatorItem = data as CalculatorItemProps

  return (
    <div className="flex flex-col mt-3">
      {burnedTokens && (
        <div className="flex items-center justify-between w-full">
          <p className="text-white font-bold">{t('burnedTokens')}</p>

          <div className="flex items-center gap-1">
            <p className="font-bold text-green-600">
              {Intl.NumberFormat('pt-BR').format(parseFloat(formatUnits(BigInt(burnedTokens), 18)))}
            </p>
            <img src={RcImage} alt="regeneration credit icon" className="w-5 h-5 object-contain" />
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <div className="mt-5 flex flex-col">
          <p className="text-gray-300 text-sm">{t('calculatorItem')}</p>
          <p className="text-white">
            ID: {calculatorItem && formatUnits(BigInt(calculatorItem?.id), 0)} -{' '}
            {calculatorItem?.item}
          </p>
        </div>
      )}
    </div>
  )
}
