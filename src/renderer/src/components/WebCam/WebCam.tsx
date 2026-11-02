import { useRef, useState } from 'react'
import { Camera, CameraType } from 'react-camera-pro'
import { useTranslation } from 'react-i18next'

import { Modal } from '@renderer/components/Modal/Modal'

interface Props {
  imageTaken: (base64: string | ImageData) => void
}

export function WebCam({ imageTaken }: Props): JSX.Element {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const cameraRef = useRef<CameraType>()

  function handleTakePicture(): void {
    if (!cameraRef.current) return
    imageTaken(cameraRef.current.takePhoto())
    setOpenModal(false)
  }

  return (
    <div className="flex flex-col">
      <button
        className="h-10 px-5 w-fit rounded-xl bg-blue-primary text-white text-sm font-semibold hover:cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        {t('register.useCamera')}
      </button>

      {openModal && (
        <Modal
          title={t('register.useCamera')}
          onClose={() => setOpenModal(false)}
          width="w-[520px]"
        >
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <Camera ref={cameraRef} aspectRatio="cover" errorMessages={{}} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="h-11 rounded-xl border border-green-primary text-green-primary font-semibold hover:cursor-pointer"
                onClick={() => setOpenModal(false)}
              >
                {t('register.cancel')}
              </button>
              <button
                className="h-11 rounded-xl bg-green-primary text-green-secondary font-bold hover:cursor-pointer"
                onClick={handleTakePicture}
              >
                {t('register.takePicture')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
