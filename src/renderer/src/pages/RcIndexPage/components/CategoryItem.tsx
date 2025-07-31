import { Loading } from '@renderer/components/Loading/Loading'
import {
  rcIndexAbi,
  rcIndexAddress,
  sequoiaRcIndexAbi,
  sequoiaRcIndexAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { useChainId, useReadContract } from 'wagmi'

interface Props {
  categoryId: number
}
export function CategoryItem({ categoryId }: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data: responseCategoryData, isLoading: isLoadingCategoryData } = useReadContract({
    address: chainId === 250225 ? rcIndexAddress : sequoiaRcIndexAddress,
    abi: chainId === 250225 ? rcIndexAbi : sequoiaRcIndexAbi,
    functionName: 'categories',
    args: [categoryId]
  })
  const categoryData = responseCategoryData as string[]

  const { data: responseIndexDescriptions, isLoading: isLoadingDescriptions } = useReadContract({
    address: chainId === 250225 ? rcIndexAddress : sequoiaRcIndexAddress,
    abi: chainId === 250225 ? rcIndexAbi : sequoiaRcIndexAbi,
    functionName: 'getCategoryRegenerationIndexDescription',
    args: [categoryId]
  })
  const indexDescriptions = responseIndexDescriptions as {
    regenerationIndexId: number
    description: string
  }[]

  if (isLoadingCategoryData) {
    return (
      <div className="flex flex-col p-3 rounded-2xl w-[400px] bg-card-2 items-center">
        <Loading />
      </div>
    )
  }
  if (!categoryData) return <div />

  return (
    <div className="flex flex-col p-3 rounded-2xl w-[400px] bg-card-2">
      <p className="font-bold text-white">
        #{categoryId} - {categoryData[1]}
      </p>
      <p className="text-white text-sm">{categoryData[2]}</p>

      <p className="text-xs text-gray-300 mt-3">{t('rcIndex.regenerationIndexDescription')}</p>
      {isLoadingDescriptions ? (
        <div className="flex w-full justify-center mt-1">
          <Loading />
        </div>
      ) : (
        <>
          <table className="bg-card-1 rounded-2xl mt-1">
            <thead>
              <tr className="border-b-2 text-white h-8 border-card-2">
                <th className="font-semibold text-sm border-r border-card-2 px-1">Index</th>
                <th className="font-semibold text-sm text-start pl-2 border-r border-card-2">
                  {t('rcIndex.description')}
                </th>
                <th className="font-semibold text-sm text-start pl-2">{t('rcIndex.result')}</th>
              </tr>
            </thead>
            <tbody>
              {indexDescriptions && (
                <>
                  {indexDescriptions.map((item, index) => (
                    <tr key={index} className="h-8 border-b border-card-2">
                      <td className="text-white text-xs border-r pl-2 border-card-2">
                        {item.regenerationIndexId}
                      </td>
                      <td className="text-white text-xs border-r pl-2 border-card-2">
                        {item.description}
                      </td>
                      <td className="text-white text-xs pl-2">
                        {indexToPts[item.regenerationIndexId]}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}

const indexToPts = {
  1: 'Regenerative 6 = 32 pts',
  2: 'Regenerative 5 = 16 pts',
  3: 'Regenerative 4 = 8 pts',
  4: 'Regenerative 3 = 4 pts',
  5: 'Regenerative 2 = 2 pts',
  6: 'Regenerative 1 = 1 pts',
  7: 'Neutro = 0 pts'
}
