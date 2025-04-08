export const userTypeToName = {
  0: 'notRegistered',
  1: 'regenerator',
  2: 'inspector',
  3: 'researcher',
  4: 'developer',
  5: 'contributor',
  6: 'activist',
  7: 'supporter',
  9: 'invalidated'
}

export type UserTypeToNameType = keyof typeof userTypeToName
