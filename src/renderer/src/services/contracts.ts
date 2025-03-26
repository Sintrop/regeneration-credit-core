import UserContractJson from '../../../data/abis/UserContract.json'
import SupporterContractJson from '../../../data/abis/SupporterContract.json'
import ResearcherPoolContractJson from '../../../data/abis/ResearcherPool.json'
import ResearcherContractJson from '../../../data/abis/ResearcherContract.json'
import RcTokenIcoContractJson from '../../../data/abis/RcTokenIco.json'
import RcTokenContractJson from '../../../data/abis/RcToken.json'
import RegeneratorPoolContractJson from '../../../data/abis/ProducerPool.json'
import InspectorPoolContractJson from '../../../data/abis/InspectorPool.json'
import DevelopersPoolContractJson from '../../../data/abis/DeveloperPool.json'
import ActivistContractJson from '../../../data/abis/ActivistContract.json'
import ActivistPoolContractJson from '../../../data/abis/ActvistPool.json'
import SintropContractJson from '../../../data/abis/Sintrop.json'
import RegeneratorContractJson from '../../../data/abis/ProducerContract.json'
import InspectorContractJson from '../../../data/abis/InspectorContract.json'
import DeveloperContractJson from '../../../data/abis/DeveloperContract.json'
import ValidatorPoolContractJson from '../../../data/abis/ValidatorPool.json'
import CategoryContractJson from '../../../data/abis/CategoryContract.json'
import InvitationContractJson from '../../../data/abis/InvitationContract.json'
import ContributorContractJson from '../../../data/abis/ContributorContract.json'
import ContributorPoolContractJson from '../../../data/abis/ContributorPool.json'
import { ContractListProps, MethodAbiProps } from '@renderer/types/contract'

//Address contracts
export const validatorContractAddress = '0x648291fb228cdB775123f4B2a5BC896A475457C8'
export const validatorPoolContractAddress = '0xB8E80394b341c29f6dE327CEFb24797bC1BFe40E'
export const userContractAddress = '0x8bE0B014B7Fd2d3F698874C0CCc4EE2684fD6a25'
export const supporterContractAddress = '0x6175a94A5848D793308e844DfAe37ee89313Cc8e'
export const supporterPoolAddress = '0xed0D578fa387d61aa33E0e9762Dda62355B8CfD5'
export const researcherPoolContractAddress = '0xFDa3a4fAd7BDd910897D8E7422475846a53d5A74'
export const researcherContractAddress = '0xB2CE33276Ae84802b91C4E0F51b930f3a5e44F56'
export const rcTokenIconAddress = '0x1e1cc60a91380c81ecabfbd497c72a7f134f39af'
export const RcTokenAddress = '0xA2628da7B5C8B9921E52402438c320e03d191275'
export const producerPoolContractAddress = '0xbaeD2F5C1e389C9909C6d480E096a6C368711C3E'
export const producerContractAddress = '0xE851bF9778d1052696adb90d27392bAcc18dd497'
export const inspectorPoolContractAddress = '0xe81754FbCE05beeE07f8742e1f78487Fb6F26059'
export const inspectorContractAddress = '0x25dcCca15B1211969021F642FC3A746B965E67C9'
export const developersPoolContractAddress = '0x2Cd832AC15EEE83b90ab91c87eC0e467eE315827'
export const developerContractAddress = '0x59900BdCa243242A9666508a52B9A81489aAb459'
export const activistContractAddress = '0xEc12E90A5F173c5d7235e186d02f3ad041B30639'
export const activistPoolContractAddress = '0x0Fbbc578c6F48BA54E5e8A8d45DEB85482ADEa44'
export const sintropContractAddress = '0x62b93FC1CBFFcb6ae6Ffe80D0e022E96aC97760a'
export const categoryContractAddress = '0x8D3157abE0b340e45364CBA8eE8f84AD202CFD7e'
export const invitationContractAddress = '0x206BC8DB206157f639D25315b2D968454F3d725A'
export const contributorContractAddress = '0x52ECDb5E3055890a04e76259971D8Cb2e0c92C71'
export const contributorPoolContractAddress = '0x978a9C4e5670C3C91E6a180448E88a41E8Dc1212'

//testnet
export const sequoiaRegeneratorPoolAddress = '0xbaeD2F5C1e389C9909C6d480E096a6C368711C3E'
export const sequoiaRcAddress = '0xA2628da7B5C8B9921E52402438c320e03d191275'

//Abis contracts
export const sequoiaRegeneratorPoolAbi = RegeneratorPoolContractJson
export const sequoiaRcAbi = RcTokenContractJson
export const DeveloperContractAbi = UserContractJson
export const DeveloperPoolContractAbi = DevelopersPoolContractJson
export const ResearcherContractAbi = UserContractJson
export const InspectorContractAbi = UserContractJson
export const ContributorContractAbi = UserContractJson
export const ActivistContractAbi = UserContractJson

export const contractsSequoia: ContractListProps[] = [
  {
    abi: sequoiaRcAbi,
    address: sequoiaRcAddress,
    name: 'Regeneration Credit',
    label: 'regenerationCredit',
    description: 'Regeneration Credit Token Contract'
  },
  {
    abi: DeveloperContractJson,
    address: developerContractAddress,
    name: 'Developer Contract',
    label: 'developerContract',
    description: 'developerContract'
  },
  {
    abi: DevelopersPoolContractJson,
    address: developersPoolContractAddress,
    name: 'Developer Pool Contract',
    label: 'developerPoolContract',
    description: 'developerPoolContract'
  }
]
