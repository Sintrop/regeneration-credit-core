import { useState, useEffect } from 'react'
import { ContractListProps, InputMethodAbiProps, MethodAbiProps } from '@renderer/types/contract'
import { useTranslation } from 'react-i18next'
import { ReadMethodContract } from './ReadMethodContract'
import { HasArgsToCall } from './HasArgsToCall'
import { WriteMethodContract } from './WriteMethodContract'

interface Props {
  method: MethodAbiProps
  contract: ContractListProps
}

export function MethodContent({ method, contract }: Props): JSX.Element {
  const { t } = useTranslation()
  const [methodType, setMethodType] = useState<'view' | 'function'>('view')
  const [hasArgsToCall, setHasArgsToCall] = useState(false)
  const [argsToCall, setArgsToCall] = useState<InputMethodAbiProps[]>([])
  const [showReadContract, setShowReadContract] = useState(false)
  const [showWriteContract, setShowWriteContract] = useState(false)
  const [inputArgs, setInputArgs] = useState<string[]>([])

  useEffect(() => {
    setDataMethod()
  }, [])

  function setDataMethod(): void {
    setMethodType(method?.stateMutability === 'view' ? 'view' : 'function')
    setHasArgsToCall(method.inputs.length > 0 ? true : false)
    setArgsToCall(method.inputs)
  }

  function handleSetInputArgsToCall(args: string[]): void {
    setShowReadContract(false)
    setShowWriteContract(false)
    setInputArgs(args)
  }

  function handleReadContract(): void {
    setShowReadContract(false)
    setTimeout(() => setShowReadContract(true), 100)
  }

  function handleWriteContract(): void {
    setShowWriteContract(false)
    setTimeout(() => setShowWriteContract(true), 100)
  }

  if (methodType === 'view') {
    return (
      <div className="flex flex-col mt-2 pt-3 border-t border-container-secondary">
        {hasArgsToCall && (
          <HasArgsToCall args={argsToCall} setInputArgsToCall={handleSetInputArgsToCall} />
        )}

        {showReadContract && (
          <ReadMethodContract args={inputArgs} contract={contract} method={method} />
        )}
        <button
          className="w-fit py-1 text-[#3B82F6] underline font-semibold mt-2 hover:cursor-pointer"
          onClick={handleReadContract}
        >
          {t('contracts.read')}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col mt-2 pt-3 border-t border-container-secondary">
      {hasArgsToCall && <HasArgsToCall args={argsToCall} setInputArgsToCall={setInputArgs} />}

      {showWriteContract && (
        <WriteMethodContract args={inputArgs} contract={contract} method={method} />
      )}

      <button
        className="w-fit py-1 text-[#3B82F6] underline font-semibold mt-2 hover:cursor-pointer"
        onClick={handleWriteContract}
      >
        {t('contracts.write')}
      </button>
    </div>
  )
}
