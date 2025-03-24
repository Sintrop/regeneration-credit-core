import { Header } from '@renderer/components/Header/Header'
import { contractsSequoia } from '@renderer/services/contracts'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { MethodItem } from './components/MethodItem'
import { SideMenu } from '@renderer/components/SideMenu/SideMenu'
import { PageTitle } from '@renderer/components/PageTitle/PageTitle'

export function ContractPage(): JSX.Element {
  const params = useParams()
  const chainId = useChainId()
  const [contractData, setContractData] = useState<ContractListProps>({} as ContractListProps)
  const [methods, setMethods] = useState<MethodAbiProps[]>([])

  useEffect(() => {
    handleGetContractData()
  }, [params])

  function handleGetContractData(): void {
    if (chainId === 1600) {
      const contract = contractsSequoia.find((contract) => contract.address === params.address)
      if (contract) {
        setContractData(contract)
        setMethods(contract?.abi)
      }
    }
  }

  return (
    <>
      <Header />

      <main className="bg-gradient-to-b from-[#043832] to-[#1F5D38] flex w-screen h-screen overflow-y-auto">
        <SideMenu />

        <div className="flex flex-col pl-[330px] py-30 gap-10">
          <PageTitle title={contractData?.name as string} />
          <div className="flex flex-col w-full">
            <p className="text-gray-300">{contractData?.description}</p>

            <div className="flex flex-col gap-5 mt-10">
              {methods.map((method, index) => (
                <MethodItem key={index} method={method} contract={contractData} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
