import LoaderImage from '@renderer/assets/images/loader.png'

export function Loading(): JSX.Element {
  return (
    <div>
      <img src={LoaderImage} className="w-20 h-20 animate-spin object-contain" />
    </div>
  )
}
