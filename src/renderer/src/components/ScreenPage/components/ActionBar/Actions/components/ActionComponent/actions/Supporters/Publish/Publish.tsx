/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAllowance } from '@renderer/domain/Supporter/useCases/useAllowance'
import { Approve } from './Approve'
import { Content } from './Content'
import { Loading } from '@renderer/components/Loading/Loading'

export function Publish(): JSX.Element {
  const { tokensAllowed, isLoading: isLoadingAllowance, refetch } = useAllowance()

  if (isLoadingAllowance) {
    return (
      <div className="flex w-full h-[300px] items-center justify-center">
        <Loading size={100} />
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-5">
      {tokensAllowed === 0 ? (
        <Approve refetchAllowance={refetch} />
      ) : (
        <Content tokensAllowed={tokensAllowed} refecthAllowance={refetch} />
      )}
    </div>
  )
}
