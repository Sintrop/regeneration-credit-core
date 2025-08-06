import { useChainId, useReadContract } from 'wagmi'
import { ContributionCertificate } from './ContributionCertificate/ContributionCertificate'
import { rcAbi, rcAddress, sequoiaRcAbi, sequoiaRcAddress } from '@renderer/services/contracts'
import { formatUnits } from 'viem'
import { useTranslation } from 'react-i18next'
import { RegeneratorCertificate } from './RegeneratorCertificate/RegeneratorCertificate'
import { useEffect, useState } from 'react'

interface Props {
  address: string
  name?: string
  userType: number
  proofPhoto?: string
  totalInspections?: number
  totalArea?: number
  score?: number
}

export function CertificatesCard({
  address,
  name,
  userType,
  proofPhoto,
  score,
  totalArea,
  totalInspections
}: Props): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { data } = useReadContract({
    address: chainId === 250225 ? rcAddress : sequoiaRcAddress,
    abi: chainId === 250225 ? rcAbi : sequoiaRcAbi,
    functionName: 'certificate',
    args: [address]
  })

  const certificate = data as string
  const formatedCertificate = certificate ? formatUnits(BigInt(certificate), 18) : '0'

  const [urlQrCode, setUrlQrCode] = useState('')

  useEffect(() => {
    createUrlUserPage()
  }, [])

  function createUrlUserPage(): void {
    const baseUrlUsersPage =
      chainId === 250225
        ? import.meta.env.VITE_USERS_PAGE_URL
        : import.meta.env.VITE_SEQUOIA_USERS_PAGE_URL
    const nameFormated = name?.toLowerCase().replace(' ', '-')
    const url = `${baseUrlUsersPage}/${
      userType === 1 ? 'regenerator' : 'supporter'
    }/${address}/${nameFormated}`
    setUrlQrCode(url)
  }

  if (userType === 7) {
    return (
      <div className="mt-5">
        <ContributionCertificate
          certificateTokens={formatedCertificate}
          name={name}
          address={address}
          url={urlQrCode}
        />
      </div>
    )
  }

  if (userType === 1) {
    return (
      <div className="flex flex-col p-3 rounded-2xl bg-green-card gap-1">
        <p className="text-gray-300 text-sm">{t('certificate')}</p>

        <RegeneratorCertificate
          address={address}
          name={name}
          proofPhoto={proofPhoto}
          score={score}
          totalArea={totalArea}
          totalInspections={totalInspections}
          url={urlQrCode}
        />
      </div>
    )
  }

  return <div></div>
}
