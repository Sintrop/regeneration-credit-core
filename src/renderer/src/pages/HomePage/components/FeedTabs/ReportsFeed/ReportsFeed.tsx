import {
  developerAbi,
  developerAddress,
  sequoiaDeveloperAbi,
  sequoiaDeveloperAddress
} from '@renderer/services/contracts'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import { useChainId, useReadContract } from 'wagmi'
import { ReportFeedItem } from './ReportFeedItem/ReportFeedItem'
import { Loading } from '@renderer/components/Loading/Loading'
import { useNavigate } from 'react-router-dom'

export function ReportsFeed(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const navigate = useNavigate()

  const { data, isLoading } = useReadContract({
    address: chainId === 250225 ? developerAddress : sequoiaDeveloperAddress,
    abi: chainId === 250225 ? developerAbi : sequoiaDeveloperAbi,
    functionName: 'reportsTotalCount',
    args: []
  })

  let reportsIds: number[] = []

  if (data) {
    const count = parseInt(formatUnits(BigInt(data as string), 0))

    const ids = Array.from({ length: count }, (_, i) => i + 1)
    reportsIds = ids.reverse()
  }

  function handleGoToReports(): void {
    navigate('/development')
  }

  return (
    <div className="bg-card-2 rounded-2xl w-full">
      <div className="flex items-center justify-center h-10 border-b border-green-900 bg-card-1 rounded-t-2xl">
        <p className="text-sm text-green-1 mb-1">{t('feed.reports')}</p>
      </div>

      {isLoading ? (
        <div className="w-[350px] my-5 flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {reportsIds.length === 0 ? (
            <div className="items-center my-10 w-[350px]">
              <p className="text-white text-center">{t('feed.noReports')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              {reportsIds.slice(0, 3).map((item) => (
                <ReportFeedItem id={item} key={item} />
              ))}
            </div>
          )}

          {reportsIds.length > 3 && (
            <div className="flex items-center justify-center h-8 mt-3 border-t border-green-900 bg-card-1 rounded-b-2xl">
              <button
                className="text-green-500 underline hover:cursor-pointer text-start w-fit"
                onClick={handleGoToReports}
              >
                {t('feed.seeMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
