interface CheckVacanciesProps {
  userType: number
  producersCount: number
  userTypeCount: number
}

interface ReturnCheckVacanciesProps {
  availableVacancie: boolean
  ammount: number
}

interface ProportionalitySetting {
  proportionality: number
  direct: boolean
}

/** CommunityRules.MINIMUM_REGISTERED_USERS_QUANTITY */
const MINIMUM_REGISTERED_USERS_QUANTITY = 5

/** CommunityRules userTypeSettings (proportionalityOnRegister, directProportionalityRegistration) */
const PROPORTIONALITY_SETTINGS: Record<number, ProportionalitySetting> = {
  2: { proportionality: 20, direct: true },
  3: { proportionality: 10, direct: false },
  4: { proportionality: 10, direct: false },
  5: { proportionality: 10, direct: false },
  6: { proportionality: 10, direct: false }
}

/**
 * Mirrors CommunityRules._registrationProportionalityAllowed, so the app only
 * offers registration when the contract will accept it.
 */
export function checkVacancies(props: CheckVacanciesProps): ReturnCheckVacanciesProps {
  const { producersCount, userType, userTypeCount } = props
  const setting = PROPORTIONALITY_SETTINGS[userType]

  if (!setting) {
    return { availableVacancie: true, ammount: 0 }
  }

  const vacanciesByMinimum = MINIMUM_REGISTERED_USERS_QUANTITY - userTypeCount

  const vacanciesByProportion = setting.direct
    ? producersCount * setting.proportionality - userTypeCount
    : Math.floor(producersCount / setting.proportionality) - userTypeCount + 1

  const ammount = Math.max(vacanciesByMinimum, vacanciesByProportion, 0)

  return {
    availableVacancie: ammount > 0,
    ammount
  }
}
