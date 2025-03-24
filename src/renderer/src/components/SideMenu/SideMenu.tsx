import { Nav } from './components/Nav'

export function SideMenu(): JSX.Element {
  return (
    <aside className="w-[300px] h-screen fixed bg-green-800 flex flex-col pt-[100px] px-10">
      <Nav />
    </aside>
  )
}
