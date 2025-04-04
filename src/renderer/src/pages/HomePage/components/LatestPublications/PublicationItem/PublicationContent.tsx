interface Props {
  description?: string
  hashImage?: string
}

export function PublicationContent({ description, hashImage }: Props): JSX.Element {
  return (
    <div className="flex flex-col mt-3">
      {description && <p className="text-white">{description}</p>}

      {hashImage && (
        <div className="w-full h-[400px] rounded-2xl mt-1 bg-container-secondary">
          <img
            src={`https://ipfs.io/ipfs/${hashImage}`}
            alt="Publication"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}
    </div>
  )
}
