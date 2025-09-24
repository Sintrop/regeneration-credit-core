import SequoiaRcTokenContract from '../../../data/abis/sequoia/RegenerationCredit.json'
import SequoiaRcImpactContract from '../../../data/abis/sequoia/RegenerationCreditImpact.json'
import SequoiaUserContract from '../../../data/abis/sequoia/CommunityRules.json'
import SequoiaRegeneratorContract from '../../../data/abis/sequoia/RegeneratorRules.json'
import SequoiaRegeneratorPoolContract from '../../../data/abis/sequoia/RegeneratorPool.json'
import SequoiaInspectorContract from '../../../data/abis/sequoia/InspectorRules.json'
import SequoiaInspectorPoolContract from '../../../data/abis/sequoia/InspectorPool.json'
import SequoiaResearcherContract from '../../../data/abis/sequoia/ResearcherRules.json'
import SequoiaResearcherPoolContract from '../../../data/abis/sequoia/ResearcherPool.json'
import SequoiaDeveloperContract from '../../../data/abis/sequoia/DeveloperRules.json'
import SequoiaDeveloperPoolContract from '../../../data/abis/sequoia/DeveloperPool.json'
import SequoiaContributorContract from '../../../data/abis/sequoia/ContributorRules.json'
import SequoiaContributorPoolContract from '../../../data/abis/sequoia/ContributorPool.json'
import SequoiaActivistContract from '../../../data/abis/sequoia/ActivistRules.json'
import SequoiaActivistPoolContract from '../../../data/abis/sequoia/ActivistPool.json'
import SequoiaSupporterContract from '../../../data/abis/sequoia/SupporterRules.json'
import SequoiaInspectionContract from '../../../data/abis/sequoia/InspectionRules.json'
import SequoiaInvitationContract from '../../../data/abis/sequoia/InvitationRules.json'
import SequoiaVoteContract from '../../../data/abis/sequoia/VoteRules.json'
import SequoiaValidationContract from '../../../data/abis/sequoia/ValidationRules.json'
import SequoiaValidationPoolContract from '../../../data/abis/sequoia/ValidationPool.json'
import SequoiaRcIndexContract from '../../../data/abis/sequoia/RegenerationIndexRules.json'

import { ContractListProps } from '@renderer/types/contract'

//Address contracts
///////////////////////testnet
export const sequoiaRcAddress = import.meta.env.VITE_SEQUOIA_RC_ADDRESS
export const sequoiaRcImpactAddress = import.meta.env.VITE_SEQUOIA_RC_IMPACT_ADDRESS
export const sequoiaUserAddress = import.meta.env.VITE_SEQUOIA_COMMUNITY_ADDRESS
export const sequoiaRegeneratorAddress = import.meta.env.VITE_SEQUOIA_REGENERATOR_ADDRESS
export const sequoiaRegeneratorPoolAddress = import.meta.env.VITE_SEQUOIA_REGENERATOR_POOL_ADDRESS
export const sequoiaInspectorAddress = import.meta.env.VITE_SEQUOIA_INSPECTOR_ADDRESS
export const sequoiaInspectorPoolAddress = import.meta.env.VITE_SEQUOIA_INSPECTOR_POOL_ADDRESS
export const sequoiaResearcherAddress = import.meta.env.VITE_SEQUOIA_RESEARCHER_ADDRESS
export const sequoiaResearcherPoolAddress = import.meta.env.VITE_SEQUOIA_RESEARCHER_POOL_ADDRESS
export const sequoiaDeveloperAddress = import.meta.env.VITE_SEQUOIA_DEVELOPER_ADDRESS
export const sequoiaDeveloperPoolAddress = import.meta.env.VITE_SEQUOIA_DEVELOPER_POOL_ADDRESS
export const sequoiaContributorAddress = import.meta.env.VITE_SEQUOIA_CONTRIBUTOR_ADDRESS
export const sequoiaContributorPoolAddress = import.meta.env.VITE_SEQUOIA_CONTRIBUTOR_POOL_ADDRESS
export const sequoiaActivistAddress = import.meta.env.VITE_SEQUOIA_ACTIVIST_ADDRESS
export const sequoiaActivistPoolAddress = import.meta.env.VITE_SEQUOIA_ACTIVIST_POOL_ADDRESS
export const sequoiaSupporterAddress = import.meta.env.VITE_SEQUOIA_SUPPORTER_ADDRESS
export const sequoiaInspectionAddress = import.meta.env.VITE_SEQUOIA_INSPECTION_ADDRESS
export const sequoiaInvitationAddress = import.meta.env.VITE_SEQUOIA_INVITATION_ADDRESS
export const sequoiaVoteAddress = import.meta.env.VITE_SEQUOIA_VOTE_ADDRESS
export const sequoiaValidationAddress = import.meta.env.VITE_SEQUOIA_VALIDATION_ADDRESS
export const sequoiaValidationPoolAddress = import.meta.env.VITE_SEQUOIA_VALIDATION_POOL_ADDRESS
export const sequoiaRcIndexAddress = import.meta.env.VITE_SEQUOIA_RC_INDEX_ADDRESS

export const sequoiaSupporterPoolAddress = '0x751869D00C8C281D5337Cf15623e3537C98F2Df3'

// future mainnet
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
/////////////////// testnet
export const sequoiaRcAbi = SequoiaRcTokenContract.abi
export const sequoiaRcImpactAbi = SequoiaRcImpactContract.abi
export const sequoiaUserAbi = SequoiaUserContract.abi
export const sequoiaRegeneratorAbi = SequoiaRegeneratorContract.abi
export const sequoiaRegeneratorPoolAbi = SequoiaRegeneratorPoolContract.abi
export const sequoiaInspectorAbi = SequoiaInspectorContract.abi
export const sequoiaInspectorPoolAbi = SequoiaInspectorPoolContract.abi
export const sequoiaResearcherAbi = SequoiaResearcherContract.abi
export const sequoiaResearcherPoolAbi = SequoiaResearcherPoolContract.abi
export const sequoiaDeveloperAbi = SequoiaDeveloperContract.abi
export const sequoiaDeveloperPoolAbi = SequoiaDeveloperPoolContract.abi
export const sequoiaContributorAbi = SequoiaContributorContract.abi
export const sequoiaContributorPoolAbi = SequoiaContributorPoolContract.abi
export const sequoiaActivistAbi = SequoiaActivistContract.abi
export const sequoiaActivistPoolAbi = SequoiaActivistPoolContract.abi
export const sequoiaSupporterAbi = SequoiaSupporterContract.abi
export const sequoiaInspectionAbi = SequoiaInspectionContract.abi
export const sequoiaInvitationAbi = SequoiaInvitationContract.abi
export const sequoiaVoteAbi = SequoiaVoteContract.abi
export const sequoiaValidationAbi = SequoiaValidationContract.abi
export const sequoiaValidationPoolAbi = SequoiaValidationPoolContract.abi
export const sequoiaRcIndexAbi = SequoiaRcIndexContract.abi

/////////////////// future mainnet
export const rcAbi = SequoiaRcTokenContract.abi
export const rcImpactAbi = SequoiaRcImpactContract.abi
export const userAbi = SequoiaUserContract.abi
export const regeneratorAbi = SequoiaRegeneratorContract.abi
export const regeneratorPoolAbi = SequoiaRegeneratorPoolContract.abi
export const inspectorAbi = SequoiaInspectorContract.abi
export const inspectorPoolAbi = SequoiaInspectorPoolContract.abi
export const researcherAbi = SequoiaResearcherContract.abi
export const researcherPoolAbi = SequoiaResearcherPoolContract.abi
export const developerAbi = SequoiaDeveloperContract.abi
export const developerPoolAbi = SequoiaDeveloperPoolContract.abi
export const contributorAbi = SequoiaContributorContract.abi
export const contributorPoolAbi = SequoiaContributorPoolContract.abi
export const activistAbi = SequoiaActivistContract.abi
export const activistPoolAbi = SequoiaActivistPoolContract.abi
export const supporterAbi = SequoiaSupporterContract.abi
export const inspectionAbi = SequoiaInspectionContract.abi
export const invitationAbi = SequoiaInvitationContract.abi
export const voteAbi = SequoiaVoteContract.abi
export const validationAbi = SequoiaValidationContract.abi
export const rcIndexAbi = SequoiaRcIndexContract.abi

export const contractsSequoia: ContractListProps[] = [
  {
    abi: sequoiaRcAbi,
    address: sequoiaRcAddress,
    name: SequoiaRcTokenContract.contractName,
    label: 'contracts.regenerationCredit',
    description: 'contracts.descRegenerationCredit'
  },
  {
    abi: sequoiaRcImpactAbi,
    address: sequoiaRcImpactAddress,
    name: SequoiaRcImpactContract.contractName,
    label: 'contracts.rcImpact',
    description: 'contracts.descRcImpact'
  },
  {
    abi: sequoiaRegeneratorAbi,
    address: sequoiaRegeneratorAddress,
    name: SequoiaRegeneratorContract.contractName,
    label: 'contracts.regenerator',
    description: 'contracts.descRegenerator'
  },
  {
    abi: sequoiaRegeneratorPoolAbi,
    address: sequoiaRegeneratorPoolAddress,
    name: SequoiaRegeneratorPoolContract.contractName,
    label: 'contracts.regeneratorPool',
    description: 'contracts.descRegeneratorPool'
  },
  {
    abi: sequoiaInspectorAbi,
    address: sequoiaInspectorAddress,
    name: SequoiaInspectorContract.contractName,
    label: 'contracts.inspector',
    description: 'contracts.descInpector'
  },
  {
    abi: sequoiaInspectorPoolAbi,
    address: sequoiaInspectorPoolAddress,
    name: SequoiaInspectorPoolContract.contractName,
    label: 'contracts.inspectorPool',
    description: 'contracts.descInspectorPool'
  },
  {
    abi: sequoiaResearcherAbi,
    address: sequoiaResearcherAddress,
    name: SequoiaResearcherContract.contractName,
    label: 'contracts.researcher',
    description: 'contracts.descResearcher'
  },
  {
    abi: sequoiaResearcherPoolAbi,
    address: sequoiaResearcherPoolAddress,
    name: SequoiaResearcherPoolContract.contractName,
    label: 'contracts.researcherPool',
    description: 'contracts.descResearcherPool'
  },
  {
    abi: sequoiaDeveloperAbi,
    address: sequoiaDeveloperAddress,
    name: SequoiaDeveloperContract.contractName,
    label: 'contracts.developer',
    description: 'contracts.descDeveloper'
  },
  {
    abi: sequoiaDeveloperPoolAbi,
    address: sequoiaDeveloperPoolAddress,
    name: SequoiaDeveloperPoolContract.contractName,
    label: 'contracts.developerPool',
    description: 'contracts.descDeveloperPool'
  },
  {
    abi: sequoiaContributorAbi,
    address: sequoiaContributorAddress,
    name: SequoiaContributorContract.contractName,
    label: 'contracts.contributor',
    description: 'contracts.descContributor'
  },
  {
    abi: sequoiaContributorPoolAbi,
    address: sequoiaContributorPoolAddress,
    name: SequoiaContributorPoolContract.contractName,
    label: 'contracts.contributorPool',
    description: 'contracts.descContributorPool'
  },
  {
    abi: sequoiaActivistAbi,
    address: sequoiaActivistAddress,
    name: SequoiaActivistContract.contractName,
    label: 'contracts.activist',
    description: 'contracts.descActivist'
  },
  {
    abi: sequoiaActivistPoolAbi,
    address: sequoiaActivistPoolAddress,
    name: SequoiaActivistPoolContract.contractName,
    label: 'contracts.activistPool',
    description: 'contracts.descActivistPool'
  },
  {
    abi: sequoiaSupporterAbi,
    address: sequoiaSupporterAddress,
    name: SequoiaSupporterContract.contractName,
    label: 'contracts.supporter',
    description: 'contracts.descSupporter'
  },
  {
    abi: sequoiaInspectionAbi,
    address: sequoiaInspectionAddress,
    name: SequoiaInspectionContract.contractName,
    label: 'contracts.inspection',
    description: 'contracts.descInspection'
  },
  {
    abi: sequoiaInvitationAbi,
    address: sequoiaInvitationAddress,
    name: SequoiaInvitationContract.contractName,
    label: 'contracts.invitation',
    description: 'contracts.descInvitation'
  },
  {
    abi: sequoiaUserAbi,
    address: sequoiaUserAddress,
    name: SequoiaUserContract.contractName,
    label: 'contracts.community',
    description: 'contracts.descCommunity'
  },
  {
    abi: sequoiaVoteAbi,
    address: sequoiaVoteAddress,
    name: SequoiaVoteContract.contractName,
    label: 'contracts.vote',
    description: 'contracts.descVote'
  },
  {
    abi: sequoiaValidationAbi,
    address: sequoiaValidationAddress,
    name: SequoiaValidationContract.contractName,
    label: 'contracts.validation',
    description: 'contracts.descValidation'
  },
  {
    abi: sequoiaValidationPoolAbi,
    address: sequoiaValidationPoolAddress,
    name: SequoiaValidationPoolContract.contractName,
    label: 'contracts.validationPool',
    description: 'contracts.descValidationPool'
  },
  {
    abi: sequoiaRcIndexAbi,
    address: sequoiaRcIndexAddress,
    name: SequoiaRcIndexContract.contractName,
    label: 'contracts.rcIndex',
    description: 'contracts.descRcIndex'
  }
]

export const contractsMainnet: ContractListProps[] = []
