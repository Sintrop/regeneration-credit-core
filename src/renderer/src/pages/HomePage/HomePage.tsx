import { ScreenPage } from '@renderer/components/ScreenPage/ScreenPage'
import { FeedTabs } from './components/FeedTabs/FeedTabs'

export function HomePage(): JSX.Element {
  return (
    <ScreenPage pageTitle="feed">
      <div className="w-full flex flex-col gap-10">
        <FeedTabs />
      </div>
    </ScreenPage>
  )
}
