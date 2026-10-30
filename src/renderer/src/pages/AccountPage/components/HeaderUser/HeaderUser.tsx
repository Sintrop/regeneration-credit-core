import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { toast } from 'react-toastify'

import BGFlorest from '@renderer/assets/images/bg-florest.jpg'
import { TransferModal } from '@renderer/components/TransferModal/TransferModal'
import { UserTypeToText } from '@renderer/components/UserTypeToText/UserTypeToText'
import { useUserContext } from '@renderer/hooks/useUserContext'
import { AddDelation } from '../AddDelation/AddDelation'
import { ProofPhoto } from '../ProofPhoto/ProofPhoto'
import { UpdateAreaPhoto } from '../RegeneratorData/UpdateAreaPhoto'

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

/** Banner, photo, name and type of a user, with transfer and report actions for visitors. */
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
  const { t } = useTranslation()
  const { address: connected } = useUserContext()
  const [transferring, setTransferring] = useState(false)
  const isOwn = !!connected && connected.toLowerCase() === address.toLowerCase()
  const canTransfer = !!connected && !isOwn

  function copyAddress(): void {
    navigator.clipboard.writeText(address)
    toast.success(t('common.addressCopied'))
  }

  return (
    <section className="w-full rounded-2xl bg-card-primary overflow-hidden">
      <div className="relative h-40">
        <img src={areaPhoto || BGFlorest} className="w-full h-full object-cover" />
        {canUpdateAreaPhoto && (
          <div className="absolute top-3 right-3">
            <UpdateAreaPhoto updated={areaPhotoUpdated} />
          </div>
        )}
      </div>

      <div className="px-6 pb-6 -mt-14 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-1 min-w-0">
          <ProofPhoto address={address} hash={proofPhoto} />
          <h2 className="mt-2 text-white text-2xl font-bold truncate">{name}</h2>
          <UserTypeToText
            userType={userType}
            className="text-green-primary text-sm font-semibold"
          />
          <button
            className="flex items-center gap-2 text-gray-300 text-sm hover:text-white hover:cursor-pointer"
            onClick={copyAddress}
            title={t('common.copyAddress')}
          >
            <span className="truncate">{address}</span>
            <FaRegCopy size={13} />
          </button>
          {description && <p className="mt-2 max-w-[640px] text-gray-300">{description}</p>}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {canTransfer && (
            <button
              className="h-10 px-5 rounded-xl bg-green-primary text-green-secondary text-sm font-bold hover:cursor-pointer"
              onClick={() => setTransferring(true)}
            >
              {t('profile.transferTo')}
            </button>
          )}
          {!isOwn && userType !== 7 && <AddDelation address={address} />}
        </div>
      </div>

      {transferring && (
        <TransferModal recipient={{ address, name }} onClose={() => setTransferring(false)} />
      )}
    </section>
  )
}
