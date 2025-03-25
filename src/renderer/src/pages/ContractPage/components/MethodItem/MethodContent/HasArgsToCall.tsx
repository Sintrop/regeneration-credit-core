import { InputMethodAbiProps } from '@renderer/types/contract'

interface Props {
  args: InputMethodAbiProps[]
}

export function HasArgsToCall({ args }: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {args.length > 0 && (
        <>
          {args.map((arg, index) => (
            <div key={index} className="flex items-center gap-3">
              <p className="text-gray-300">
                {arg?.name} ({arg?.type}):{' '}
              </p>

              <ArgItem arg={arg} onChange="" />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

interface ArgItemProps {
  arg: InputMethodAbiProps
  onChange: string
}
function ArgItem({ }: ArgItemProps): JSX.Element {
  return (
    <input
      className="w-[80%] rounded-2xl px-3 bg-container-secondary text-white h-10"
      placeholder="typeHere"
    />
  )
}
