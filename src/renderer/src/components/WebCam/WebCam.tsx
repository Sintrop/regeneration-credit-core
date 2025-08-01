import { useRef, useState } from 'react'
import { Camera, CameraType } from 'react-camera-pro'
import { useTranslation } from 'react-i18next'

interface Props {
  imageTaken: (base64: string | ImageData) => void
}

export function WebCam({ imageTaken }: Props): JSX.Element {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const cameraRef = useRef<CameraType>()

  function closeCam(): void {
    setOpenModal(false)
  }

  function handleTakePicture(): void {
    if (!cameraRef.current) return
    const image = cameraRef.current.takePhoto()
    imageTaken(image)
    setOpenModal(false)
  }

  return (
    <div className="flex flex-col">
      <button
        className="rounded-2xl bg-blue-primary text-white font-semibold px-10 w-fit h-10 hover:cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        {t('register.useCamera')}
      </button>

      {openModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
            <div className="flex items-center justify-between w-full">
              <p className="">webcam</p>
              <button onClick={() => setOpenModal(false)}>X</button>
            </div>
            <div className="w-32 h-32 flex flex-col">
              <Camera ref={cameraRef} aspectRatio="cover" errorMessages={{}} />

              <div className="flex items-center gap-5 absolute bottom-36">
                <button
                  className="bg-gray-200 rounded-2xl px-10 h-10 font-semibold text-black hover:cursor-pointer"
                  onClick={closeCam}
                >
                  {t('register.cancel')}
                </button>

                <button
                  className="bg-blue-primary rounded-2xl px-10 h-10 font-semibold text-white hover:cursor-pointer"
                  onClick={handleTakePicture}
                >
                  {t('register.takePicture')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
