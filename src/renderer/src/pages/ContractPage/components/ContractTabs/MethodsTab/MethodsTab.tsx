import { useEffect, useState } from 'react'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { MethodItem } from '../../MethodItem/MethodItem'

interface Props {
  contract: ContractListProps
}

export function MethodsTab({ contract }: Props): JSX.Element {
  const [methods, setMethods] = useState<MethodAbiProps[]>([])

  useEffect(() => {
    if (contract?.abi) setMethods(contract.abi)
  }, [contract])

  return (
    <div className="">
      <div className="flex flex-col mt-10">
        {methods.length > 0 && (
          <>
            {methods.map((method, index) => (
              <MethodItem key={index} method={method} contract={contract} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
