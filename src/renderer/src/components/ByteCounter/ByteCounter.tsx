import { utf8ByteLength } from '@renderer/utils/byteLength'

interface Props {
  text: string
  max: number
}

/** Bytes used out of the contract limit; accents and emoji take more than one byte each. */
export function ByteCounter({ text, max }: Props): JSX.Element {
  const used = utf8ByteLength(text)
  return (
    <p className={`text-xs text-right mt-1 ${used >= max ? 'text-amber-300' : 'text-gray-400'}`}>
      {used}/{max}
    </p>
  )
}
