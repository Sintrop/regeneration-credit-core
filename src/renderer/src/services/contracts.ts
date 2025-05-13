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
import SequoiaSupporterPoolContract from '../../../data/abis/sequoia/SupporterPool.json'
import SequoiaInspectionContract from '../../../data/abis/sequoia/InspectionRules.json'
import SequoiaInvitationContract from '../../../data/abis/sequoia/InvitationRules.json'
import SequoiaVoteContract from '../../../data/abis/sequoia/VoteRules.json'
import SequoiaValidationContract from '../../../data/abis/sequoia/ValidationRules.json'

import { ContractListProps } from '@renderer/types/contract'

//Address contracts
///////////////////////testnet
export const sequoiaRcAddress = '0x371Ac1b5cA0d8BD04943Cd5F1f4FFec179EBD094'
export const sequoiaRcImpactAddress = '0xB87bd7400367AdfC0131dB780779FE2386969fAc'
export const sequoiaUserAddress = '0xaE8B897990A3D29dA6EFdf500C9a0b815Ab23540'
export const sequoiaRegeneratorAddress = '0x9cABb0eFE319C573f4698C2Db61764ca61C85d03'
export const sequoiaRegeneratorPoolAddress = '0x4c826088E2dbceDf8ddA19914A9cb8635E2981DA'
export const sequoiaInspectorAddress = '0x6cfc55BD0e80F9d99Eaf06fC16a5FE1ecc569f81'
export const sequoiaInspectorPoolAddress = '0xE081D551Ec232218E79088fB645977dde9003dCE'
export const sequoiaResearcherAddress = '0xea6aEa548641fc61DB3DeE1929168Dca35b9DCB1'
export const sequoiaResearcherPoolAddress = '0x224fE1a3415108D05851e3549733950041377872'
export const sequoiaDeveloperAddress = '0x8E7eb9BA350101706E69C0938098F2fC5a62eC7d'
export const sequoiaDeveloperPoolAddress = '0x420eBB4BF017ED00d5989d76A62B99F64151693b'
export const sequoiaContributorAddress = '0x1ef4439F21b4DbfbD921067fF76B56B5Bfd64b4F'
export const sequoiaContributorPoolAddress = '0x14E41788d9537b38783dF5AE10b54B1c44299425'
export const sequoiaActivistAddress = '0x6CAd00D45E6ea39b5a91D05A111d863849Aaa357'
export const sequoiaActivistPoolAddress = '0xC8F6F164c95FFFbeeB4FaC8a2578c1Fdc094E8f8'
export const sequoiaSupporterAddress = '0xe0899E9A8db19654ac65b4E8B1550D5e52d0EF42'
export const sequoiaSupporterPoolAddress = '0x1fCf73965Ff909556E2FCfcF7A0DE262aE74F08D'
export const sequoiaInspectionAddress = '0xCcbb40DE874BFe802E15A12D58060321a0ef0f98'
export const sequoiaInvitationAddress = '0xD57352F40277fDFF5577E64335F44dF03Ac569d0'
export const sequoiaVoteAddress = '0x415259228A9122520CeE88cDAEdf465f17E0aA9f'
export const sequoiaValidationAddress = '0x66F7e2b9fa479D1771A63D2a3955f8aB7A05545C'

// future mainnet
export const rcAddress = '0xB795F59fd970c5272dca65455306030EA08184d7'
export const rcImpactAddress = '0xB800124b6C91c17FD63706B1f7ebF0d6AEc9031A'
export const userAddress = '0x4EF987b3c58A1E1077c723CF87811f3b015Ea5E6'
export const regeneratorAddress = '0xAE4D3f9D7698B1964Ae186bb444fD96ad8d7Cd6e'
export const regeneratorPoolAddress = '0x6D95bbeef2c53EdDC4dbD47fbc6249F40E621822'
export const inspectorAddress = '0xCDA37909e2CF5A5D8E7a5B0c2d6BBB99feE26404'
export const inspectorPoolAddress = '0x8A13E6c091ec35157c0492740108EBED8152597e'
export const researcherAddress = '0x6741e7A944A4aedC0e52Bc11376C13d902C50Dc9'
export const researcherPoolAddress = '0x678d6F552E826862B2F7Fb1b9e26FF81ED08bd8D'
export const developerAddress = '0x99868e83E7fECb934FfE5B1CA7FaD76a86163c4A'
export const developerPoolAddress = '0x2632f7b1dc0f27cb3Acd3C24f231dFc5C77292e3'
export const contributorAddress = '0x85ce790326528f520E90DeFf1e14bA9A17A539a1'
export const contributorPoolAddress = '0xB898f92c0010B1E8801831955CeDDa75af56Ba19'
export const activistAddress = '0xcD641461795895D9De496a4b2f20C20E18963DC6'
export const activistPoolAddress = '0xcCBaF746E2C754C512BDE452AeB4691c0C5055f6'
export const supporterAddress = '0xCC0e9CfE2302A0f861aDdFb2649edEBbAFa47855'
export const supporterPoolAddress = '0x8e2cf67005Cc5F0ad7B470BD038f7B0fc3de0b58'
export const inspectionAddress = '0xC2d9b310a7BC64bc0Fba5A10c1d93635a4aA90C4'
export const invitationAddress = '0x74F92a6e87e68B82e84D902b2a9659fb1AfA3893'
export const voteAddress = '0x415259228A9122520CeE88cDAEdf465f17E0aA9f'
export const validationAddress = '0x66F7e2b9fa479D1771A63D2a3955f8aB7A05545C'


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
export const sequoiaSupporterPoolAbi = SequoiaSupporterPoolContract.abi
export const sequoiaInspectionAbi = SequoiaInspectionContract.abi
export const sequoiaInvitationAbi = SequoiaInvitationContract.abi
export const sequoiaVoteAbi = SequoiaVoteContract.abi
export const sequoiaValidationAbi = SequoiaValidationContract.abi

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
export const supporterPoolAbi = SequoiaSupporterPoolContract.abi
export const inspectionAbi = SequoiaInspectionContract.abi
export const invitationAbi = SequoiaInvitationContract.abi
export const voteAbi = SequoiaVoteContract.abi
export const validationAbi = SequoiaValidationContract.abi

export const contractsSequoia: ContractListProps[] = [
  {
    abi: sequoiaRcAbi,
    address: sequoiaRcAddress,
    name: SequoiaRcTokenContract.contractName,
    label: 'regenerationCredit',
    description: 'Regeneration Credit Token Contract'
  },
  {
    abi: sequoiaRcImpactAbi,
    address: sequoiaRcImpactAddress,
    name: SequoiaRcImpactContract.contractName
  },
  {
    abi: sequoiaRegeneratorAbi,
    address: sequoiaRegeneratorAddress,
    name: SequoiaRegeneratorContract.contractName
  },
  {
    abi: sequoiaRegeneratorPoolAbi,
    address: sequoiaRegeneratorPoolAddress,
    name: SequoiaRegeneratorPoolContract.contractName
  },
  {
    abi: sequoiaInspectorAbi,
    address: sequoiaInspectorAddress,
    name: SequoiaInspectorContract.contractName
  },
  {
    abi: sequoiaInspectorPoolAbi,
    address: sequoiaInspectorPoolAddress,
    name: SequoiaInspectorPoolContract.contractName
  },
  {
    abi: sequoiaResearcherAbi,
    address: sequoiaResearcherAddress,
    name: SequoiaResearcherContract.contractName
  },
  {
    abi: sequoiaResearcherPoolAbi,
    address: sequoiaResearcherPoolAddress,
    name: SequoiaResearcherPoolContract.contractName
  },
  {
    abi: sequoiaDeveloperAbi,
    address: sequoiaDeveloperAddress,
    name: SequoiaDeveloperContract.contractName,
    label: 'developerContract',
    description: 'descDeveloperContract'
  },
  {
    abi: sequoiaDeveloperPoolAbi,
    address: sequoiaDeveloperPoolAddress,
    name: SequoiaDeveloperPoolContract.contractName,
    label: 'developerPoolContract',
    description: 'descDeveloperPoolContract'
  },
  {
    abi: sequoiaContributorAbi,
    address: sequoiaContributorAddress,
    name: SequoiaContributorContract.contractName
  },
  {
    abi: sequoiaContributorPoolAbi,
    address: sequoiaContributorPoolAddress,
    name: SequoiaContributorPoolContract.contractName
  },
  {
    abi: sequoiaActivistAbi,
    address: sequoiaActivistAddress,
    name: SequoiaActivistContract.contractName
  },
  {
    abi: sequoiaActivistPoolAbi,
    address: sequoiaActivistPoolAddress,
    name: SequoiaActivistPoolContract.contractName
  },
  {
    abi: sequoiaSupporterAbi,
    address: sequoiaSupporterAddress,
    name: SequoiaSupporterContract.contractName
  },
  {
    abi: sequoiaSupporterPoolAbi,
    address: sequoiaSupporterPoolAddress,
    name: SequoiaSupporterPoolContract.contractName
  },
  {
    abi: sequoiaInspectionAbi,
    address: sequoiaInspectionAddress,
    name: SequoiaInspectionContract.contractName,
    label: 'inspectionContract',
    description: 'descInspectionContract'
  },
  {
    abi: sequoiaInvitationAbi,
    address: sequoiaInvitationAddress,
    name: SequoiaInvitationContract.contractName
  },
  {
    abi: sequoiaUserAbi,
    address: sequoiaUserAddress,
    name: SequoiaUserContract.contractName
  },
  {
    abi: sequoiaVoteAbi,
    address: sequoiaVoteAddress,
    name: SequoiaVoteContract.contractName
  },
  {
    abi: sequoiaValidationAbi,
    address: sequoiaValidationAddress,
    name: SequoiaValidationContract.contractName
  }
]

export const contractsMainnet: ContractListProps[] = [
  {
    abi: sequoiaRcAbi,
    address: sequoiaRcAddress,
    name: SequoiaRcTokenContract.contractName,
    label: 'regenerationCredit',
    description: 'Regeneration Credit Token Contract'
  },
  {
    abi: sequoiaRcImpactAbi,
    address: sequoiaRcImpactAddress,
    name: SequoiaRcImpactContract.contractName
  },
  {
    abi: sequoiaRegeneratorAbi,
    address: sequoiaRegeneratorAddress,
    name: SequoiaRegeneratorContract.contractName
  },
  {
    abi: sequoiaRegeneratorPoolAbi,
    address: sequoiaRegeneratorPoolAddress,
    name: SequoiaRegeneratorPoolContract.contractName
  },
  {
    abi: sequoiaInspectorAbi,
    address: sequoiaInspectorAddress,
    name: SequoiaInspectorContract.contractName
  },
  {
    abi: sequoiaInspectorPoolAbi,
    address: sequoiaInspectorPoolAddress,
    name: SequoiaInspectorPoolContract.contractName
  },
  {
    abi: sequoiaResearcherAbi,
    address: sequoiaResearcherAddress,
    name: SequoiaResearcherContract.contractName
  },
  {
    abi: sequoiaResearcherPoolAbi,
    address: sequoiaResearcherPoolAddress,
    name: SequoiaResearcherPoolContract.contractName
  },
  {
    abi: sequoiaDeveloperAbi,
    address: sequoiaDeveloperAddress,
    name: SequoiaDeveloperContract.contractName,
    label: 'developerContract',
    description: 'descDeveloperContract'
  },
  {
    abi: sequoiaDeveloperPoolAbi,
    address: sequoiaDeveloperPoolAddress,
    name: SequoiaDeveloperPoolContract.contractName,
    label: 'developerPoolContract',
    description: 'descDeveloperPoolContract'
  },
  {
    abi: sequoiaContributorAbi,
    address: sequoiaContributorAddress,
    name: SequoiaContributorContract.contractName
  },
  {
    abi: sequoiaContributorPoolAbi,
    address: sequoiaContributorPoolAddress,
    name: SequoiaContributorPoolContract.contractName
  },
  {
    abi: sequoiaActivistAbi,
    address: sequoiaActivistAddress,
    name: SequoiaActivistContract.contractName
  },
  {
    abi: sequoiaActivistPoolAbi,
    address: sequoiaActivistPoolAddress,
    name: SequoiaActivistPoolContract.contractName
  },
  {
    abi: sequoiaSupporterAbi,
    address: sequoiaSupporterAddress,
    name: SequoiaSupporterContract.contractName
  },
  {
    abi: sequoiaSupporterPoolAbi,
    address: sequoiaSupporterPoolAddress,
    name: SequoiaSupporterPoolContract.contractName
  },
  {
    abi: sequoiaInspectionAbi,
    address: sequoiaInspectionAddress,
    name: SequoiaInspectionContract.contractName,
    label: 'inspectionContract',
    description: 'descInspectionContract'
  },
  {
    abi: sequoiaInvitationAbi,
    address: sequoiaInvitationAddress,
    name: SequoiaInvitationContract.contractName
  },
  {
    abi: sequoiaUserAbi,
    address: sequoiaUserAddress,
    name: SequoiaUserContract.contractName
  },
  {
    abi: voteAbi,
    address: voteAddress,
    name: SequoiaVoteContract.contractName
  },
  {
    abi: validationAbi,
    address: sequoiaValidationAddress,
    name: SequoiaValidationContract.contractName
  }
]
