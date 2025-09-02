import { useUserContext } from '@renderer/hooks/useUserContext'

import { TimesDeveloper } from './TimesDeveloper'
import { TimesResearcher } from './TimesResearcher'
import { TimesContributor } from './TimesContributor'
import { TimesSupporter } from './TimesSupporter'
import { TimesActivist } from './TimesActivist'
import { TimesInspector } from './TimesInspector'
import { TimesRegenerator } from './TimesRegenerator'

export function TimesUser(): JSX.Element {
  const { userType } = useUserContext()

  const Component = component[userType]
  return (
    <div className="flex items-center gap-8 pl-8 border-l">
      <Component />
    </div>
  )
}

const component = {
  1: TimesRegenerator,
  2: TimesInspector,
  3: TimesResearcher,
  4: TimesDeveloper,
  5: TimesContributor,
  6: TimesActivist,
  7: TimesSupporter
}
