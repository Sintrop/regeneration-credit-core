//mainnet imports
import RcTokenContract from '../../../data/abis/mainnet/RegenerationCredit.json'
import RcImpactContract from '../../../data/abis/mainnet/RegenerationCreditImpact.json'
import UserContract from '../../../data/abis/mainnet/CommunityRules.json'
import RegeneratorContract from '../../../data/abis/mainnet/RegeneratorRules.json'
import RegeneratorPoolContract from '../../../data/abis/mainnet/RegeneratorPool.json'
import InspectorContract from '../../../data/abis/mainnet/InspectorRules.json'
import InspectorPoolContract from '../../../data/abis/mainnet/InspectorPool.json'
import ResearcherContract from '../../../data/abis/mainnet/ResearcherRules.json'
import ResearcherPoolContract from '../../../data/abis/mainnet/ResearcherPool.json'
import DeveloperContract from '../../../data/abis/mainnet/DeveloperRules.json'
import DeveloperPoolContract from '../../../data/abis/mainnet/DeveloperPool.json'
import ContributorContract from '../../../data/abis/mainnet/ContributorRules.json'
import ContributorPoolContract from '../../../data/abis/mainnet/ContributorPool.json'
import ActivistContract from '../../../data/abis/mainnet/ActivistRules.json'
import ActivistPoolContract from '../../../data/abis/mainnet/ActivistPool.json'
import SupporterContract from '../../../data/abis/mainnet/SupporterRules.json'
import InspectionContract from '../../../data/abis/mainnet/InspectionRules.json'
import InvitationContract from '../../../data/abis/mainnet/InvitationRules.json'
import VoteContract from '../../../data/abis/mainnet/VoteRules.json'
import ValidationContract from '../../../data/abis/mainnet/ValidationRules.json'
import ValidationPoolContract from '../../../data/abis/mainnet/ValidationPool.json'
import RcIndexContract from '../../../data/abis/mainnet/RegenerationIndexRules.json'

import { ContractListProps } from '@renderer/types/contract'

//Address contracts
export const rcAddress = import.meta.env.VITE_RC_ADDRESS
export const rcImpactAddress = import.meta.env.VITE_RC_IMPACT_ADDRESS
export const userAddress = import.meta.env.VITE_COMMUNITY_ADDRESS
export const regeneratorAddress = import.meta.env.VITE_REGENERATOR_ADDRESS
export const regeneratorPoolAddress = import.meta.env.VITE_REGENERATOR_POOL_ADDRESS
export const inspectorAddress = import.meta.env.VITE_INSPECTOR_ADDRESS
export const inspectorPoolAddress = import.meta.env.VITE_INSPECTOR_POOL_ADDRESS
export const researcherAddress = import.meta.env.VITE_RESEARCHER_ADDRESS
export const researcherPoolAddress = import.meta.env.VITE_RESEARCHER_POOL_ADDRESS
export const developerAddress = import.meta.env.VITE_DEVELOPER_ADDRESS
export const developerPoolAddress = import.meta.env.VITE_DEVELOPER_POOL_ADDRESS
export const contributorAddress = import.meta.env.VITE_CONTRIBUTOR_ADDRESS
export const contributorPoolAddress = import.meta.env.VITE_CONTRIBUTOR_POOL_ADDRESS
export const activistAddress = import.meta.env.VITE_ACTIVIST_ADDRESS
export const activistPoolAddress = import.meta.env.VITE_ACTIVIST_POOL_ADDRESS
export const supporterAddress = import.meta.env.VITE_SUPPORTER_ADDRESS
export const inspectionAddress = import.meta.env.VITE_INSPECTION_ADDRESS
export const invitationAddress = import.meta.env.VITE_INVITATION_ADDRESS
export const voteAddress = import.meta.env.VITE_VOTE_ADDRESS
export const validationAddress = import.meta.env.VITE_VALIDATION_ADDRESS
export const validationPoolAddress = import.meta.env.VITE_VALIDATION_POOL_ADDRESS
export const rcIndexAddress = import.meta.env.VITE_RC_INDEX_ADDRESS

export const supporterPoolAddress = import.meta.env.VITE_RC_ADDRESS

//Abis contracts
export const rcAbi = RcTokenContract.abi
export const rcImpactAbi = RcImpactContract.abi
export const userAbi = UserContract.abi
export const regeneratorAbi = RegeneratorContract.abi
export const regeneratorPoolAbi = RegeneratorPoolContract.abi
export const inspectorAbi = InspectorContract.abi
export const inspectorPoolAbi = InspectorPoolContract.abi
export const researcherAbi = ResearcherContract.abi
export const researcherPoolAbi = ResearcherPoolContract.abi
export const developerAbi = DeveloperContract.abi
export const developerPoolAbi = DeveloperPoolContract.abi
export const contributorAbi = ContributorContract.abi
export const contributorPoolAbi = ContributorPoolContract.abi
export const activistAbi = ActivistContract.abi
export const activistPoolAbi = ActivistPoolContract.abi
export const supporterAbi = SupporterContract.abi
export const inspectionAbi = InspectionContract.abi
export const invitationAbi = InvitationContract.abi
export const voteAbi = VoteContract.abi
export const validationAbi = ValidationContract.abi
export const rcIndexAbi = RcIndexContract.abi
export const validationPoolAbi = ValidationPoolContract.abi

export const contractsMainnet: ContractListProps[] = [
  {
    abi: rcAbi,
    address: rcAddress,
    name: RcTokenContract.contractName,
    label: 'contracts.regenerationCredit',
    description: 'contracts.descRegenerationCredit'
  },
  {
    abi: rcImpactAbi,
    address: rcImpactAddress,
    name: RcImpactContract.contractName,
    label: 'contracts.rcImpact',
    description: 'contracts.descRcImpact'
  },
  {
    abi: regeneratorAbi,
    address: regeneratorAddress,
    name: RegeneratorContract.contractName,
    label: 'contracts.regenerator',
    description: 'contracts.descRegenerator'
  },
  {
    abi: regeneratorPoolAbi,
    address: regeneratorPoolAddress,
    name: RegeneratorPoolContract.contractName,
    label: 'contracts.regeneratorPool',
    description: 'contracts.descRegeneratorPool'
  },
  {
    abi: inspectorAbi,
    address: inspectorAddress,
    name: InspectorContract.contractName,
    label: 'contracts.inspector',
    description: 'contracts.descInpector'
  },
  {
    abi: inspectorPoolAbi,
    address: inspectorPoolAddress,
    name: InspectorPoolContract.contractName,
    label: 'contracts.inspectorPool',
    description: 'contracts.descInspectorPool'
  },
  {
    abi: researcherAbi,
    address: researcherAddress,
    name: ResearcherContract.contractName,
    label: 'contracts.researcher',
    description: 'contracts.descResearcher'
  },
  {
    abi: researcherPoolAbi,
    address: researcherPoolAddress,
    name: ResearcherPoolContract.contractName,
    label: 'contracts.researcherPool',
    description: 'contracts.descResearcherPool'
  },
  {
    abi: developerAbi,
    address: developerAddress,
    name: DeveloperContract.contractName,
    label: 'contracts.developer',
    description: 'contracts.descDeveloper'
  },
  {
    abi: developerPoolAbi,
    address: developerPoolAddress,
    name: DeveloperPoolContract.contractName,
    label: 'contracts.developerPool',
    description: 'contracts.descDeveloperPool'
  },
  {
    abi: contributorAbi,
    address: contributorAddress,
    name: ContributorContract.contractName,
    label: 'contracts.contributor',
    description: 'contracts.descContributor'
  },
  {
    abi: contributorPoolAbi,
    address: contributorPoolAddress,
    name: ContributorPoolContract.contractName,
    label: 'contracts.contributorPool',
    description: 'contracts.descContributorPool'
  },
  {
    abi: activistAbi,
    address: activistAddress,
    name: ActivistContract.contractName,
    label: 'contracts.activist',
    description: 'contracts.descActivist'
  },
  {
    abi: activistPoolAbi,
    address: activistPoolAddress,
    name: ActivistPoolContract.contractName,
    label: 'contracts.activistPool',
    description: 'contracts.descActivistPool'
  },
  {
    abi: supporterAbi,
    address: supporterAddress,
    name: SupporterContract.contractName,
    label: 'contracts.supporter',
    description: 'contracts.descSupporter'
  },
  {
    abi: inspectionAbi,
    address: inspectionAddress,
    name: InspectionContract.contractName,
    label: 'contracts.inspection',
    description: 'contracts.descInspection'
  },
  {
    abi: invitationAbi,
    address: invitationAddress,
    name: InvitationContract.contractName,
    label: 'contracts.invitation',
    description: 'contracts.descInvitation'
  },
  {
    abi: userAbi,
    address: userAddress,
    name: UserContract.contractName,
    label: 'contracts.community',
    description: 'contracts.descCommunity'
  },
  {
    abi: voteAbi,
    address: voteAddress,
    name: VoteContract.contractName,
    label: 'contracts.vote',
    description: 'contracts.descVote'
  },
  {
    abi: validationAbi,
    address: validationAddress,
    name: ValidationContract.contractName,
    label: 'contracts.validation',
    description: 'contracts.descValidation'
  },
  {
    abi: validationPoolAbi,
    address: validationPoolAddress,
    name: ValidationPoolContract.contractName,
    label: 'contracts.validationPool',
    description: 'contracts.descValidationPool'
  },
  {
    abi: rcIndexAbi,
    address: rcIndexAddress,
    name: RcIndexContract.contractName,
    label: 'contracts.rcIndex',
    description: 'contracts.descRcIndex'
  }
]
