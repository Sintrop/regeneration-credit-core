import { Abi } from 'viem'
import { useReadContracts } from 'wagmi'

import { checkVacancies } from '@renderer/services/checkVacancies'
import { userAbi, userAddress } from '@renderer/services/contracts'

const community = { address: userAddress as `0x${string}`, abi: userAbi as Abi }
/** CommunityRules.MAX_INVITER_PENALTIES */
const MAX_INVITER_PENALTIES = 5
const ZERO = /^0x0+$/

export interface RegistrationRequirements {
  isLoading: boolean
  needInvitation: boolean
  invitation?: { inviter: string; userType: number }
  /** CommunityRules._invitedTypeOnRegister: an invitation for exactly this type. */
  invitationOk: boolean
  inviterDenied: boolean
  inviterPenalties: number
  inviterOk: boolean
  /** CommunityRules._registrationProportionalityAllowed, mirrored by checkVacancies. */
  vacanciesOk: boolean
  vacancies?: number
  requirementsMet: boolean
}

/** What CommunityRules.addUser checks before a registration, read for the connected wallet. */
export function useRegistrationRequirements(
  address: string | undefined,
  userType: number
): RegistrationRequirements {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { ...community, functionName: 'getUserTypeSettings', args: [userType] },
      { ...community, functionName: 'getInvitation', args: [address] },
      { ...community, functionName: 'userTypesCount', args: [1] },
      { ...community, functionName: 'userTypesCount', args: [userType] }
    ],
    query: { enabled: !!address && userType > 0 }
  })
  const settings = data?.[0]?.result as { needInvitationOnRegister: boolean } | undefined
  const raw = data?.[1]?.result as
    | { inviter: string; userType: number; createdAtBlock: bigint }
    | undefined
  const invitation =
    raw && !ZERO.test(raw.inviter)
      ? { inviter: raw.inviter, userType: Number(raw.userType) }
      : undefined
  const inviter = invitation?.inviter

  const { data: inviterData } = useReadContracts({
    contracts: [
      { ...community, functionName: 'isDenied', args: [inviter] },
      { ...community, functionName: 'inviterPenalties', args: [inviter] }
    ],
    query: { enabled: !!inviter }
  })

  const needInvitation = !!settings?.needInvitationOnRegister
  const invitationOk =
    !needInvitation ||
    (!!raw && Number(raw.createdAtBlock) > 0 && Number(raw.userType) === userType)
  const inviterDenied = !!inviterData?.[0]?.result
  const inviterPenalties = Number(inviterData?.[1]?.result ?? 0)
  const inviterOk = !inviter || (!inviterDenied && inviterPenalties < MAX_INVITER_PENALTIES)
  const typeCount = data?.[3]?.result
  const vacancyCheck =
    typeCount !== undefined
      ? checkVacancies({
          producersCount: Number(data?.[2]?.result ?? 0),
          userType,
          userTypeCount: Number(typeCount)
        })
      : undefined
  const vacanciesOk = vacancyCheck ? vacancyCheck.availableVacancie : false

  return {
    isLoading,
    needInvitation,
    invitation,
    invitationOk,
    inviterDenied,
    inviterPenalties,
    inviterOk,
    vacanciesOk,
    vacancies: vacancyCheck?.ammount,
    requirementsMet: !isLoading && !!settings && invitationOk && inviterOk && vacanciesOk
  }
}
