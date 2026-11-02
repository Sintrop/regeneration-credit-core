//mainnet imports
import RcTokenContract from '../../../data/abis/mainnet/RegenerationCredit.json'
import RcImpactContract from '../../../data/abis/mainnet/RegenerationCreditImpact.json'
import RcMarketContract from '../../../data/abis/mainnet/RCMarket.json'
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

// Mainnet addresses, core-contracts/deployed_contracts/mainnet
export const rcAddress = '0x24fD0C0eA35F00625094795aa105fcE15cb6f1Ed'
export const rcImpactAddress = '0x323b2162a7E8cB4b718c03eFd8BacE1C294C55F5'
export const rcMarketAddress = '0xA59CE87F2637084f13057357c9Ee49A47232A769'
export const userAddress = '0xec19012cA2C396EF3390E726095e25a794f34150'
export const regeneratorAddress = '0x984Add883400C6E11241B9109Db59484917dF566'
export const regeneratorPoolAddress = '0xFC222077860d34dEfA62Dd8A848703025B7b75f7'
export const inspectorAddress = '0x753B8cAea6D0BCF23DD29aF0dF2e2E9d0d494E2f'
export const inspectorPoolAddress = '0x3d7C162cf5c18432c3bb8535a96046A5e4E95ABB'
export const researcherAddress = '0x74A6eff5c2E696F683d878710F840ce4c652b4f6'
export const researcherPoolAddress = '0x659962e70B2cD88886461e8165D56fA4C5CB4278'
export const developerAddress = '0x8C2b66D1aB42ebf226fe88a815385D3ce4E752CB'
export const developerPoolAddress = '0xCd74352812802a476161815daD31A0197BC65BC5'
export const contributorAddress = '0x1eA2264b2B881CB8A12f799dbf9A6926c6c8Fba1'
export const contributorPoolAddress = '0xfc2A8ee64FF2a5E26cb150Ffc39e0C1B77b296B4'
export const activistAddress = '0xe6D42dFd5c38f7aC2D81bdfC73cd7e770f235841'
export const activistPoolAddress = '0x138EaB1427437F5B22E834863294a13b5CB9d175'
export const supporterAddress = '0x69a5c30Df857E7AB58fe6f5d6c7F29E0FbEc27C1'
export const inspectionAddress = '0x13A40b1Cacb10A065AdC19e98270a9CC0f583281'
export const invitationAddress = '0xD9B4Fa68b7c42cbA616A809c3F791F5f846906a3'
export const voteAddress = '0xA1235c6f57C330CF564A94E3fdE4e5Bb6F588029'
export const validationAddress = '0xB6b72b88227E81a5b634697a09fffD082Ef22Da2'
export const validationPoolAddress = '0xA9E14EefACeb8b9E83592F6BC692BfdAA6F7f1F1'
export const rcIndexAddress = '0xcd42a990B7A2DA6e529a1B89CCc2439b398cbF4A'

//Abis contracts
export const rcAbi = RcTokenContract.abi
export const rcImpactAbi = RcImpactContract.abi
export const rcMarketAbi = RcMarketContract.abi
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
    abi: rcMarketAbi,
    address: rcMarketAddress,
    name: RcMarketContract.contractName,
    label: 'contracts.rcMarket',
    description: 'contracts.descRcMarket'
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
