/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChangeEvent, useEffect, useState } from 'react'
import { ComponentProps, InputMethodAbiProps } from '@renderer/types/contract'
import { useTranslation } from 'react-i18next'

interface Props {
  args: InputMethodAbiProps[]
  setInputArgsToCall: (args: string[]) => void
}

interface ArgsInputProps {
  name: string
  value: string | string[] | number
}

export function HasArgsToCall({ args, setInputArgsToCall }: Props): JSX.Element {
  const [argsInput, setArgsInput] = useState<ArgsInputProps[]>([])

  function onChangeArgs(data: OnChangeArgProps): void {
    let newArgsInput: ArgsInputProps[] = []

    const excludeArg = argsInput.filter((item) => item.name !== data.arg.name)
    newArgsInput = excludeArg
    newArgsInput.push({
      name: data?.arg.name,
      value: data?.value
    })

    setArgsInput(newArgsInput)

    const argsToCall = []

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]
      const argInput = newArgsInput.find((item) => item.name === arg.name)
      //@ts-ignore
      if (argInput) argsToCall.push(argInput?.value)
    }

    setInputArgsToCall(argsToCall)
  }

  return (
    <div className="flex flex-col gap-3">
      {args.length > 0 && (
        <>
          {args.map((arg, index) => (
            <div key={index} className="flex gap-3">
              <p className="text-gray-300 mt-2">
                {arg?.name} ({arg?.type}):{' '}
              </p>

              <ArgItem arg={arg} onChange={onChangeArgs} argsInput={argsInput} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

interface OnChangeArgProps {
  arg: InputMethodAbiProps
  value: string | string[] | number
}

interface ArgItemProps {
  arg: InputMethodAbiProps
  onChange: ({ arg, value }: OnChangeArgProps) => void
  argsInput: ArgsInputProps[]
}

interface ArgTuppleDisplayProps {
  name: string
  value: string
}

function ArgItem({ arg, onChange, argsInput }: ArgItemProps): JSX.Element {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [argsTuppleDisplay, setArgsTuppleDisplay] = useState<ArgTuppleDisplayProps[][]>([])

  useEffect(() => {
    generateListTuppleArgs()
  }, [argsInput])

  function generateListTuppleArgs(): void {
    const argsDisplay: ArgTuppleDisplayProps[][] = []
    const findThisArg = argsInput.find((item) => item.name === arg.name && arg.type === 'tuple[]')
    if (!findThisArg) return

    const values = findThisArg.value as unknown as string[][]

    for (let i = 0; i < values.length; i++) {
      const arrayItem: ArgTuppleDisplayProps[] = []
      const value = values[i]
      for (let b = 0; b < value.length; b++) {
        if (arg.components) {
          arrayItem.push({
            name: arg.components[b].name,
            value: value[b]
          })
        }
      }
      argsDisplay.push(arrayItem)
    }
    setArgsTuppleDisplay(argsDisplay)
  }

  function onChangeInput(e: ChangeEvent<HTMLInputElement>): void {
    const inputValue = e.target.value
    console.log(inputValue)

    setValue(inputValue)
    onChange({ arg, value: arg?.internalType === 'uint256' ? parseInt(inputValue) : inputValue })
  }

  function handleAddArgsTupple(args: string[]): void {
    const findArgs = argsInput.find((item) => item.name === arg.name)
    let newArray: string[] = []
    if (findArgs) {
      newArray = findArgs.value as string[]
      //@ts-ignore
      newArray.push(args)
      onChange({ arg, value: newArray })
    } else {
      //@ts-ignore
      newArray.push(args)
      onChange({ arg, value: newArray })
    }
  }

  if (arg?.type === 'tuple[]') {
    return (
      <div className="flex flex-col w-full">
        {arg?.components && (
          <>
            <div className="flex flex-col gap-5">
              {argsTuppleDisplay.map((item, index) => (
                <div
                  className="flex flex-col gap-3 bg-container-secondary rounded-2xl p-3"
                  key={index}
                >
                  <p className="text-xs text-gray-300">
                    {arg?.name} {index + 1}
                  </p>
                  {item.map((field, key) => (
                    <div className="flex items-center gap-2" key={key}>
                      <p className="text-gray-300">{field.name}:</p>
                      <p className="text-white">{field.value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-white mt-5">{t('typeHereAndClickAddButtonToAddParameters')}</p>
            <ArgTuppleItem components={arg.components} addArgsTupple={handleAddArgsTupple} />
          </>
        )}
      </div>
    )
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

interface ArgTuppleProps {
  name: string
  value: string
}

interface ArgTuppleItemProps {
  components: ComponentProps[]
  addArgsTupple: (args: string[]) => void
}
function ArgTuppleItem({ components, addArgsTupple }: ArgTuppleItemProps): JSX.Element {
  const { t } = useTranslation()
  const [argsTupple, setArgsTupple] = useState<ArgTuppleProps[]>([])
  const [argsToCall, setArgsToCall] = useState<string[]>([])

  function onChangeInputComponent(data: OnChangeComponentProps): void {
    let newArgsTupple: ArgTuppleProps[] = argsTupple

    const excludeThisArg = argsTupple.filter((item) => item.name !== data.component.name)
    newArgsTupple = excludeThisArg
    newArgsTupple.push({
      name: data.component.name,
      value: data.value
    })
    setArgsTupple(newArgsTupple)

    const argsToCall: string[] = []
    for (let i = 0; i < components.length; i++) {
      const component = components[i]
      const argComponent = newArgsTupple.find((item) => item.name === component.name)
      if (argComponent) argsToCall.push(argComponent?.value)
    }

    setArgsToCall(argsToCall)
  }

  function handleAddParameters(): void {
    if (argsToCall.length !== components.length) {
      return
    }
    addArgsTupple(argsToCall)
  }

  return (
    <div className="flex flex-col gap-3">
      {components.map((field, index) => (
        <ComponentTupple field={field} key={index} onChange={onChangeInputComponent} />
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleAddParameters}
          className="px-10 w-fit h-10 rounded-2xl bg-green-btn font-semibold text-white hover:cursor-pointer"
        >
          {t('addParameters')}
        </button>
      </div>
    </div>
  )
}

interface OnChangeComponentProps {
  component: ComponentProps
  value: string
}

interface ComponentTuppleProps {
  field: ComponentProps
  onChange: ({ component, value }: OnChangeComponentProps) => void
}
function ComponentTupple({ field, onChange }: ComponentTuppleProps): JSX.Element {
  const [value, setValue] = useState('')

  function onChangeInput(e: ChangeEvent<HTMLInputElement>): void {
    setValue(e.target.value)
    onChange({ component: field, value: e.target.value })
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-white">
        {field.name} ({field.type}):
      </p>

      <input
        value={value}
        className="w-[80%] rounded-2xl px-3 bg-container-secondary text-white h-10"
        placeholder="typeHere"
        onChange={onChangeInput}
      />
    </div>
  )
}
