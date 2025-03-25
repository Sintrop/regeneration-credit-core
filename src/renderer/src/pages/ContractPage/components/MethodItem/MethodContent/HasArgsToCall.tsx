import { InputMethodAbiProps } from '@renderer/types/contract'
import { ChangeEvent, useState } from 'react'

interface Props {
  args: InputMethodAbiProps[]
  setInputArgsToCall: (args: string[]) => void
}

interface ArgsInputProps {
  name: string
  value: string
}

export function HasArgsToCall({ args, setInputArgsToCall }: Props): JSX.Element {
  const [argsInput, setArgsInput] = useState<ArgsInputProps[]>([])

  function onChangeArgs(data: OnChangeArgProps): void {
    let newArgsInput: ArgsInputProps[] = []

    const excludeArg = argsInput.filter((item) => item.name !== data.arg.name)
    newArgsInput = excludeArg
    newArgsInput.push({
      name: data?.arg.name,
      value: data.value
    })

    setArgsInput(newArgsInput)

    let argsToCall: string[] = []

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      const argInput = newArgsInput.find((item) => item.name === arg.name)
      if (argInput) argsToCall.push(argInput?.value)
    }

    setInputArgsToCall(argsToCall)
  }

  return (
    <div className="flex flex-col gap-3">
      {args.length > 0 && (
        <>
          {args.map((arg, index) => (
            <div key={index} className="flex items-center gap-3">
              <p className="text-gray-300">
                {arg?.name} ({arg?.type}):{' '}
              </p>

              <ArgItem arg={arg} onChange={onChangeArgs} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

interface OnChangeArgProps {
  arg: InputMethodAbiProps
  value: string
}

interface ArgItemProps {
  arg: InputMethodAbiProps
  onChange: ({ arg, value }: OnChangeArgProps) => void
}

function ArgItem({ arg, onChange }: ArgItemProps): JSX.Element {
  const [value, setValue] = useState('')

  function onChangeInput(e: ChangeEvent<HTMLInputElement>): void {
    const inputValue = e.target.value

    setValue(inputValue)
    onChange({ arg, value: inputValue })
  }

  return (
    <input
      value={value}
      className="w-[80%] rounded-2xl px-3 bg-container-secondary text-white h-10"
      placeholder="typeHere"
      onChange={onChangeInput}
    />
  )
}
