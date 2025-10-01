import { InspectionContractProps, InspectionProps } from '@renderer/types/inspection'
import { bigNumberToFloat } from '@renderer/utils/bigNumberToFloat'

function parseInspection(data: InspectionContractProps): InspectionProps {
  return {
    id: bigNumberToFloat(data.id),
    acceptedAt: bigNumberToFloat(data.acceptedAt),
    biodiversityResult: bigNumberToFloat(data.biodiversityResult),
    createdAt: bigNumberToFloat(data.createdAt),
    inspectedAt: bigNumberToFloat(data.inspectedAt),
    inspectedAtEra: bigNumberToFloat(data.inspectedAtEra),
    inspector: data.inspector,
    invalidatedAt: bigNumberToFloat(data.invalidatedAt),
    justificationReport: data.justificationReport,
    proofPhotos: data.proofPhotos,
    regenerationScore: bigNumberToFloat(data.regenerationScore),
    regenerator: data.regenerator,
    status: bigNumberToFloat(data.status),
    treesResult: bigNumberToFloat(data.treesResult),
    validationsCount: bigNumberToFloat(data.validationsCount)
  }
}

export const inspectionAdapter = {
  parseInspection
}
