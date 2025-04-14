import LoaderImage from '@renderer/assets/images/loader.png'

interface Props {
  size?: number
}

export function Loading({ size = 80 }: Props): JSX.Element {
  return (
    <div>
      <img
        src={LoaderImage}
        className="animate-spin object-contain"
        style={{ width: size, height: size }}
      />
    </div>
  )
}
