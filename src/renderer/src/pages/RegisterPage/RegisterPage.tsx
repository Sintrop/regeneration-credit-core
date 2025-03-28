import { useState } from 'react'
import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { Jazzicon } from '@ukstv/jazzicon-react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { sequoiaUserAbi, sequoiaUserAddress } from '@renderer/services/contracts'

export function RegisterPage(): JSX.Element {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address } = useAccount()
  const [name, setName] = useState('')
  const [userType, setUserType] = useState('1')

  const { data } = useReadContract({
    address: chainId === 1600 ? sequoiaUserAddress : sequoiaUserAddress,
    abi: chainId === 1600 ? sequoiaUserAbi : sequoiaUserAbi,
    functionName: 'getUser',
    args: [address]
  })

  const userTypeWalletConnected = data as number

  return (
    <ScreenPage pageTitle={t('register')}>
      <div className="flex flex-col">
        {userTypeWalletConnected}
        <p className="text-gray-300 text-sm">{t('walletConnected')}</p>
        <div className="flex items-center gap-5 px-5 py-2 rounded-2xl bg-container-secondary w-fit">
          <Jazzicon className="w-10 h-10" address={address as string} />
          <p className="text-white">{address}</p>
        </div>

        <p className="text-gray-300 text-sm mt-10">{t('yourName')}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[450px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
          placeholder={t('typeHere')}
        />

        <p className="text-gray-300 text-sm mt-10">{t('selectUserType')}</p>
        <select
          className="w-[450px] h-10 rounded-2xl bg-container-secondary px-5 text-white"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value={1}>{t('regenerator')}</option>
          <option value={2}>{t('inspector')}</option>
          <option value={3}>{t('researcher')}</option>
          <option value={4}>{t('developer')}</option>
          <option value={5}>{t('contributor')}</option>
          <option value={6}>{t('activist')}</option>
          <option value={7}>{t('supporter')}</option>
        </select>

        {userType !== '7' && (
          <div className="flex flex-col">
            <p className="text-gray-300 text-sm mt-10">{t('proofPhoto')}</p>
            <input 
              type="file"
              onChange={(e) => console.log(e.target.files)}  
            />
          </div>
        )}
      </div>
    </ScreenPage>
  )
}
