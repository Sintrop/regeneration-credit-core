/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Loading } from '@renderer/components/Loading/Loading'
import { useAllowance } from '@renderer/domain/Supporter/useCases/useAllowance'

import { Approve } from '../Approve'
import { SelectItem } from './SelectItem'
import { useState } from 'react'

interface Props {
  close: () => void
}
export function Offsetting({ close }: Props): JSX.Element {
  const { tokensAllowed, isLoading: isLoadingAllowance, refetch } = useAllowance()
  const [approveMore, setApproveMore] = useState(false)

  function handleApproveMore(): void {
    setApproveMore(true)
  }

  function handleCloseApproveMore(): void {
    setApproveMore(false)
  }

  function handleRefetchTokensAllowed(): void {
    handleCloseApproveMore()
    refetch()
  }

  if (isLoadingAllowance) {
    return (
      <div className="flex w-full h-[300px] items-center justify-center">
        <Loading size={100} />
      </div>
    )
  }

  return (
    <div className="flex flex-col pt-5">
      {approveMore ? (
        <Approve refetchAllowance={handleRefetchTokensAllowed} />
      ) : (
        <>
          {tokensAllowed === 0 ? (
            <Approve refetchAllowance={handleRefetchTokensAllowed} />
          ) : (
            <SelectItem
              tokensAllowed={tokensAllowed}
              refecthAllowance={handleRefetchTokensAllowed}
              handleApproveMore={handleApproveMore}
              close={close}
            />
          )}
        </>
      )}
    </div>
  )
}
