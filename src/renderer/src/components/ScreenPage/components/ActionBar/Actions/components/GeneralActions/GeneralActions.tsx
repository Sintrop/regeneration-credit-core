import { ActionComponent } from '../ActionComponent/ActionComponent'

export function GeneralActions(): JSX.Element {
  return (
    <div className="flex flex-col">
      <ActionComponent actionName="burnTokens" />
      <ActionComponent actionName="addDelation" />
    </div>
  )
}
