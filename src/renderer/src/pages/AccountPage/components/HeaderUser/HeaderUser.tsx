import BGFlorest from '@renderer/assets/images/bg-florest.jpg'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UpdateAreaPhoto } from '../RegeneratorData/UpdateAreaPhoto'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'

interface Props {
  address: string
  name: string
  userType: number
  description?: string
  proofPhoto?: string
  canUpdateAreaPhoto?: boolean
  areaPhotoUpdated: () => void
  areaPhoto?: string
}

export function HeaderUser({
  address,
  areaPhotoUpdated,
  areaPhoto,
  name,
  userType,
  description,
  proofPhoto,
  canUpdateAreaPhoto
}: Props): JSX.Element {
  return (
    <div className="flex flex-col w-full max-w-[1024px] rounded-2xl bg-green-card">
      <div className="flex w-full h-[150px] relative">
        <img src={BGFlorest} className="w-full h-full object-cover rounded-t-2xl z-0" />
        {areaPhoto && (
          <img
            src={areaPhoto}
            className="w-full h-full object-cover rounded-t-2xl absolute top-0 left-0"
          />
        )}
      </div>
      <div className="p-3 flex flex-col mt-[-80px] relative">
        <ProofPhoto address={address} hash={proofPhoto} />
        <p className="text-white mt-2">{address}</p>
        <div className="flex gap-2">
          <p className="text-white font-bold">{name}</p>
          <p className="text-gray-300">-</p>
          <UserTypeToText userType={userType} className="text-gray-300" />
        </div>
        {description && <p className="text-gray-300 mt-2">{description}</p>}

        <div className="absolute top-8 right-3">
          {canUpdateAreaPhoto && <UpdateAreaPhoto updated={areaPhotoUpdated} />}
        </div>
      </div>
    </div>
  )
}
