interface CheckVacanciesProps {
  userType: number
  producersCount: number
  userTypeCount: number
}

interface ReturnCheckVacanciesProps {
  availableVacancie: boolean
  ammount: number
}

const INSPECTOR_PROPORTIONALITY = import.meta.env.VITE_INSPECTOR_PROPORTIONALITY
const RESEARCHER_PROPORTIONALITY = import.meta.env.VITE_RESEARCHER_PROPORTIONALITY
const DEVELOPER_PROPORTIONALITY = import.meta.env.VITE_DEVELOPER_PROPORTIONALITY
const CONTRIBUTOR_PROPORTIONALITY = import.meta.env.VITE_CONTRIBUTOR_PROPORTIONALITY
const ACTIVIST_PROPORTIONALITY = import.meta.env.VITE_ACTIVIST_PROPORTIONALITY

export function checkVacancies(props: CheckVacanciesProps): ReturnCheckVacanciesProps {
  const { producersCount, userType, userTypeCount } = props

  const limitInspectors = producersCount * INSPECTOR_PROPORTIONALITY
  const limitResearchers = producersCount / RESEARCHER_PROPORTIONALITY
  const limitDevelopers = producersCount / DEVELOPER_PROPORTIONALITY
  const limitContributors = producersCount / CONTRIBUTOR_PROPORTIONALITY
  const limitActivists = producersCount / ACTIVIST_PROPORTIONALITY

  let availableVacancie: boolean = false
  let ammountVacancies: number = 0

  if (userType === 1) {
    availableVacancie = true
  }

  if (userType === 2) {
    const calcInspector = limitInspectors - userTypeCount
    if (calcInspector >= 1) {
      availableVacancie = true
      ammountVacancies = calcInspector
    }
  }

  if (userType === 3) {
    const calcResearcher = limitResearchers - userTypeCount
    if (calcResearcher >= 1) {
      availableVacancie = true
      ammountVacancies = calcResearcher
    }
  }

  if (userType === 4) {
    const calcDeveloper = limitDevelopers - userTypeCount
    if (calcDeveloper >= 1) {
      availableVacancie = true
      ammountVacancies = calcDeveloper
    }
  }

  if (userType === 5) {
    const calcContributor = limitContributors - userTypeCount
    if (calcContributor >= 1) {
      availableVacancie = true
      ammountVacancies = calcContributor
    }
  }

  if (userType === 6) {
    const calcActivists = limitActivists - userTypeCount
    if (calcActivists >= 1) {
      availableVacancie = true
      ammountVacancies = calcActivists
    }
  }

  if (userTypeCount < 5) {
    availableVacancie = true
  }

  return {
    availableVacancie,
    ammount: Math.floor(ammountVacancies)
  }
}
