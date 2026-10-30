import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MdBlock } from 'react-icons/md'
import { toast } from 'react-toastify'
import { Abi } from 'viem'
import { useAccount, useWaitForTransactionReceipt } from 'wagmi'

import { ByteCounter } from '@renderer/components/ByteCounter/ByteCounter'
import { Loading } from '@renderer/components/Loading/Loading'
import { Modal } from '@renderer/components/Modal/Modal'
import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { TransactionLoading } from '@renderer/components/TransactionLoading/TransactionLoading'
import { useSettingsContext } from '@renderer/hooks/useSettingsContext'
import { useWriteContract } from '@renderer/hooks/useSintropTransaction'
import { checkVote, VOTE_TARGETS, VoteKind } from '@renderer/services/votes/voteCheck'
import { clampToBytes } from '@renderer/utils/byteLength'
import { SendTransactionButton } from '../ScreenPage/components/ActionBar/Actions/components/SendTransactionButton/SendTransactionButton'

/** Contracts cap the justification at 300 bytes (MAX_JUSTIFICATION_LENGTH / MAX_TEXT_LENGTH). */
const MAX_JUSTIFICATION = 300

const COPY: Record<VoteKind, { title: string; target: string; done: string }> = {
  user: {
    title: 'vote.voteUser',
    target: 'vote.youAreVotingToInvalidateTheUser',
    done: 'vote.votedUser'
  },
  research: {
    title: 'vote.voteResearch',
    target: 'vote.youAreVotingToInvalidateTheResearch',
    done: 'vote.votedResearch'
  },
  contribution: {
    title: 'vote.voteContribution',
    target: 'vote.youAreVotingToInvalidateTheContribution',
    done: 'vote.votedContribution'
  },
  report: {
    title: 'vote.voteReport',
    target: 'vote.youAreVotingToInvalidateTheReport',
    done: 'vote.votedReport'
  },
  inspection: {
    title: 'vote.voteInspection',
    target: 'vote.youAreVotingToInvalidateTheInspection',
    done: 'vote.votedInspection'
  }
}

interface Props {
  kind: VoteKind
  target: string | number
  close: () => void
}

/** Invalidation vote: the contract is asked first, so the modal only offers a vote it would accept. */
export function VoteModal({ kind, target, close }: Props): JSX.Element {
  const { t } = useTranslation()
  const { rpcUrl } = useSettingsContext()
  const { address } = useAccount()
  const [justification, setJustification] = useState('')
  const [displayLoadingTx, setDisplayLoadingTx] = useState(false)
  const copy = COPY[kind]

  const { data: check, isLoading: checking } = useQuery({
    queryKey: ['voteCheck', kind, String(target), address, rpcUrl],
    queryFn: () => checkVote(rpcUrl, kind, address as `0x${string}`, target),
    enabled: !!address && !!rpcUrl
  })

  const { writeContract, isPending, data: hash, error, isError } = useWriteContract()
  const {
    isLoading,
    isSuccess,
    isError: isErrorTx,
    error: errorTx
  } = useWaitForTransactionReceipt({ hash })
  const errorMessage = error ? error.message : errorTx ? errorTx.message : ''

  function vote(): void {
    if (!justification.trim()) return
    const { address: contract, abi, functionName } = VOTE_TARGETS[kind]
    setDisplayLoadingTx(true)
    writeContract({
      address: contract as `0x${string}`,
      abi: abi as Abi,
      functionName,
      args: [kind === 'user' ? target : BigInt(target), justification]
    })
  }

  function success(): void {
    setDisplayLoadingTx(false)
    toast(t(copy.done), { type: 'success' })
    close()
  }

  return (
    <Modal title={<>{t(copy.title)}</>} onClose={close}>
      {!address ? (
        <Blocked text={t('vote.connectToVote')} />
      ) : checking || !check ? (
        <div className="h-[160px] flex items-center justify-center overflow-hidden">
          <Loading size={60} />
        </div>
      ) : !check.ok ? (
        <Blocked
          text={t(`vote.block.${check.block}`, {
            blocks: Intl.NumberFormat().format(check.waitBlocks)
          })}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-gray-300 text-sm">
            {t(copy.target)}
            {kind !== 'user' && <span className="text-white font-semibold"> #{target}</span>}
          </p>
          {kind === 'user' && (
            <div className="p-3 rounded-xl bg-card-secondary">
              <UserBadge address={String(target)} />
            </div>
          )}
          <p className="text-gray-400 text-xs">{t('vote.permanentHint')}</p>

          <label className="text-gray-300 text-sm mt-3">{t('common.justification')}</label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(clampToBytes(e.target.value, MAX_JUSTIFICATION))}
            placeholder={t('common.typeHere')}
            rows={3}
            className="w-full rounded-xl bg-card-secondary p-3 text-white text-sm resize-none"
          />
          <ByteCounter text={justification} max={MAX_JUSTIFICATION} />

          <SendTransactionButton
            label={t('vote.vote')}
            handleSendTransaction={vote}
            disabled={!justification.trim() || isLoading || isPending}
          />
        </div>
      )}

      {displayLoadingTx && (
        <TransactionLoading
          close={() => setDisplayLoadingTx(false)}
          ok={success}
          isError={isError || isErrorTx}
          isPending={isPending}
          isSuccess={isSuccess}
          loading={isLoading}
          errorMessage={errorMessage}
          transactionHash={hash}
        />
      )}
    </Modal>
  )
}

function Blocked({ text }: { text: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <MdBlock className="text-gray-400" size={36} />
      <p className="text-white text-sm max-w-[360px]">{text}</p>
    </div>
  )
}
