import SequoiaRcTokenContract from '../../../data/abis/sequoia/RegenerationCredit.json'
import SequoiaRegeneratorContract from '../../../data/abis/sequoia/RegeneratorRules.json'
import SequoiaRegeneratorPoolContract from '../../../data/abis/sequoia/RegeneratorPool.json'
import SequoiaInspectionContract from '../../../data/abis/sequoia/InspectionRules.json'
import SequoiaUserContract from '../../../data/abis/sequoia/CommunityRules.json'
import SequoiaDeveloperContract from '../../../data/abis/sequoia/DeveloperRules.json'
import SequoiaDeveloperPoolContract from '../../../data/abis/sequoia/DeveloperPool.json'

import { ContractListProps } from '@renderer/types/contract'

//Address contracts
///////////////////////testnet
export const sequoiaRcAddress = '0xB795F59fd970c5272dca65455306030EA08184d7'
export const sequoiaUserAddress = '0x4EF987b3c58A1E1077c723CF87811f3b015Ea5E6'
export const sequoiaRegeneratorAddress = '0xAE4D3f9D7698B1964Ae186bb444fD96ad8d7Cd6e'
export const sequoiaRegeneratorPoolAddress = '0x6D95bbeef2c53EdDC4dbD47fbc6249F40E621822'
export const sequoiaDeveloperAddress = '0x99868e83E7fECb934FfE5B1CA7FaD76a86163c4A'
export const sequoiaDeveloperPoolAddress = '0x2632f7b1dc0f27cb3Acd3C24f231dFc5C77292e3'
export const sequoiaInspectionAddress = '0xC2d9b310a7BC64bc0Fba5A10c1d93635a4aA90C4'

//Abis contracts
/////////////////// testnet
export const sequoiaRcAbi = SequoiaRcTokenContract.abi
export const sequoiaRegeneratorPoolAbi = SequoiaRegeneratorPoolContract.abi
export const sequoiaInspectionAbi = SequoiaInspectionContract.abi
export const sequoiaUserAbi = SequoiaUserContract.abi
export const sequoiaDeveloperAbi = SequoiaDeveloperContract.abi
export const sequoiaDeveloperPoolAbi = SequoiaDeveloperPoolContract.abi
export const sequoiaRegeneratorAbi = SequoiaRegeneratorContract.abi

export const contractsSequoia: ContractListProps[] = [
  {
    abi: sequoiaRcAbi,
    address: sequoiaRcAddress,
    name: SequoiaRcTokenContract.contractName,
    label: 'regenerationCredit',
    description: 'Regeneration Credit Token Contract'
  },
  {
    abi: sequoiaDeveloperAbi,
    address: sequoiaDeveloperAddress,
    name: SequoiaDeveloperContract.contractName,
    label: 'developerContract',
    description: 'developerContract'
  },
  {
    abi: sequoiaDeveloperPoolAbi,
    address: sequoiaDeveloperPoolAddress,
    name: SequoiaDeveloperPoolContract.contractName,
    label: 'developerPoolContract',
    description: 'developerPoolContract'
  },
  {
    abi: sequoiaInspectionAbi,
    address: sequoiaInspectionAddress,
    name: SequoiaInspectionContract.contractName,
    label: 'inspectionContract',
    description: 'inspectionContract'
  }
]
