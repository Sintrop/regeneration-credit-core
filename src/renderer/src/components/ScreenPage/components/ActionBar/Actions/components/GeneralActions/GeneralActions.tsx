import { ActionComponent } from '../ActionComponent/ActionComponent'

export function GeneralActions(): JSX.Element {
  return (
    <div className="flex flex-wrap gap-5">
      <ActionComponent actionName="burnTokens" />
      <ActionComponent actionName="invite" />
      <ActionComponent actionName="addDelation" />
    </div>
  )
}
