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

import { ContractListProps } from '@renderer/types/contract'

//Address contracts
///////////////////////testnet
export const sequoiaRcAddress = '0xd39E57c2887b8374924999F732f7A877Ca4bC51a'
export const sequoiaRcImpactAddress = '0xd2653E0C367BdA151d118d476b47E10ba0F726d5'
export const sequoiaUserAddress = '0x0C0912F88F8D44657BCE366839ce32F7A0878a74'
export const sequoiaRegeneratorAddress = '0xBA8C63d39Fb55b7b770BD3Ad2b7eb2b8c4df2aA3'
export const sequoiaRegeneratorPoolAddress = '0x86B1329005008Eb21e8BC3957b12A10186DB59fd'
export const sequoiaInspectorAddress = '0x746E371ea8C2cce3303c448a271051D3f7Be74a4'
export const sequoiaInspectorPoolAddress = '0xB33Dd849a38B2e21B65BB50b5235F1cC0Bb524B4'
export const sequoiaResearcherAddress = '0xDbd727FD2402b3ec2e9E5ef9379bf272a181D362'
export const sequoiaResearcherPoolAddress = '0x544D7BA38423D7Fcd147524b562a0E0b3289Aea1'
export const sequoiaDeveloperAddress = '0x75807c1E92Bd44E99E9A8E4ad51b4f64267D292A'
export const sequoiaDeveloperPoolAddress = '0x007Ab340b3e85C6eED18B5bFADE79D96723CB4D6'
export const sequoiaContributorAddress = '0x96a965EFC2cc7E861b9B95c41910F1CB48CA40B8'
export const sequoiaContributorPoolAddress = '0x4bf22a76676848691e38fe6a10a3aDadF97b850B'
export const sequoiaActivistAddress = '0xc40bB6455BE0C4A47c77Aa799224067C85c63c0e'
export const sequoiaActivistPoolAddress = '0xbc6BA178641E76d7F6C348C16D7BE2Cd688856f4'
export const sequoiaSupporterAddress = '0xd193052c687B641976C9cCd62bcECC63F873F508'
export const sequoiaSupporterPoolAddress = '0xbB502a956f4a27781565cB953dcaECbD90581f23'
export const sequoiaInspectionAddress = '0x35e1845644852f1A6C5b9Fe991B2676A08540875'
export const sequoiaInvitationAddress = '0xc19EF0D42c68340b1741f0c2855881d1a8ae974A'

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
  }
]
