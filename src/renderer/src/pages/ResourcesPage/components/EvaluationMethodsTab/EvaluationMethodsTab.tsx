import { useTranslation } from 'react-i18next'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Abi } from 'viem'
import { useReadContract } from 'wagmi'

import { UserBadge } from '@renderer/components/UserBadge/UserBadge'
import { researcherAbi, researcherAddress } from '@renderer/services/contracts'

const contract = { address: researcherAddress as `0x${string}`, abi: researcherAbi as Abi }

interface EvaluationMethod {
  title: string
  research: string
  projectURL: string
  createdBy: string
  createdAtBlock: bigint
}

function MethodCard({ id }: { id: number }): JSX.Element {
  const { t, i18n } = useTranslation()
  const { data, isLoading } = useReadContract({
    ...contract,
    functionName: 'evaluationMethods',
    args: [BigInt(id)]
  })

  if (isLoading || !data) return <div className="h-48 rounded-2xl bg-card-primary animate-pulse" />

  const [, createdBy, title, research, projectURL, createdAtBlock] = data as unknown as [
    bigint,
    string,
    string,
    string,
    string,
    bigint
  ]
  const method: EvaluationMethod = { title, research, projectURL, createdBy, createdAtBlock }

  return (
    <article className="p-6 rounded-2xl bg-card-primary flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-primary/20 text-green-primary">
          {t('resources.evaluationMethod')} #{id}
        </span>
        <span className="text-gray-400 text-xs">
          {t('myTokens.block', {
            block: Intl.NumberFormat(i18n.language).format(Number(method.createdAtBlock))
          })}
        </span>
      </div>
      <h3 className="text-white text-xl font-bold">{method.title}</h3>
      <p className="text-gray-200 leading-relaxed whitespace-pre-line">{method.research}</p>
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-card-secondary">
        <UserBadge address={method.createdBy} label={t('resourcesList.publishedBy')} />
        {method.projectURL && (
          <a
            href={method.projectURL}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-4 rounded-xl border border-green-primary/50 text-green-primary text-sm font-semibold flex items-center gap-2 hover:bg-green-primary/10"
          >
            {t('resources.openProject')}
            <FaExternalLinkAlt size={11} />
          </a>
        )}
      </div>
    </article>
  )
}

/** Evaluation methods registered in ResearcherRules, newest first. */
export function EvaluationMethodsTab(): JSX.Element {
  const { t } = useTranslation()
  const { data, isLoading } = useReadContract({
    ...contract,
    functionName: 'evaluationMethodsCount'
  })
  const count = Number(data ?? 0)
  const ids = Array.from({ length: count }, (_, index) => count - index)

  if (isLoading) return <div className="h-48 rounded-2xl bg-card-primary animate-pulse" />

  return (
    <div className="flex flex-col gap-4">
      <p className="text-gray-300 text-sm">{t('resources.evaluationMethodsHint')}</p>
      {ids.length === 0 ? (
        <p className="p-8 rounded-2xl bg-card-primary text-center text-gray-300">
          {t('resources.noMethodsRegistered')}
        </p>
      ) : (
        ids.map((id) => <MethodCard key={id} id={id} />)
      )}
    </div>
  )
}
