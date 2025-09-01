import { useUserContext } from '@renderer/hooks/useUserContext'
import { TimesDeveloper } from './TimesDeveloper'

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
  1: TimesDeveloper,
  2: TimesDeveloper,
  3: TimesDeveloper,
  4: TimesDeveloper,
  5: TimesDeveloper,
  6: TimesDeveloper,
  7: TimesDeveloper
}
